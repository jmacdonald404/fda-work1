class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
	has_many :referred_users, :class_name => "User"
	has_one :referrer, :class_name => "User"

	belongs_to :office, optional: true
	has_many :orders
	has_many :user_coupons
	has_many :coupons, through: :user_coupons
  has_many :catering_orders
	has_many :promotion_statuses
	has_many :promotions, through: :promotion_statuses

	validates :phone,	uniqueness: true, allow_blank: true

	validates :email, uniqueness: true
	validates :email, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :update }, allow_blank: true

	before_save :capitalize_name, if: ->(obj){obj.name.present?}

	after_save :send_payment_link_catering, if: ->(obj){obj.stripe_token.blank? && obj.super_user}

	include TaxHelper

	REFERRAL_CODES = ["abcdef", "123456"]

	FIVE_OFF_CODES = [
										"123abc"
									]

	def initialized_order_today
		orders = Order.where(user: self)
									.where(order_status: Order::INITIALIZED)
									.where("created_at > ?", 12.hours.ago)
									.order("created_at DESC")

		if orders.present? && orders.count > 0
			return orders.first
		end
		return nil
	end

	def pending_order_today
		orders = Order.where(user: self)
			.where(order_status: [Order::INITIALIZED, Order::DELIVER_TIME_SET])
			.where("created_at > ?", 12.hours.ago)
			.order("created_at DESC")

		if orders.present? && orders.count > 0
			return orders.first
		end
		return nil
	end

	def welcome_text
		if office.building.status == 1
			activated_building_text
		else
			@alert_message = status_zero_building
		end
		if @alert_message.present?
			begin
	      send_message(self.phone, @alert_message, nil)
	    rescue
	    end
		end
	end

	def food_pick_up_text(meal, deliver_time)
		@alert_message = "Your #{meal} is picked up and on the way! Estimated time for drop-off at reception is between #{(deliver_time.to_time - 5.minutes).strftime("%I:%M %p")} and #{(deliver_time.to_time + 10.minutes).strftime("%I:%M %p")}.\n\nYou'll receive another notification once your food has been dropped off 🚗"
    begin
      send_message(self.phone, @alert_message, nil)
    rescue
    end
	end

	def food_nearby_text(meal)
		@alert_message = "Your #{meal.name} should arrive within the next 5 minutes ⏱"

    begin
      send_message(self.phone, @alert_message, nil)
    rescue
    end
	end

	def food_delivered_text(order_key)
		@alert_message = "🚗 Your lunch has been dropped off at reception with the label #{order_key}. Enjoy!\n\nReply SUPPORT if you have any issues with your order.\n\nReply with a number between 1 and 10 to rate your meal.\n\nWant your next lunch for $5? Share your promo code #{self.referral_code} with a colleague and you'll both get your next lunches for $5 plus tax! Type BALANCE to check your existing credit balance."
		self.update_attribute(:food_survey, true)
		begin
      send_message(self.phone, @alert_message, nil)
    rescue
    end
	end

  def send_confirmation_text
    @alert_message = "deliveryapp.com: Your verification code is #{pin}."
    begin
      send_message(self.phone, @alert_message, nil)
      result = true
    rescue
      result = false
    end

    result
  end

  def card_declined_text(order)
  	@alert_message = "Your order for #{order.menu_item.meal.name} did not process. It looks like there's something wrong with your payment information.\n \nIf you have any questions, reply to this text. We'll try to respond within a few business hours."

    begin
      send_message(self.phone, @alert_message, nil)
    rescue
    end
  end

	def catering_card_declined_text
		@alert_message = "Your catering order payment did not process. It looks like there's something wrong with your payment information.\n \nIf you have any questions, reply to this text. We'll try to respond as soon as possible."

		begin
			send_message(self.phone, @alert_message, nil)
		rescue
		end
	end

  def send_daily_menu(menu)
		user_office_menu = self.office.building.menus.find_by(id: menu.id)
		@alert_message = "Today's lunch arrives around #{self.office.building.delivery_time} and comes from #{user_office_menu.restaurants.uniq.map(&:name).to_sentence}.\n \nTo view the menu in HD visit #{menu.safe_url}\n \nTo order, text ORDER A, ORDER B etc. before 10:30 AM."
		@alert_message += "\n\n🎉 P.S. you have a lunch credit—your next order will be $5 plus tax!" if self.five_order > 0
    @image_url = "#{menu.image_url}"
    begin
      send_message(self.phone, @alert_message, @image_url)
      result = true
    rescue
      result = false
    end
    result
  end

	def send_catering_menu(menu)
		user_office_menu = self.office.menus.find_by(id: menu.id)
		@alert_message = "Aren’t you lucky. #{self.office.name} is buying your lunch today!\n \nGo ahead and order as you normally would, by texting ORDER A, ORDER B etc.\n \nThat’s it! Who said there’s no such thing as a free lunch 😏\n \nToday's lunch arrives around #{self.office.building.delivery_time} and comes from #{menu.restaurants.uniq.map(&:name).to_sentence}.\n \nTo view the menu in HD visit #{menu.shortened_image_url}\n \nText WEEKLY to disable daily menu texts. Don't worry, you'll still receive menus on catering days."
		@image_url = "#{menu.image_url}"
		begin
			send_message(self.phone, @alert_message, @image_url)
			result = true
		rescue
			result = false
		end
		result
	end

	def activated_building_text
		alert_message = "Good news #{self.name}! Starting next week, you'll begin receiving rotating hand-picked lunch menus delivered to #{office.name}'s reception for just $1.\n\nLooking to plan ahead? We send out a weekly menu every Sunday evening to your email inbox!"
		begin
			send_message(self.phone, alert_message, nil)
		rescue
		end
	end

  def self.split_name
    users = User.all
    users.each do |user|
      puts "#{user.id}: #{user.name}-#{user.last_name}"
      if user.last_name.nil? && user.name.present?
        names = user.name.split
        if names.count > 2
          user.update_attributes(
            last_name: names[-1],
            name: names[0..-2].join(" ")
          )
        end
      end
      puts "#{user.id}: #{user.name}-#{user.last_name}"
    end
  end

	def status_zero_building
		"Hey #{self.name}! We’re waiting for more people at your office to sign up for Deliveryapp before we can start the service. We'll make sure to notify you when the service begins.\n\nWant to speed this up? Share your promo code #{self.referral_code} with a colleague and you'll both get lunch for $5 plus tax!"
	end

	def generate_referral_code
		self.referral_code = self.name.upcase + self.phone[-4..-1]
		self.save
	end

	def add_five_order_referral
		self.five_order += 1
		self.save
	end

	def decrement_five_order_referral
		self.five_order -= 1
		self.save
	end

	def late_delivery_text
		message = "🚗 delivery update: your lunch may be a little late. Our driver has encountered abnormal traffic congestion and is currently searching for the best alternative route.\n \nWe'll notify you when your food arrives. Thank you for your patience."
		send_message(self.phone, message, nil)
	end

	def order_delivered_text
		message =
		send_message(self.phone, message, nil)
	end

	def referral_user_text(name)
		# text to user whom referral code was used by a new user
		@referred_message = "You earned it! Your next order will only cost $5 because #{name} used your referral code and placed an order!\n \nKeep it up. There's no limit to how many friends you can refer 🤑"
		begin
			send_message(self.phone, @referred_message, nil)
		rescue
		end
	end

	def request_payment_method(meal_name='meal', amount)
		url_token = Rails.application.routes.url_helpers.order_payment_path("#{self.url_safe_token}")
		host = ""
		Rails.env == "development" ? host = "localhost:3000" : host = "https://deliveryapp.herokuapp.com"
		url = host + url_token
		@message = "You'll need to add a payment method before we can process your #{meal_name} for $#{with_tax(amount)}. Visit this secure link to make it happen 👇\n \n#{url}"
	end

	def send_payment_accepted
		@message = "Your payment method has been successfully added. Thank you."
		begin
			send_message(self.phone, @message, nil)
		rescue
		end
	end

	def food_ordered(random_text)
		@message = random_text
		begin
			send_message(self.phone, @message, nil)
		rescue
		end
	end

	def meal_item_limit_reached(ordered_item)
		@message = "Uh oh! #{ordered_item.meal.name} is sold out for today ☹️ \n \nCould we interest you in something else?"
		begin
			send_message(self.phone, @message, nil)
		rescue
		end
	end

	def past_deadline
		@message = "Hey #{self.name}! Unfortunately, we can't accept orders after 10:30 AM. Please try again tomorrow before the deadline 😋"
		begin
			send_message(self.phone, @message, nil)
		rescue
		end
	end

	def capitalize_name
		self.name = self.name.capitalize
	end

	def send_payment_link
		url_token = Rails.application.routes.url_helpers.order_payment_path("#{self.url_safe_token}")
		host = ""
		Rails.env == "development" ? host = "localhost:3000" : host = "https://deliveryapp.herokuapp.com"
		url = host + url_token
		@message = "You'll need to add a payment method before we can process your catering order. Visit this secure link to make it happen 👇\n \n#{url}"

		begin
			send_message(self.phone, @message, nil)
		rescue
		end
	end

	def reset_payment_link(declined=false)
		self.update_attributes(
			stripe_token: nil,
			reset_payment_request: true,
			user_status: 5
		)

		url_token = Rails.application.routes.url_helpers.order_payment_path("#{self.url_safe_token}")
		host = ""
		Rails.env == "development" ? host = "localhost:3000" : host = "https://deliveryapp.herokuapp.com"
		url = host + url_token
		if declined
			@message = "Hi #{self.name}! It looks like your credit card was declined. Please visit the link below to update the information with a new card or contact your bank if you're certain there's nothing wrong 👇\n \n#{url} \n \nWe'll go ahead and process your order in good faith and manually charge you once you've updated your payment information."
		else
			@message = "Your payment information has been reset. Please visit this secure link to add a new payment method 👇\n \n#{url}"
		end

		begin
			send_message(self.phone, @message, nil)
		rescue
		end
	end

	def send_payment_link_catering
		url_token = Rails.application.routes.url_helpers.order_payment_path("#{self.url_safe_token}")
		host = ""
		Rails.env == "development" ? host = "localhost:3000" : host = "https://deliveryapp.herokuapp.com"
		url = host + url_token
		@message = "Hey #{self.name}! You've been assigned as #{self.office.name}'s administrator. This means whenever your office has catering scheduled, payments will be processed by the credit card you add below 👇\n \n#{url}"

		begin
			send_message(self.phone, @message, nil)
		rescue
		end
	end

	def full_name
		"#{name} #{last_name}"
	end

	def send_reset_complete_message
		@message = "Your payment information has been successfully updated.\n \nIf this was not done by you, please contact support by texting SUPPORT."

		begin
			send_message(self.phone, @message, nil)
		rescue
		end
	end

	def send_general_message(message)
		puts "testing"
		send_message(phone, message, nil)
	end

  private

  def send_message(phone_number, alert_message, image_url)
    @twilio_number = ENV['TWILIO_FROM_NUMBER']
    client = Twilio::REST::Client.new(ENV['TWILIO_ACCOUNT_SID'], ENV['TWILIO_AUTH_TOKEN'])
    message = {
    	to: phone_number,
    	body: alert_message,
			messaging_service_sid: ENV['TWILIO_COPILOT_SID']
    }
    unless image_url.nil?
    	message[:media_url] = image_url
    end
		client.messages.create(message)
  end
end
