class Pairing < ActiveRecord::Base
  has_many :restaurants
  accepts_nested_attributes_for :restaurants, allow_destroy: true
end
