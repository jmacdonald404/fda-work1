class RestaurantsController < ApplicationController
  layout "main"
  def show
    # need admin auth
    if current_admin_user.present?
      @restaurant = Restaurant.find(restaurant_id)
      @restaurant.pairing_id.nil? ? @pairing = Pairing.new : @pairing = Pairing.find(@restaurant.pairing_id)
    else
      redirect_to dashboard_path
    end
  end
  private
  def restaurant_id
    params['id']
  end
end
