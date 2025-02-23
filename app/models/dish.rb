class Dish < ActiveRecord::Base
	belongs_to :restaurant
	# belongs_to :catering_restaurant
	has_many :subselections
	accepts_nested_attributes_for :subselections, allow_destroy: true
	def self.ransackable_associations(auth_object = nil)
		["catering_restaurant", "restaurant", "subselections"]
	end
	def self.ransackable_attributes(auth_object = nil)
	    ["created_at", "description", "df", "dfo", "dietary", "gf", "gfo", "id", "image_url", "image_url2", "meal_type", "name", "notes", "price", "quantity", "restaurant_id", "updated_at", "vg", "vgo"]
	end
end
