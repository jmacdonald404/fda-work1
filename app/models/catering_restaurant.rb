class CateringRestaurant < ActiveRecord::Base
	belongs_to :restaurant
	belongs_to :catering_order
	has_many :catering_dishes
	has_many :dishes
	accepts_nested_attributes_for :catering_dishes, :allow_destroy => true
	def self.ransackable_attributes(auth_object = nil)
        ["catering_order_id", "created_at", "id", "number_of_bags", "pickup_time", "restaurant_id", "updated_at"]
    end
end
