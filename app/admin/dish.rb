ActiveAdmin.register Dish do
  permit_params :name, :restaurant_id, :subselection_id, :id
end