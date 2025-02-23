class DashboardUsersController < ApplicationController
  def new
  end
  def new_session
  end
  def sign_up
    if get_user_params
      puts "brk1"
      begin
        puts "brk2"
        @user = User.create!(get_user_params)
        if @user.save
          puts "brk3"
          session[:user_id] = @user.id
          session[:expires_at] = Time.current + 6.hours

          # #check for applicable promos to autoapply to new users
          # promos = Promotion.where(:active => true, :autoapply => true)

          # #subscribe the new user to any applicable promos
          # promos.each do |promo|
          #   p = PromotionStatus.create!(:active => true, :uses_left => promo.total_uses, :user_id => @user.id, :promotion_id => promo.id)
          #   p.save
          # end
          # sign_in(@user)
          #
          catering_order = CateringOrder.find_by(:id => catering_order_id)
          if catering_order.present?
            if catering_order.catering_dishes.any?
              puts "yeah"
              @catering_dishes = catering_order.catering_dishes
              sign_in(@user)
              respond_to do |format|
                format.js
              end
            end
          else
            sign_in(@user)
            puts "brk4"
            redirect_to '/dashboard'
          end

        end
      rescue => e
        head 422, errors: @user.errors
        puts @user.errors.messages
        # head :ok
      end
    end
    # head :ok, content_type: "text/html"
  end

  def login
    email = get_user_params[:email]
    password = get_user_params[:password]
    @user = User.find_for_authentication(email: get_user_params[:email])
    if @user
      if @user.valid_password?(password)
        session[:user_id] = @user.id
        session[:expires_at] = Time.current + 6.hours
        catering_order = CateringOrder.find_by(:id => catering_order_id)
        if catering_order.present?
          if catering_order.catering_dishes.any?
            # puts "yeah"
            @catering_dishes = catering_order.catering_dishes
            @current_user ||= User.find(session[:user_id])
            puts "#############{@current_user}"
            # sign_in(@user)
            # respond_to do |format|
            #   format.js
            # end
          else
            puts "no"
            sign_in(@user)
            # head :ok, content_type: "text/html"
            # redirect_to '/dashboard'
          end
        else
          puts "no ext"
          sign_in(@user)
          # head :ok, content_type: "text/html"
          # redirect_to '/dashboard'
          # testing
          # respond_to do |format|
          #   format.js {window.location.href = '/dashboard'}
          # end
        end
        # sign_in(@user)
        # head :ok, content_type: "text/html"

      else
        render :json => {invalid_password: !@user.valid_password?(password)}.to_json, :status => 400
      end
    else
      render :json => { invalid_user: @user.nil? }.to_json, :status => 400
    end
  end

  def update
    @user = User.find params[:id]
    # @user.update get_user_params
    puts params['user']['current_password']
    if(current_password.present?)
      puts "current pass check"
      # current_password = params.delete(:current_password)
      puts current_password
      puts @user.valid_password?(current_password)
      if @user.valid_password?(current_password)
        puts "valid current password"
        # check that new pass fits validations and both are correct
        p1 = params['password']
        p2 = params['password_confirmation']
        if(p1 === p2)
         # passwords match
         if(p1.length >= 8)
           #validation step 1
           puts "valid password state"
           @user.update_attributes(:password => p1) #update with new password
           redirect_to "/users/#{params[:id]}", :flash => { :success => "password updated" }
         else
           puts "password isn't long enough"
           redirect_to "/users/#{params[:id]}", :flash => { :error => "password isn't long enough" }
         end
        else
         puts "passwords don't match"
         redirect_to "/users/#{params[:id]}", :flash => { :error => "passwords don't match" }
        end
        else
        puts "invalid"
        # self.assign_attributes(params, *options)
        # self.valid?
        # self.errors.add(:current_password, current_password.blank? ? :blank : :invalid)
        redirect_to "/users/#{params[:id]}", :flash => { :error => "old password is incorrect" }
        false
        end
    else
      redirect_to "/users/#{params[:id]}", :flash => { :error => "old password is blank" }
    end
    @user.update get_user_params
    @user.save
  end

  def update_password_with_password(params, *options)
    # @user = User.find params[:id]
    current_password = params.delete(:current_password)

    result = if valid_password?(current_password)
               update_attributes(params, *options)
             else
               self.assign_attributes(params, *options)
               self.valid?
               self.errors.add(:current_password, current_password.blank? ? :blank : :invalid)
               false
             end

    clean_up_passwords
    result
  end

  def log_out
  end

  private

  def get_user_params
    params.require(:user).permit(
      :email,
      :name,
      :last_name,
      # :current_password,
      :password,
      :password_confirmation,
      :office_address,
      :office_name,
      :address2
    )
  end
  def catering_order_id
    params['catering_order_id']
  end
  def current_password
    params['user']['current_password']
  end
end
