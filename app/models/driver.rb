class Driver < ActiveRecord::Base
  has_many :office_drivers
  has_many :offices, through: :office_drivers, dependent: :destroy

  validates :name, presence: true
  validates :phone,	uniqueness: true, presence: true
  validates :email, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :update }, allow_blank: true

  scope :active, -> { where active: true }

  def send_follow_up_notification(catering_order)
    message = "Hey #{name}!\n\n"
    reminder = "Just a friendly reminder that you have a delivery scheduled today at #{catering_order.delivery_time}\n"
    contact_help = "If you have any issues or concerns, contact Matt @ (604) 318-9466"
    message << reminder
    message << contact_help
    send_message(phone, message)
  end

  def send_general_message(message)
    send_message(phone, message)
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
end