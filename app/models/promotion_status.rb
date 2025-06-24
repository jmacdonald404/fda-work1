class PromotionStatus < ActiveRecord::Base
    belongs_to :user
    belongs_to :promotion
  end