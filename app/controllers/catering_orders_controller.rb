class CateringOrdersController < ApplicationController
  layout "main"
  def index
    if current_user.present?
      @user_orders = current_user.catering_orders.where(:preauthorized => true).order(created_at: :desc)
    else
      redirect_to '/dashboard'
    end
  end
  def show
    # #crappy user auth
    # #change to current_user == user.id
    # if current_user.present?
    #   redirect_to '/dashboard'
    # end
    @order = CateringOrder.find(params[:id])
    @invoice = Stripe::Invoice.retrieve(@order.stripe_invoice_id)
    @catering_dishes = @order.catering_dishes
  end
  def cancel_request
    @order = CateringOrder.find(params[:order])
    @order.update!({status: "cancellation_requested"})
    puts "Emailing admin for CANCEL ORDER REQUEST order: #{@order.id}"
    from_address = "Deliveryapp Support <support@deliveryapp.com>"
    subject = "Cancel Order Request"
    Pony.mail(
        :from => from_address,
        :to => ["support@deliveryapp.com","orders@deliveryapp.com","admin@deliveryapp.com"],
        :subject => "Deliveryapp Order CANCEL REQUEST",
        :html_body => ERB.new(File.read('app/views/user_mailer/admin_cancel.text.erb'),nil,'-').result(binding),
        :via => :smtp,
        :via_options => default_email_options)
    head :ok
  end
  def cancel_order
    # moved to AA controller
  end
end
