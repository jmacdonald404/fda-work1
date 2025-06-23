class CateringDriver < ActiveRecord::Base
	belongs_to :driver
	belongs_to :catering_order
	def self.ransackable_attributes(auth_object = nil)
		["catering_order_id", "created_at", "driver_id", "id", "updated_at"]
	end
end