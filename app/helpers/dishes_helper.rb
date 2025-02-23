module DishesHelper
  def find_existing_dishes_quantity(dish_id)
    @catering_dishes.find_by(dish_id: dish_id)&.quantity || 0
  end
end
