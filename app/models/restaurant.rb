class Restaurant < ActiveRecord::Base
	has_many :meals
	has_many :dishes
	has_many :catering_dishes
	has_many :opening_hours
	# has_many :subselections
	has_many :subselections, through: :dishes
	# belongs_to :pairing
	accepts_nested_attributes_for :meals, allow_destroy: true
	accepts_nested_attributes_for :dishes, allow_destroy: true
	accepts_nested_attributes_for :opening_hours, allow_destroy: true
	accepts_nested_attributes_for :catering_dishes
	accepts_nested_attributes_for :subselections, allow_destroy: true
	# accepts_nested_attributes_for :pairing, allow_destroy: true

	extend FriendlyId
	friendly_id :name, use: [:finders, :slugged]

	def should_generate_new_friendly_id?
		new_record? || slug.blank?
	end

	def open?
		# -7.hours needs to be made more accurate to reflect both pst and pdt
		opening_hours.where("? BETWEEN opens AND closes", Time.now - 7.hours).any?
	end
	scope :open2?, -> { where("? BETWEEN opens AND closes", Time.now - 7.hours) }
  def open3(t)
		opening_hours.where("? BETWEEN opens AND closes", Time.zone.parse(t)).any?
	end
	
	def self.ransackable_associations(auth_object = nil)
    	["catering_dishes", "dishes", "meals", "opening_hours", "pairing", "subselections"]
	end
	def self.ransackable_attributes(auth_object = nil)
	    ["address", "city", "created_at", "daysopen", "description", "id", "latitude", "longitude", "min_quantity", "name", "open_status", "pairing_id", "slug", "subtitle", "updated_at"]
	end
end
