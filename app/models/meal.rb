class Meal < ActiveRecord::Base
	belongs_to :restaurant
	has_many :menu_items
	def self.ransackable_attributes(auth_object = nil)
        ["created_at", "id", "name", "price", "restaurant_id", "updated_at"]
    end
end
