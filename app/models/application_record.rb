class ApplicationRecord < ActiveRecord::Base
  include Ransackable
  primary_abstract_class
end
