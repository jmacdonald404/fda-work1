class CateringDish < ActiveRecord::Base
  belongs_to :dish
  belongs_to :catering_order
  belongs_to :restaurant
  belongs_to :subselection
  belongs_to :catering_restaurant
  accepts_nested_attributes_for :subselection,:allow_destroy => true
  
  def self.ransackable_attributes(auth_object = nil)
    ["catering_order_id", "catering_restaurant_id", "created_at", "dish_id", "id", "notes", "quantity", "restaurant_id", "subselection_id", "updated_at"]
  end
end
