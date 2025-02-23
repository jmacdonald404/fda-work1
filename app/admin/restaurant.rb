# ActiveAdmin.register Pairing
ActiveAdmin.register Restaurant do
  after_save do |restaurant|
    restaurant.subselections.each do |subselection|
      subselection.update!(:restaurant_id => restaurant.id)
    end
  end

  # belongs_to :pairing
# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
permit_params :id, :name, :subtitle, :open_status, :description, :city, :pairing, :address, :min_quantity, daysopen: [],
  dishes_attributes: [:id, :name, :price, :image_url, :image_url2, :dietary, :meal_type, :quantity, :notes, :description, :gf, :df, :vg, :gfo, :dfo, :vgo, :_destroy, subselections_attributes: [:id, :name, :price, :serves, :dietary, :meal_type, :description, :restaurant_id, :_destroy, :gf, :df, :vg, :gfo, :dfo, :vgo]],

  opening_hours_attributes: [:id, :restaurant_id, :opens, :closes, :_destroy],
  pairing_attributes: [:id, :restaurant_id, :pairing_id, :restaurants],
              pairing_id: []
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if params[:action] == 'create' && current_user.admin?
#   permitted
# end

	index do
    selectable_column
  	column :id

    column "Name", :name
    column "Status", :open_status
    column "City", :city
  	actions
  end

  form do |f|
    f.inputs "Details" do
      f.input :name, :label => "Name"
      f.input :subtitle
      # f.input :open_status
      f.input :address
      f.input :min_quantity
      f.input :description
      f.input :daysopen, :label => "Days Open", as: :check_boxes, collection: Date::DAYNAMES
      f.has_many :opening_hours, heading: "Hours of Operation", allow_destroy: true do |hour|
        hour.input :opens
        hour.input :closes
        end
      f.input :city, as: :select,
        collection: ["Vancouver", "Burnaby", "Richmond"],
        include_blank: false
      # text_node link_to "pairings", restaurant_path
      # f.input :pairing, as: :check_boxes, include_blank: false
      # if restaurant.pairing_id == nil
      #   f.input :pairing, :as => :check_boxes, :collection => Restaurant.where.not(id: restaurant.id).order('name ASC').collect { |c| [c[:name], c[:id], {:checked=> restaurant.pairing_id == c[:pairing_id]}] }
      #   # f.input :pairing, as: :check_boxes, collection: Restaurant.where.not(id: restaurant.id).order('name ASC').pluck(:name, :id), allow_destroy: true, new_record: true
      # elsif restaurant.pairing_id == 1
      #   f.input :pairing, :as => :check_boxes, :collection => Restaurant.where.not(id: restaurant.id).order('name ASC').collect { |c| [c[:name], c[:id], {:checked=> restaurant.pairing_id == c[:pairing_id]}] }
      # end
    end
    f.inputs do
      f.has_many :dishes, heading: 'Dishes', allow_destroy: true, new_record: true do |dish|
        dish.input :name
        dish.input :price
        # dish.input :quantity
        dish.input :image_url, label: "Dish thumbnail"
        dish.input :image_url2, label: "Advanced view image"
        # dish.input :dietary, as: :check_boxes,
        #   collection: ["GF", "DF"],
        #   include_blank: true
        dish.input :description
        dish.input :notes
        dish.input :meal_type, as: :select,
          collection: ["MEAT", "VEG"],
          include_blank: false
        dish.input :gf, label: 'Gluten Free'
        dish.input :df, label: 'Dairy Free'
        dish.input :vg, label: 'Vegan'
        dish.input :gfo, label: 'Gluten Free Option'
        dish.input :dfo, label: 'Dairy Free Option'
        dish.input :vgo, label: 'Vegan Option'
        # dish.inputs do
        dish.has_many :subselections, heading: 'Subselections', allow_destroy: true, new_record: true do |subselection|
          subselection.input :restaurant_id,:as => :hidden, :input_html => { :value => restaurant.id }
          subselection.input :name
          subselection.input :description
          subselection.input :price
          subselection.input :serves, label: 'Serves'
          # subselection.input :dietary, as: :check_boxes,
          #            collection: ["GF", "DF"],
          #            # include_blank: true
          #            include_blank: false
          subselection.input :meal_type, as: :select,
                     collection: ["MEAT", "VEG"],
                     include_blank: false
          subselection.input :gf, label: 'Gluten Free'
          subselection.input :df, label: 'Dairy Free'
          subselection.input :vg, label: 'Vegan'
          subselection.input :gfo, label: 'Gluten Free Option'
          subselection.input :dfo, label: 'Dairy Free Option'
          subselection.input :vgo, label: 'Vegan Option'
        end
      end
    end

    f.actions
  end

  show do |restaurant|
    div :class => "table" do
      table do
        tr do
          th "Attributes"
          th "Info"
        end
        tr do
          td "Name"
          td restaurant.name
        end
        tr do
          td "Status"
          td restaurant.open_status
        end
      end
    end

    attributes_table_for restaurant do

      table_for restaurant.dishes do
        column "Name" do |dish|
          dish.name
        end
        column "Price" do |dish|
          dish.price
        end
      end

    end
  end
end
