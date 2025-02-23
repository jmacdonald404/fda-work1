class Office < ActiveRecord::Base
	belongs_to :building
	belongs_to :super_user, class_name: 'User', foreign_key: :super_user
	has_many :placed_orders
	has_many :users
	has_many :office_menus
	has_many :menus, through: :office_menus
	has_many :office_drivers
	has_many :drivers, through: :office_drivers, dependent: :destroy

	scope :with_menu_today, -> { joins(:building).merge(Building.delivery_today)}

	after_create :assign_building_id

	def start_deliver_text
		status = Order::PURCHASED
		users_order_today(status).each do |order|
			if order.user.present?
				order.user.food_pick_up_text(order.menu_item.meal.name, order.deliver_time)
				order.update_attribute(:order_status, Order::PICKED_UP)
			end
		end
	end

	def nearby_text
		status = Order::PICKED_UP
		users_order_today(status).each do |order|
			order.user.food_nearby_text(order.menu_item.meal)
			order.update_attribute(:order_status, Order::NEARBY)
		end
	end

	def delivered_text
		status = Order::PICKED_UP
		users_order_today(status).each do |order|
			order.user.food_delivered_text(order.menu_item.key)
			order.update_attribute(:order_status, Order::ARRIVED)
		end
	end

	def order_delayed
		status = Order::PICKED_UP
		users_order_today(status).each do |order|
			order.user.late_delivery_text
		end
	end

	def deactivate
		self.update_attribute(:status, 0)
	end

	def activate
		unless self.status == 1
			self.update_attribute(:status, 1)
			users.each do |user|
				user.activated_building_text
			end
		end
	end

	def users_order_today(status)
		menus = self.building.menus.where(deliver_day: Time.now.in_time_zone('Pacific Time (US & Canada)').to_date).where("menu_status > ?", 0)
		orders = []
    if menus.count == 1
			office_users_ids = self.users.pluck(:id)
      menu_item_ids = menus.first.menu_items.pluck(:id)
      orders = Order.where(menu_item_id: menu_item_ids).where(user_id: office_users_ids).where(order_status: status)
    end
    return orders
	end

	def super_user
		self.users.where(super_user: true).first
	end

	def catering_orders_today
		menus = self.menus.where(deliver_day: Time.now.in_time_zone('Pacific Time (US & Canada)').to_date).where("menu_status > ?", 0)
		orders = []
		if menus.count == 1
			menu_item_ids = menus.first.menu_items.pluck(:id)
			orders = Order.where(menu_item_id: menu_item_ids).where(order_status: Order::DELIVER_TIME_SET)
		end
		return orders
	end

	def catering_today?
		catering_day == Date.today
	end

	def catering_arrived_message(name, time)
		@message = "🚗 Hey #{contact_name}! Our driver, #{name}, has arrived at your office's reception and is awaiting your instruction to drop off your food. Please have yourself or somebody greet him/her within 10 minutes. Enjoy!\n\nIf you have any issues with the order or wish to speak with support, text SUPPORT between 9 AM and 5 PM."
		begin
			send_message(contact_phone, @message, nil)
		rescue
		end

		OfficeMailer.delay.delivery_arrived(self, contact_email)

		@message = "ARRIVED: #{self.name}, #{name}, @ #{time} on #{Date.today.strftime("%a, %e %b %Y")}"
		begin
			send_message("6041234567", @message, nil)
		rescue
		end
	end

	def food_pick_up_text(name, time, restaurant_name)
		@message = "Deliveryapp: Your food has been picked up by #{name} and is on the way. Expected delivery time is #{self.catering_time} 🚗"
		begin
			send_message(contact_phone, @message, nil)
		rescue
		end

		OfficeMailer.delay.delivery_picked_up(self, contact_email)

		@message = "PICKUP: #{self.name}, #{name}, #{restaurant_name} @ #{time} on #{Date.today.strftime("%a, %e %b %Y")}"
		begin
			send_message("6041234567", @message, nil)
		rescue
		end
	end

	def food_delivered_text(name, time)
		@message = "DELIVERED: #{self.name}, #{name}, @ #{time} on #{Date.today.strftime("%a, %e %b %Y")}"
		begin
			send_message("6041234567", @message, nil)
		rescue
		end
	end

	def assign_building_id
		self.building_id = 34
		self.save!
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
