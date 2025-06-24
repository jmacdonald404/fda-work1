class DashboardController < ApplicationController
  before_action :get_cookies

  layout "main"
  def catering
    restaurant_slug = Restaurant.where(:slug => slug)
    @newsletter_subscriber = NewsletterSubscriber.new
    if restaurant_slug.present?
      restaurant_id = restaurant_slug.last.id
    end
    if current_user
      @user_orders = current_user.catering_orders.where(:preauthorized => true).order(created_at: :desc)
    end
    if get_cookies.present?
      @catering_order = CateringOrder.find(get_cookies)
      @catering_dishes = @catering_order.catering_dishes
    else
      puts "\e[31m ################creating new catering order\e[0m"
      @catering_order = CateringOrder.create()
      @catering_order.user = current_user
      set_catering_cookie(@catering_order.id)
      @catering_dishes = @catering_order.catering_dishes
      puts @catering_order.errors.messages
    end

    if restaurant_id
      puts "\e[31m ################resto id found\e[0m"
      @restaurant_id = restaurant_id
      set_restaurant_id(@restaurant_id)
      @avail3 = Restaurant.order(:name)
      @unavail = Restaurant.order(:name)
      @restaurants = Restaurant.order(:name)
      @restaurant = restaurants.find_by(id: restaurant_id)
      @dishes = restaurants.find_by(id: restaurant_id).dishes
    else
      # @restaurant = restaurants.find(1)
      @res = Restaurant.order(:name).first
      @restos = Restaurant.order(:name).each do |resto|
        if resto.open?
          @res = resto
          break
        end
      end

      @avail2 = Restaurant.select(:id, :name).joins(:opening_hours, :dishes).where("? BETWEEN opening_hours.opens AND opening_hours.closes", "12:00PM").where("array_to_string(daysopen, '||') ILIKE :name", name: "%#{2.days.from_now.in_time_zone('Pacific Time (US & Canada)').strftime('%A')}%").where("dishes.price::FLOAT <= ?", 9999)
      @avail3 = Restaurant.where(:id => @avail2.ids).order(:name)

      @restaurant = @avail3.first
      # @avail3 = Restaurant.order(:name)
      @unavail = Restaurant.order(:name)
      @restaurants = Restaurant.order(:name)
      resto1 = Restaurant.find_by(id: 1)
      @dishes = resto1&.dishes #this looks odd?
      puts "\e[32m ###############no resto id #{@avail3&.first&.name}\e[0m"
      puts "avail3 #{@avail3}"
      puts "avail2 #{@avail2}"
      puts "unavail #{@unavail}"
      puts "rddishert #{resto1&.dishes}"
    end
    render 'dashboard/index'
  end
  
  def update_filter_selections
    request.format = :js
    Rails.logger.debug "Request format: #{request.format}"
    puts day
    puts delivery_time
    puts price_filter
    puts type_filter
    # Time.zone = "UDT"
    # restaurants where day is in daysopen
    filter_query = ""
    if type_filter
      filter_query = type_filter.map do |type|
        if(type == "1")
          "subselections.serves = 1"
        elsif(type == "2")
          "subselections.serves > 1"
        elsif(type == "3")
          "dishes.gf = true"
        elsif(type == "4")
          "dishes.df = true"
        elsif(type == "5")
          "dishes.vg = true"
        end
      end.reject(&:blank?).join(" AND ")
    end
    test = Restaurant.joins(:dishes).where("dishes.price > ?", "10").uniq
    test2 = Restaurant.joins(:dishes).where(filter_query).uniq
    # @avail3 = Restaurant.joins(:opening_hours).where("? BETWEEN opening_hours.opens AND opening_hours.closes", Time.zone.parse(delivery_time)).where("array_to_string(daysopen, '||') ILIKE :name", name: "%#{day}%")
    @avail2 = Restaurant.select(:id, :name).joins(:opening_hours, :dishes, :subselections).where("? BETWEEN opening_hours.opens AND opening_hours.closes", Time.zone.parse(delivery_time)).where("array_to_string(daysopen, '||') ILIKE :name", name: "%#{day}%").where("dishes.price::FLOAT <= ?", price_filter.to_i).where(filter_query).distinct
    @avail3 = Restaurant.where(:id => @avail2.ids).order(:name)
    unavailpre = Restaurant.joins(:opening_hours).where.not("? BETWEEN opening_hours.opens AND opening_hours.closes", Time.zone.parse(delivery_time)) + Restaurant.joins(:opening_hours).where.not("array_to_string(daysopen, '||') ILIKE :name", name: "%#{day}%") + Restaurant.joins(:dishes).where.not("dishes.price <= ?", price_filter)
    if type_filter
      unavailpre += Restaurant.where.not(id: Restaurant.joins(:dishes, :subselections).where(filter_query).uniq.ids)
    end
    # @unavail = unavailpre.uniq
    @unavail = Restaurant.where.not(id: @avail3.ids).order(:name)
    @avail3.each do |r|
      puts r.name
    end
    puts "####"
    @unavail.each do |u|
      puts u.name
    end
    @catering_order = catering_order
    @restaurants = @avail3
    @restaurant_id = get_restaurant_id
    @catering_dishes = @catering_order.catering_dishes
    if outerscope
      #changed for login/signup showing top-of-list resto instead of intended selected-last restaurant
      puts @restaurant_id
      puts restaurant_id
      if @restaurant_id
        @restaurant = Restaurant.friendly.find_by(id: @restaurant_id)
      else
        @restaurant = Restaurant.friendly.find_by(id: restaurant_id)
      end
      @dishes = Dish.joins(:subselections).where(restaurant_id: restaurant_id).where("dishes.price::FLOAT <= ?", price_filter.to_i).where(filter_query).distinct
      puts "\e[31m ####outer##########{@dishes.ids}"
    else
      if @avail3.find_by(id: restaurant_id).present?
        @restaurant = Restaurant.friendly.find_by(id: restaurant_id)
        @dishes = Dish.joins(:subselections).where(restaurant_id: restaurant_id).where("dishes.price::FLOAT <= ?", price_filter.to_i).where(filter_query).distinct
      else #if app's selected restaurant is outside of the scoping filters, set the display restaurant to the first one that is available within scoping filters
        if @avail3.any?
          @restaurant = @avail3.first
          @dishes = Dish.joins(:subselections).where(restaurant_id: @restaurant.id).where("dishes.price::FLOAT <= ?", price_filter.to_i).where(filter_query).distinct
          puts "\e[31m ####else############{@dishes.ids}"
        else #no restaurants match current filter scope
          @restaurant = Restaurant.friendly.find_by(id: restaurant_id)
          @dishes = ""
        end
      end
    end
    respond_to do |format|
      format.js { Rails.logger.debug "Rendering JS format" }
    end
    # head :ok
  end
  
  def check_payment_source
    if current_user.stripe_token.present?
      customer = Stripe::Customer.update(current_user.stripe_token,{source:stripe_token})
      respond_to do |format|
        format.js
      end
    else
      customer = Stripe::Customer.create({
                  name: "#{current_user.name} #{current_user.last_name}",
                  email: current_user.email,
                  source: stripe_token
                 })
      current_user.update_attribute(:stripe_token, customer.id)
      #render add card
      respond_to do |format|
        format.js
      end
    end
  end
  def check_dish_minimum
    @dishquant = {r1: 0, r2: 0}
    @quantities_valid = false
    restaurant_ids = []
    catering_order.subselections.each do |sub|
      restaurant_ids << sub.dish.restaurant_id
    end
    restaurant_ids = restaurant_ids.uniq
    restaurants = Restaurant.friendly.find(restaurant_ids)
    puts restaurant_ids
    catering_order.catering_dishes.each do |dish|
      if dish.subselection.dish.restaurant_id == restaurant_ids.first
        @dishquant[:r1] += dish.quantity*dish.subselection.serves
      else
        @dishquant[:r2] += dish.quantity*dish.subselection.serves
      end
    end

    if restaurant_ids.count > 1
      if @dishquant[:r1] >= Restaurant.friendly.find(restaurants.first.id).min_quantity && @dishquant[:r2] >= Restaurant.friendly.find(restaurants.last.id).min_quantity
        @quantities_valid = true
      end
    else
      puts "hi"
      puts restaurants.first.id
      if @dishquant[:r1] >= Restaurant.friendly.find(restaurants.first.id).min_quantity
        @quantities_valid = true
      end
    end
    puts @dishquant
    puts @quantities_valid
    respond_to do |format|
      format.js
    end
  end
  def bulk_update_catering_dishes
    if catering_dishes_attributes.present? && catering_order.present?
      catering_order.update(
        catering_dishes_attributes: JSON.parse(catering_dishes_attributes),
        delivery_time: delivery_time,
        delivery_date: delivery_date,
        address: delivery_address,
        total_price: total_price
      )
    end
    head :ok
  end

  def edit_catering_item
    # puts subselections


    # @dish = Dish.find(dish_id)
    # @subselecion = Subselection.find(subselections)
    # @restaurant_id = get_restaurant_id || @subselection.restaurant.id
    #
    # @catering_order = ::CateringUpdateService.new(
    #                         catering_order,
    #                         dish_id,
    #                         quantity,
    #                         delivery_time,
    #                         delivery_date
    #                       ).update_order
    # @catering_dishes = @catering_order.catering_dishes
    # @restaurant = restaurants.find_by(id: @restaurant_id)
    # @dishes = restaurants.find_by(id: @restaurant_id).dishes



    subselections.each do |k,v|
      @subselection = Subselection.find(k)
      if (v)
        @restaurant_id = get_restaurant_id || @subselection.restaurant_id || @subselection.dish.restaurant_id
      end
      puts "sub #{k} val #{v}"
      if(v)
        @catering_order = ::CateringUpdateService.new(
            catering_order,
            dish_id,
            k,
            v.to_i,
            delivery_time,
            delivery_date,
            dish_notes
        ).update_order

        @catering_dishes = @catering_order.catering_dishes
        @restaurant = restaurants.find_by(id: @restaurant_id)
        # @dishes = restaurants.find_by(id: @restaurant_id).dishes
      end
    end

    # render 'dashboard/index'
    # head :ok
    respond_to do |format|
      format.js {render layout: false}
    end
  end

  def delete_catering_dish
    puts "#################################### DEL"
    if catering_dish_id
      c = CateringDish.find(catering_dish_id)
      puts "#{c} #####################################!!!!!"
      c.destroy!

      @catering_order = catering_order.reload
      @restaurant_id = get_restaurant_id
      @catering_dishes = catering_order.catering_dishes
      @restaurant = restaurants.find_by(id: @restaurant_id)
      # @dishes = restaurants.find_by(id: @restaurant_id).dishes
      # render 'dashboard/index'
      respond_to do |format|
        format.js {render layout: false}
      end
    end
  end

  def preauth_payment
    puts "/////////////////preauth for #{catering_order.id}"
    total_obj = catering_order.calculate_total
    # turbolinks causing multiple POSTs(?), persistent binding to submit buttons? remove this check once fixed
    if catering_order.preauthorized == false
      catering_order.update(preauthorized: true)
      begin
        if current_user.stripe_token.present?
          # customer = Stripe::Customer.retrieve(customer.stripe_token)
          customer = Stripe::Customer.retrieve(current_user.stripe_token)
          if customer
            catering_dishes = catering_order.catering_dishes

            # Add dishes to invoice
            invoice_items = catering_dishes.each do |catering_dish|
              # Create Invoice Item
              Stripe::InvoiceItem.create({
                # invoice: invoice.id,
                currency: 'cad',
                customer: customer.id,
                description: "#{catering_dish.subselection.dish.name} - #{catering_dish.subselection.name} [#{catering_dish.subselection.dish.restaurant.name}]",
                quantity: catering_dish.quantity,
                unit_amount: catering_dish.subselection.price.to_i*100
              })
            end

            # Add delivery fee to invoice
            delivery_fee = Stripe::InvoiceItem.create({
              currency: 'cad',
              customer: customer.id,
              description: "Delivery Fee",
              unit_amount: 2000
            })

            # Create Invoice
            invoice = Stripe::Invoice.create({
                        customer: customer.id,
                        default_tax_rates: ["txr_1FDzOzHoiu7mlFdUDiH7QmpJ"],
                        auto_advance: true
                      })
          end
          catering_order.update({stripe_invoice_id: invoice.id, total_price: total_price, address: delivery_address})
          puts "/////////////driver message 2"
          catering_order.send_initial_notification
          from_address = "Deliveryapp Support <support@deliveryapp.com>"
          @order = catering_order
          Pony.mail(
              :from => from_address,
              :to => ["admin@deliveryapp.com"],
              :subject => "New Deliveryapp Order [PAID]",
              # :body => "ORDER # FROM DETAILS INVOICE CONFIRMED",
              :html_body => ERB.new(File.read('app/views/user_mailer/admin_confirmed.text.erb')).result(binding),
              :via => :smtp,
              :via_options => default_email_options)
          puts invoice.id
        else
          customer = Stripe::Customer.create({
                      name: "#{current_user.name} #{current_user.last_name}",
                      email: current_user.email,
                      source: stripe_token
                     })

          current_user.update_attribute(:stripe_token, customer.id)

          catering_dishes = catering_order.catering_dishes
          invoice_items = catering_dishes.each do |catering_dish|
            # Create Invoice Item
            Stripe::InvoiceItem.create({
              # invoice: invoice.id,
              currency: 'cad',
              customer: customer.id,
              description: "#{catering_dish.dish.name} - #{catering_dish.dish.restaurant.name}",
              quantity: 1,
              unit_amount: 30000
            })
          end

          invoice = Stripe::Invoice.create({
            customer: customer.id,
            default_tax_rates: ["txr_1EoiK1E1vlBzcDoNbeYXgCgd"],
            auto_advance: true
          })
          puts "/////////////driver message 2"
          catering_order.send_initial_notification
          # Stripe::Invoice.finalize_invoice(invoice.id)
        end

        #check for promo usage and downtick uses counter and expire if necessary
        if current_user&.promotion_statuses&.where("active = true")&.any?
          target_promo = current_user.promotion_statuses.where("active = true").last
          p = target_promo.uses_left
          p = p-1
          target_promo.update(:uses_left => p)
          if p <= 0
            target_promo.update(:active => false, :expired_on => Time.now)
          end
          target_promo.save
        end

      rescue Stripe::CardError => e
        render :json => e.json_body, :status => 400
      end
    end
    # clear_cookies
    head :ok
  end

  def place_catering_order(preauthorized: false)
    if preauthorized
      catering_order.update!(status: 'confirmed_needsdriver')
    else
      catering_order.update!(status: 'needs_payment')
      @order = catering_order
      puts "Emailing customer for UNPAID ORDER"

      # customer = Stripe::Customer.retrieve(invoice.customer)

      # Make sure to customize your from address
      from_address = "Deliveryapp Support <support@deliveryapp.com>"
      subject = "No-payment order received"
    	#necessary?

      Pony.mail(
        :from => from_address,
        :to => current_user.email,
        :subject => subject,
        # :body => payment_received_body(invoice, customer),
        :html_body => ERB.new(File.read('app/views/user_mailer/no_payment.html.erb')).result(binding),
        :via => :smtp,
        :via_options => default_email_options)

      #uncomment to notify admin account of a skipped payment
        # Pony.mail(
      #     :from => from_address,
      #     :to => ["admin@deliveryapp.com"],
      #     :subject => "New Deliveryapp Order [UNPAID]",
      #     # :body => "ORDER # FROM DETAILS INVOICE CONFIRMED",
      #     :html_body => ERB.new(File.read('app/views/user_mailer/admin_nopay.text.erb')).result(binding),
      #     :via => :smtp,
      #     :via_options => default_email_options)

      puts "Email sent to #{current_user.name}"

      #check for promo usage and downtick uses counter and expire if necessary
      if current_user&.promotion_statuses&.where("active = true")&.any?
        target_promo = current_user.promotion_statuses.where("active = true").last
        p = target_promo.uses_left
        p = p-1
        target_promo.update(:uses_left => p)
        puts "Promotion uses left: "+p
        if p <= 0
          target_promo.update(:active => false, :expired_on => Time.now)
        end
        target_promo.save
      end
    end
    clear_cookies
    head :ok
  end

  def update_sms_number
    sms_number = params['sms_number']
    catering_order.update!(sms_number: sms_number, subscribed: true)
    catering_order.confirm_office_order
    head :ok
  end

  def reset_password
    email = params['email']
    from_address = "Deliveryapp Support <support@deliveryapp.com>"
    subject = "Reset password link"
    @user = User.find_by(email: email)

    if @user.present?
      @raw, hashed = Devise.token_generator.generate(User, :reset_password_token)
      @user.reset_password_token = hashed
      @user.reset_password_sent_at = Time.now.utc
      @user.save

      puts "Sending password reset email to #{email}"
      Pony.mail(
          :from => from_address,
          :to => email,
          :subject => subject,
          # :body => "ORDER # FROM DETAILS INVOICE CONFIRMED",
          :html_body => ERB.new(File.read('app/views/user_mailer/reset_password.text.erb')).result(binding),
          :via => :smtp,
          :via_options => default_email_options)
    else
      puts "No account found for #{email} - not sending password reset email"
    end
    head :ok
  end

  def create_newsletter_subscriber
    email = params['email']
    @newsletter_subscriber = NewsletterSubscriber.create(email: email)

    if @newsletter_subscriber.save
      head :ok
      # redirect_to dashboard_path #change to format js to render validation success
    else
      #display errors
      puts @newsletter_subscriber.errors
      # redirect_to dashboard_path #change to format js to render validation errors
    end
  end

  private

  def stripe_token
    params['token_id']
  end

  def restaurants
    @restaurants = Restaurant.order(:name)
  end

  def restaurant_id
    params['restaurant_id']
  end

  def slug
    params['slug']
  end
  
  def total_price
    params['total_price']
  end

  def stripe_invoice_id
    params['stripe_invoice_id']
  end
  
  def dish_id
    params['dish_id']
  end

  def delivery_address
    params['delivery_address']
  end

  def delivery_time
    # params['delivery_time']&.to_i
    params['delivery_time']
  end

  def delivery_date
    params['delivery_date']
  end

  def price_filter
    params['price_filter']
    end

  def type_filter
    params['type_filter']
  end

  def dish_notes
    params['dish_notes']
  end

  def outerscope
    params['outerscope']
  end

  def catering_order
    catering_order_id = catering_order_id ? catering_order_id : get_cookies
    @catering_order = CateringOrder.find_or_create_by(id: catering_order_id)
    if current_user
      current_user.catering_orders << @catering_order unless current_user.catering_orders.include?(@catering_order)
    end
    @catering_order
  end

  def catering_order_id
    params['catering_order_id']
  end

  def catering_dish_id
    params['catering_dish_id']
  end

  def catering_dishes_attributes
    params['catering_dishes_attributes']
  end

  def subselections
    params['subselections']
  end

  def day
    params['day']
  end

  def quantity
    params['dish_quantity']&.to_i
  end

  def set_catering_cookie(catering_order_id)
    cookies[:catering_order_id] = {
      :value => catering_order_id,
      :expires => 1.hours.from_now
    } unless cookies[:catering_order_id] == catering_order_id
  end

  def get_cookies
    cookies[:catering_order_id]
  end

  def set_restaurant_id(restaurant_id)
    cookies[:restaurant_id] = {
      :value => restaurant_id,
      :expires => 1.hours.from_now
    } unless cookies[:restaurant_id] == restaurant_id
  end

  def get_restaurant_id
    cookies[:restaurant_id]
  end

  def clear_cookies
    cookies.delete :restaurant_id
    cookies.delete :catering_order_id
  end

  def invoice_items

  end
end