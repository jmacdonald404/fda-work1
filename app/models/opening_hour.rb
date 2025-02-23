class OpeningHour < ActiveRecord::Base
  belongs_to :restaurant
  def self.ransackable_attributes(auth_object = nil)
    ["closes", "created_at", "day", "id", "opens", "restaurant_id", "updated_at", "valid_from", "valid_through"]
  end
end
