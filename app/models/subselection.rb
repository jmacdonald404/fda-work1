class Subselection < ActiveRecord::Base
  belongs_to :dish
  # belongs_to :restaurant
  def self.ransackable_associations(auth_object = nil)
      ["dish"]
  end
  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "description", "df", "dfo", "dietary", "dish_id", "gf", "gfo", "id", "meal_type", "name", "price", "restaurant_id", "serves", "updated_at", "vg", "vgo"]
  end
end
