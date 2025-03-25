class UsersController < ApplicationController
  include Webhookable

  layout "main"

  def show
    if current_user
      if current_user.catering_orders.present?
        @user_orders = current_user.catering_orders.where(:preauthorized => true).order(created_at: :desc)
      else
        @user_orders = nil
      end
    else
      redirect_to "/login"
    end
  end
  def new
    path = request.fullpath
    @page = if path.start_with?("/location")
              "location"
            elsif path.start_with?("/verify")
              "verify"
            elsif path.start_with?("/profile")
              "profile"
            elsif path.start_with?("/location")
              "location"
            elsif path.start_with?("/payment")
              "payment"
            elsif path.start_with?("/phone")
              "phone"
            end

    user = User.new
    @user = if @page == "location"
              User.new
            else
              current_user
            end
    if @user.nil?
      redirect_to dashboard_path
    else
      if @page == "location"
        @office_list = Office.all.order(:name).collect do |office|
          office_building = office.building.present? ? office.building.name : "Building Placeholder"
          if office_building
            {building: office_building, office_name: "#{office.name}", office_address: "#{office.address}, #{office.city}, #{office.province}", office_id: office.id, office_building: "#{office.name} — #{office_building}"}
          end
        end
      end

      respond_to do |format|
        format.html
        format.json { render json: @user }
      end
    end
  end

  def create
    @user = User.new(get_office_params)
    if @user.save
      session[:user_id] = @user.id
      session[:expires_at] = Time.current + 3.hours
      @user.update_attribute(:user_status, 1)
      @user.update_attribute(:url_safe_token, SecureRandom.urlsafe_base64)
      redirect_to signup_phone_url
    end
  end

  def update
    @user = current_user
    if @user.nil?
      redirect_to dashboard_path
    else
      case @user.user_status
      when 1
        pin = rand(0000..9999).to_s.rjust(4, "0")
        phone = get_phone_params['phone'].scan(/[0-9]/).join
        begin
          @user.update!({'phone' => phone, 'pin' => pin, 'user_status' => 2})
          @user.send_confirmation_text
          redirect_to signup_verify_url
        rescue => e
          @user.errors[:base] << "Sorry, it looks like this phone number is already in use."
          redirect_to signup_phone_url, :flash => { :error => @user.errors[:base].join('<br>') }
        end
      when 2
        if @user.pin == get_pin_params[:pin]
          @user.update_attribute(:user_status, 4)
          redirect_to signup_profile_url
        else
          @user.errors[:base] << "Sorry, that's not the correct PIN we sent you. Try again"
          redirect_to signup_verify_url, :flash => { :error => @user.errors[:base].join('<br>') }
        end
      when 4
        referral_code = get_referral_code['referral_code']
        referral = false
        if referral_code.present?
          referral_code = referral_code.squish.upcase

          first_name = get_name_params
          first_name['name'] = get_name_params['name'].gsub(/\s+/, "")
          @user.update(first_name)
          @user.update(get_email_params)

          if @user.save
            promo_code    = User::REFERRAL_CODES.include?(referral_code)
            five_off_code = User::FIVE_OFF_CODES.include?(referral_code)
            referral_user = User.find_by(referral_code: referral_code)
            if !@user.user_id.present? || referral_user.present? || promo_code.present? || five_off_code.present?
              referral = true
              referral_flash = (referral_user.present? || promo_code.present?) ? "Referral Success!" : "$5 Off!"
              @user.update_attribute(:referrer, referral_user) unless promo_code.present? || five_off_code.present?
              referral_user.referred_users << @user unless promo_code.present? || five_off_code.present?
              @user.add_five_order_referral
              @user.update_attribute(:user_status, 5)
              @user.generate_referral_code
              @user.welcome_text
              redirect_to thankyou_url, :flash => { :success => referral_flash }
            else
              @user.errors[:base] << "Promo code is not valid"
              redirect_to signup_profile_url, :flash => { :error => @user.errors.full_messages.join('<br>') }
            end
          end
        else
          @user.update(get_name_params)
          @user.update(get_email_params)
          @user.update_attribute(:user_status, 5)
          @user.generate_referral_code
          @user.welcome_text
          redirect_to thankyou_url
        end
      when 5
        @user.update(get_stripe_token_params)
        begin
          customer = Stripe::Customer.create(
            card: @user.stripe_token,
            description: "#{@user.name} #{@user.last_name}",
            email: @user.email
          )
          puts "3"
          @user.update_attributes(
            user_status: 6,
            stripe_token: customer.id
          )

          # double check URL
          redirect_to cc_complete_url
        rescue Stripe::CardError => e
          @user.errors[:base] << e.message
          redirect_to signup_payment_url, :flash => { :error => @user.errors.full_messages.join('<br>') }
        rescue => e
          @user.errors[:base] << e.message
          redirect_to signup_payment_url, :flash => { :error => @user.errors.full_messages.join('<br>') }
        end
      end
    end
  end

  def no_office_found
    if !current_user.nil?
      current_user.update_attribute(:user_status, 3)
    end

    redirect_to dashboard_path
  end

  def thankyou
    @user = current_user
    if @user.nil?
      redirect_to dashboard_path
    end
  end

  def order_payment
    url_token = params[:url_safe_token]
    @user = User.find_by(url_safe_token: url_token)
    render :order_payment
  end

  def register_payment
    @user = User.find(params['user']['user_id'])
    @user.update(get_stripe_token_params)
    begin
      customer = Stripe::Customer.create(
        card: @user.stripe_token,
        description: "#{@user.name} #{@user.last_name}",
        email: @user.email
      )
      @user.update_attributes(
        user_status: 6,
        stripe_token: customer.id
      )
      if !@user.reset_payment_request
        order = @user.pending_order_today
        if Order.can_order?
          if order.present?
            response = order.random_created_text(order)
            if order.menu_item.limit > 0
              order.menu_item.decrement!(:limit)
              order.menu_item.menu.decrement!(:limit)
              order.update_attribute(:order_status, 1)
              @user.food_ordered(response)
            else
              @user.meal_item_limit_reached(order.menu_item)
              order.destroy!
            end
          end
        else
          @user.past_deadline
        end
      else
        @user.update_attributes(reset_payment_request: false)
        @user.send_reset_complete_message
      end
      render :cc_complete
    rescue Stripe::CardError => e
      @user.errors[:base] << e.message
      redirect_to signup_payment_url, :flash => { :error => @user.errors.full_messages.join('<br>') }
    rescue => e
      @user.errors[:base] << e.message
      redirect_to signup_payment_url, :flash => { :error => @user.errors.full_messages.join('<br>') }
    end
  end

  def cc_complete
  end

  private

  def get_phone_params
    params.require(:user).permit(:phone)
  end

  def get_pin_params
    params.require(:user).permit(:pin)
  end

  def get_email_params
    params.require(:user).permit(:email)
  end

  def get_name_params
    params.require(:user).permit(:name)
  end

  def get_bday_params
    # params.require(:user).permit(:birthday)
    # need migration first
  end

  def get_office_params
    params.require(:user).permit(:office_id)
  end

  def get_stripe_token_params
    params.require(:user).permit(:name, :last_name, :stripe_token)
  end

  def get_referral_code
    params.require(:user).permit(:referral_code)
  end
end




# 1. Image for each menu
# 2. place order -> payment
# 3. admin send status update text

# Manually schedule menu items with image upload

# contact form


# menu filters: map filter




# 1. icon
# 2. font
# 3. space in header/footer/body
# 4. name/creditcard page merge to 1 (fields two lines)
# 5. header/subheader in each page
# 6. phone number placeholder
# 7. hover color and text for buttons
# 8. Mobile menu

# 9. ADMIN users under apartments for deliver send messages


# Twilio request for status response