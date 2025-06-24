# if Rails.env == "production"
# 	Stripe.api_key = ENV['STRIPE_API_KEY']
# 	STRIPE_PUBLIC_KEY = ENV['STRIPE_PUBLIC_KEY']
# else
#
#
Stripe.api_key = ENV['STRIPE_API_KEY']
STRIPE_PUBLIC_KEY = ENV['STRIPE_PUBLIC_KEY']
StripeEvent.signing_secret = ENV['STRIPE_SIGNING_SECRET']


# end

StripeEvent.configure do |events|
    # events.subscribe 'charge.failed' do |event|
    # change to payment.succeeded after testing done
    events.subscribe 'invoice.payment_succeeded' do |event|
    # Define subscriber behavior based on the event object
    # event.class       #=> Stripe::Event
    # event.type        #=> "charge.failed"
    # event.data.object #=> #<Stripe::Charge:0x3fcb34c115f8>
        puts "invoice created webhook"
        puts event.data.object
        email_invoice_receipt(event.data.object)
    end

    events.all do |event|
    # Handle all event types - logging, etc.
        if event.type == 'charge.succeeded' && event.data.object.amount
            puts "webhook event: successful charge"
        end
    end
end

def email_invoice_receipt(invoice)
puts "Emailing customer for invoice: #{invoice.id} amount: #{format_stripe_amount(invoice.total)}"

customer = Stripe::Customer.retrieve(invoice.customer)

# Make sure to customize your from address
from_address = "Deliveryapp Support <support@deliveryapp.com>"
subject = "Your payment has been received"
#necessary?
@invoice = invoice
@customer = customer

Pony.mail(
:from => from_address,
:to => customer.email,
:subject => subject,
# :body => payment_received_body(invoice, customer),
:html_body => ERB.new(File.read('app/views/user_mailer/receipt_email.html.erb')).result(binding),
:via => :smtp,
:via_options => default_email_options)


puts "Email sent to #{customer.email}"
end
def format_stripe_amount(amount)
sprintf('$%0.2f', amount.to_f / 100.0).gsub(/(\d)(?=(\d\d\d)+(?!\d))/, "\\1,")
end

def format_stripe_timestamp(timestamp)
Time.at(timestamp).strftime("%m/%d/%Y")
end

def payment_received_body(invoice, customer)
subscription = invoice.lines.data
<<EOF
Dear #{customer.email}:

This is a receipt for your order. This is only a receipt, 
no payment is due. Thanks for your continued support!

-------------------------------------------------
RECEIPT - #{Time.now.strftime("%m/%d/%Y")}

Email: #{customer.email}
Amount: #{format_stripe_amount(invoice.total)} (USD)

#{subscription[0].description}


-------------------------------------------------

EOF
end

# You can customize this for whatever email provider you want to use,
# like Mailgun, SendGrid, or even Gmail. These settings are for Mailgun
def default_email_options
{ 
    :address              => "smtp.gmail.com",
:port                 => 587,
:user_name            => "hello@deliveryapp.com",
:password             => ENV['GMAIL_PASSWORD'],
:authentication       => "plain",
# :enable_starttls_auto => true
}
end