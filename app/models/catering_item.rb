class CateringItem < ActiveRecord::Base
  belongs_to :catering_order
  def self.ransackable_attributes(auth_object = nil)
    ["catering_order_id", "created_at", "id", "name", "notes", "quantity", "updated_at"]
  end
end