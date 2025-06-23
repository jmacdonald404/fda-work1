class CateringOrder < ActiveRecord::Base
  
  def self.ransackable_associations(auth_object = nil)
    ["catering_dishes", "catering_drivers", "catering_items", "catering_restaurants", "dishes", "drivers", "office", "restaurants", "subselections", "user"]
  end
  def self.ransackable_attributes(auth_object = nil)
    ["address", "cancelled_at", "charge", "charge_id", "created_at", "delivery_date", "delivery_time", "first_delivery_reminder", "id", "notify_driver", "office_id", "order_type", "preauthorized", "sms_number", "status", "stripe_invoice_id", "subscribed", "total_price", "updated_at", "user_id"]
  end

  belongs_to :office, optional: true # TO BE DEPRECATED
  belongs_to :user, optional: true # maybe remove optional true if possible

  has_many :catering_items # TO BE DEPRECATED

  has_many :catering_dishes
  has_many :dishes, through: :catering_dishes
  has_many :subselections, through: :catering_dishes

  has_many :catering_drivers
  has_many :drivers, through: :catering_drivers, dependent: :destroy

  has_many :catering_restaurants # TO BE DEPRECATED
  has_many :restaurants, through: :catering_restaurants, dependent: :destroy #TO BE DEPRECATED

  accepts_nested_attributes_for :catering_dishes, :allow_destroy => true
  accepts_nested_attributes_for :catering_items, :allow_destroy => true
  accepts_nested_attributes_for :office, :allow_destroy => true
  accepts_nested_attributes_for :restaurants, :allow_destroy => true
  accepts_nested_attributes_for :catering_restaurants, :allow_destroy => true

  STATUSES = %w[pending flagged needs_payment confirmed_needsdriver confirmed_ready picked_up arrived complete cancellation_requested cancelled]
  ORDER_TYPES = %w[admin team manual]

  DELIVERY_TIME = {
    1 => "12:00 PM - 12:15 PM",
    2 => "12:15 PM - 12:30 PM",
    3 => "12:30 PM - 12:45 PM",
    4 => "12:45 PM - 1:00 PM",
    5 => "1:00 PM - 1:15 PM",
    6 => "1:15 PM - 1:30 PM"
  }
  after_create :send_initial_notification

  def confirm_office_order
    if catering_restaurants.present?
      restaurants = Restaurant.find(catering_restaurants.pluck(:restaurant_id).uniq)
    else
      restaurants = Restaurant.find(subselections.pluck(:restaurant_id).uniq)
    end

    restaurants_text = " #{restaurants.first.name}"
    if restaurants.length > 1
      restaurants_text << " and #{restaurants.last.name}"
    end

    message = "You've been successfully subscribed to receive delivery updates for your order on #{delivery_date.strftime("%A, %B %d %Y")} - #{delivery_time.strip} at #{user.office_address} from" + restaurants_text + "."

    send_message(sms_number, message)
  end

  def send_initial_notification#(catering_items, catering_office, catering_restaurants)
    puts "DRIVER SMS TEST 1"
    if drivers.present? && !notify_driver
      puts "DRIVER SMS TEST 2"
      message = "Hey #{drivers.first.name}, you have a delivery scheduled on #{delivery_date.strftime("%A, %B %d %Y")}\n\n"

      scheduled_time = "Delivery Time: #{delivery_time.strip}\n\n"

      restaurants_text = "Restaurants:\n"
      if catering_restaurants.present?
        restaurants = Restaurant.find(catering_restaurants.pluck(:restaurant_id).uniq)
      else
        restaurants = Restaurant.find(subselections.pluck(:restaurant_id).uniq)
      end
      restaurants.each { |r| restaurants_text << "#{r.name}\nPick Up Time: #{catering_restaurants.find_by(restaurant_id: r.id).pickup_time}\nBags: #{catering_restaurants.find_by(restaurant_id: r.id).number_of_bags}\n\n" }

      catering_dishes_text = "Food to pickup:\n"
      catering_dishes.each { |cd| catering_dishes_text << "Dish: #{cd.dish.name} x #{cd.quantity}\n\n"}

      catering_office = "Office Delivery Address:\n#{user.office_name}\n#{user.office_address}\n\n"
      catering_contact = "If you have any issues entering the office, please contact the office admin, #{user.full_name}\n\n"# add in user phone eventually at #{user.phone}.\n\n"

      contact_help = "Any restaurant or delivery related issues, contact an admin"

      [scheduled_time, restaurants_text, catering_dishes_text, catering_office, catering_contact, contact_help].each { |m| message << m}
      send_message(drivers.first.phone, message)
    end
  end

  def send_driver_follow_up
    driver_message = ""
    message = "Hey #{drivers.first.name}! Friendly reminder that you have a delivery scheduled today at #{delivery_time}\n\n"
    help = "To confirm that you are able to fulfill this delivery, please text back YES or NO within 60 minutes."
    [message, help].each { |m| driver_message << m}
    send_message(drivers.first.phone, driver_message)
  end

  def confirm_catering(message)
    message = message.downcase
    if (message == "yes") # YES CAN DELIVER

      if catering_restaurants.present?
        restaurants = Restaurant.find(catering_restaurants.pluck(:restaurant_id).uniq)
      else
        restaurants = Restaurant.find(subselections.pluck(:restaurant_id).uniq)
      end
      
      if restaurants.count >= 2
        driver_text = "Thanks for confirming your availability. For today's delivery, you'll be picking up from:\n
           #{restaurants.first.name} located at #{restaurants.first.address} by #{catering_restaurants.find_by(restaurant_id: restaurants.first.id).pickup_time}\n\n
           #{restaurants.last.name} located at #{restaurants.last.address} by #{catering_restaurants.find_by(restaurant_id: restaurants.last.id).pickup_time}.\n\nOnce you have the food in the bag, text back PICKUP."
        admin_text = "#{drivers.first.name} is confirmed for #{delivery_time} delivery to #{user.office_name} from #{restaurants.first.name} and #{restaurants.last.name}."
      else
        driver_text = "Thanks for confirming your availability. For today's delivery, you'll be picking up from #{restaurants.first.name} located at #{restaurants.first.address} by #{catering_restaurants.find_by(restaurant_id: restaurants.first.id).pickup_time}.\n\nOnce you have the food in the bag, text back PICKUP."
        admin_text = "#{drivers.first.name} is confirmed for #{delivery_time} delivery to #{user.office_name} from #{restaurants.first.name}."
      end

      self.update_attribute("notify_driver", true)
      send_message("6041234567", admin_text)
      send_message(drivers.first.phone, driver_text)
    else # NO CANT DELIVER
      restaurants = Restaurant.find(subselections.pluck(:restaurant_id).uniq)
      if restaurants.count >= 2
        admin_text = "#{drivers.first.name}, #{drivers.first.phone} is not able to fulfill delivery for #{delivery_time} to #{user.office_name} from #{restaurants.first.name} and #{restaurants.last.name}."
      else
        admin_text = "#{drivers.first.name}, #{drivers.first.phone} is not able to fulfill delivery for #{delivery_time} to #{user.office_name} from #{restaurants.first.name}."
      end
      driver_text = "We appreciate the update. In the future, please let us know at least 48+ hours in advance if you cannot fulfill a delivery."

      self.update_attribute("notify_driver", true)
      send_message("6041234567", admin_text)
      send_message(drivers.first.phone, driver_text)
    end
  end

  def no_response_driver
    driver_text = "Hmm.. we didn't hear back from you for today's scheduled delivery. Please contact an admin ASAP to resolve this issue."
    admin_text = "NO RESPONSE - #{drivers.first.name}, #{drivers.first.phone} did not respond to confirmation SMS."
    self.update_attribute("notify_driver", true)
    send_message(drivers.first.phone, driver_text)
    send_message("6041234567", admin_text)
  end

  def calculate_total
    subtotal = catering_dishes.map do |catering_dish|
      quantity = catering_dish.quantity
      cost = dollars_to_cents(catering_dish.subselection.price)
      (quantity * cost)
    end
    subtotal = subtotal.sum
    delivery_fee = dollars_to_cents(20)
    tax = (subtotal + delivery_fee) * 0.05
    total = (subtotal + delivery_fee + tax).round
    {total: total, tax: tax, subtotal: subtotal, delivery_fee: delivery_fee}
  end

  private

  def send_message(phone_number, alert_message)
    @twilio_number = ENV['TWILIO_FROM_NUMBER']
    client = Twilio::REST::Client.new(ENV['TWILIO_ACCOUNT_SID'], ENV['TWILIO_AUTH_TOKEN'])
    message = {
      to: phone_number,
      body: alert_message,
      messaging_service_sid: ENV['TWILIO_COPILOT_SID']
    }
    client.messages.create(message)
  end

  def dollars_to_cents(dollars)
    (100 * dollars.to_r).to_i
  end
end
