class CateringDriver < ActiveRecord::Base
	belongs_to :driver
	belongs_to :catering_order
end