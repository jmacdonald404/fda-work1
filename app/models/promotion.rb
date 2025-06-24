class Promotion < ActiveRecord::Base
    has_many :promotion_statuses
    has_many :users, through: :promotion_statuses
  end