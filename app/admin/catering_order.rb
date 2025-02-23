ActiveAdmin.register CateringOrder do
# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  permit_params :office, :subscribed, :user_id, :address, :status, :order_type, :office_id, :delivery_date, :delivery_time, driver_ids: [], restaurant_ids: [],
    catering_items_attributes: [:name, :quantity, :_destroy],
    catering_restaurants_attributes: [:restaurant_id, :pickup_time, :number_of_bags, :_destroy, catering_dishes_attributes: [:restaurant_id, :catering_restaurant_id, :dish_id, :subselection_id, :quantity, :restaurant, :dish, :subselection, :_destroy, :id]]

  # actions :index, :show, :destroy, :create


  controller do
    def update
      @order = CateringOrder.find params[:id]
      update! do |format|
        format.html {
          if params['cancel']
            if   @order
              @invoice = Stripe::Invoice.retrieve(@order.stripe_invoice_id)
              if @invoice.charge.present?
                # refund charge
                Stripe::Refund.create({ charge: @invoice.charge })
              # else
              #   # cancel invoice
              #   Stripe::Invoice.delete(@invoice.id)
              end
              @order.update!({status: "cancelled", cancelled_at: Time.now})
              puts "Emailing customer for CANCELLED ORDER"

              # customer = Stripe::Customer.retrieve(invoice.customer)

              # Make sure to customize your from address
              from_address = "Deliveryapp Support <support@deliveryapp.com>"
              subject = "Cancelled Order"
              #necessary?

              Pony.mail(
                  :from => from_address,
                  :to => current_user.email,
                  :subject => subject,
                  # :body => payment_received_body(invoice, customer),
                  :html_body => ERB.new(File.read('app/views/user_mailer/cancel_order.html.erb')).result(binding),
                  :via => :smtp,
                  :via_options => default_email_options)

              Pony.mail(
                  :from => from_address,
                  :to => ["admin@deliveryapp.com","dev@deliveryapp.com"],
                  :subject => "Deliveryapp Order CANCELLED",
                  # :body => "ORDER # FROM DETAILS INVOICE CONFIRMED",
                  :html_body => ERB.new(File.read('app/views/user_mailer/admin_cancel.text.erb')).result(binding),
                  :via => :smtp,
                  :via_options => default_email_options)

              puts "Email sent to #{current_user.name}"
              redirect_to :back,  :alert => "This order was successfully cancelled. "
            else
              redirect_to admin_catering_order_path(@order.id),  :alert => "Unable to cancel order. Contact Admin"
            end
          else
            redirect_to admin_catering_order_path(@order.id)
          end
        }
      end
    end
    def cancel_order
      # @order = CateringOrder.find(params[:order])

      # head :ok
      # respond_to do |format|
      #   format.html {redirect_to :back}
      # end
    end
  end
  # scope :claimed, :default => true do |orders|
  #  orders.where.not(user_id: nil).where.not(status: 'pending')
  # end

  scope :all, :default => true do |orders|
    # orders.where.not({total_price: nil, status: 'pending'})
    orders.where.not(user_id: nil)
  end

  batch_action :confirm_order_for, :confirm => "Are you sure you want to CONFIRM all of these orders?" do |selection|
    unreachable_offices = []
    CateringOrder.find(selection).each do |co|
      # if co.office.super_user.present?
      if true
        co.confirm_office_order
      else
        unreachable_offices << office
      end
    end
  end
  #
  #   if unreachable_offices.present?
  #     redirect_to :back, :notice => "Messages sent."
  #   else
  #     notice = "The following offices do not have a super user assigned:\n\n"
  #     unreachable_office_text = unreachable_offices.each {|uo| notice << "#{uo.name}\n"}
  #     redirect_to :back, :notice => notice
  #   end
  # end
  #
  # batch_action :cancel_order_for do |selection|
  #   CateringOrder.find(selection).each do |co|
  #     co.status = 'cancelled'
  #   end
  #   redirect_to :back, :notice => "Orders cancelled"
  # end
  #
  # batch_action :notify_driver_for, :confirm => "Are you sure you want to NOTFIY all of these drivers?" do |selection|
  #   CateringOrder.find(selection).each do |co|
  #     co.drivers.first.send_follow_up_notification(co)
  #   end
  #   redirect_to :back, :notice => "Messages sent."
  # end
  show do
    attributes_table do
      row "Office Admin", :catering_order do |order|
        order.user
      end
      row "Office Address", :catering_order do |order|
        order.user.office_address
      end
      row "Stripe (admin)" do |order|
        link_to "#{order.stripe_invoice_id}", "https://dashboard.stripe.com/invoices/#{order.stripe_invoice_id}"
      end
      row "Restaurant 1", :catering_order do |order|
        Restaurant.find(order.subselections.pluck(:restaurant_id).uniq.first).name unless order.subselections.pluck(:restaurant_id).uniq.count < 1
      end
      row "dishes", :catering_order do |order|
        table_for order.subselections.where(:restaurant_id => order.subselections.pluck(:restaurant_id).first) do
          column do |dish|
            notes = order.catering_dishes.where(:subselection_id => dish.id).last.notes ||= ""
            # text_node(order.catering_dishes.where(:subselection_id => dish.id).last.quantity.to_s + ' x ' + dish.dish.name + ' ('+ dish.name + ') <span>'+notes+'</span> - ($#{dish.price}/dish) $#{order.catering_dishes.where(:subselection_id => dish.id).last.quantity.to_i*dish.price.to_i}')
            span do
              "#{order.catering_dishes.where(:subselection_id => dish.id).last.quantity} x #{dish.dish.name} (#{dish.name}) "
            end
            span :class => 'highlight' do
              notes
            end
            "- ($#{dish.price}/dish) $#{order.catering_dishes.where(:subselection_id => dish.id).last.quantity.to_i*dish.price.to_i}"
          end
        end
      end
      row "Restaurant 2", :catering_order do |order|
        Restaurant.find(order.subselections.pluck(:restaurant_id).uniq.last).name unless order.subselections.pluck(:restaurant_id).uniq.count < 2
      end
      row "Dishes 2", :catering_order do |order|
        table_for order.subselections.where(:restaurant_id => order.subselections.pluck(:restaurant_id).last) do
          column do |dish|
            notes = order.catering_dishes.where(:subselection_id => dish.id).last.notes ||= ""
            span do
              "#{order.catering_dishes.where(:subselection_id => dish.id).last.quantity} x #{dish.dish.name} (#{dish.name}) "
            end
            span :class => 'highlight' do
              notes
            end
            "- ($#{dish.price}/dish) $#{order.catering_dishes.where(:subselection_id => dish.id).last.quantity.to_i*dish.price.to_i}"
          end
        end unless order.subselections.pluck(:restaurant_id).uniq.count < 2
      end
      row "date", :catering_order do |order|
        order.delivery_date
      end
      row "time", :catering_order do |order|
        order.delivery_time
      end
      row "address"
      row "total", :catering_order do |order|
        sprintf('$%0.2f', order.total_price.to_f / 100.0).gsub(/(\d)(?=(\d\d\d)+(?!\d))/, "\\1,")
      end
      # column :id
      row "Status", :catering_order do |order|
        case order.status
        when 'flagged', 'cancelled'
          raw("<div style='font-weight:bold;background-color:red;color:white;text-align:center;'>#{order.status.capitalize}</div>")
        when 'confirmed_ready', 'picked_up', 'arrived', 'completed'
          raw("<div style='font-weight:bold;background-color:green;color:white;text-align:center;'>#{order.status.capitalize}</div>")
        when 'confirmed_needsdriver', 'needs_payment'
          raw("<div style='font-weight:bold;background-color:yellow;color:black;text-align:center;'>#{order.status.capitalize}</div>")
        else
          order.status.capitalize
        end
      end
      row :preauthorized
      row "Driver", :catering_order do |order|
        order.drivers.first.name unless order.drivers.empty?
      end
    end
  end
  # show do |order|
  #   div :class => "table" do
  #     table do
  #       tr do
  #         th "Attributes"
  #         th "Info"
  #       end
  #       tr do
  #         td "Name"
  #         td restaurant.name
  #       end
  #       tr do
  #         td "Status"
  #         td restaurant.open_status
  #       end
  #     end
  #   end
  #
  #   attributes_table_for restaurant do
  #
  #     table_for restaurant.subselections do
  #       column "Name" do |dish|
  #         dish.name
  #       end
  #       column "Price" do |dish|
  #         dish.price
  #       end
  #     end
  #
  #   end
  # end

  form do |f|
    f.inputs "Order Configuration" do
      f.input :subscribed, label: "Notifications for Office Admin"
      f.input :drivers, as: :select, collection: Driver.all.order('name ASC').pluck(:name, :id), multiple: false, include_blank: false

      # f.input :office, as: :select, collection: Office.all.order('name ASC').pluck(:name, :id), multiple: false, include_blank: false
      f.input :user, label: "Office Admin", as: :select, collection: User.all.order('name ASC').pluck(:name, :id), multiple: false, include_blank: false
      # f.input :address
      f.input :delivery_date, as: :datepicker, datepicker_options: { min_date: Date.yesterday, max_date: "+12W" }
      # f.input :delivery_date, as: :datepicker, datepicker_options: { min_date: Date.today, max_date: "+12W" }
      f.input :delivery_time, as: :select,
        # collection: ["10:45 AM", "10:50 AM", "10:55 AM", "11:00 AM", "11:05 AM", "11:10 AM", "11:15 AM", "11:20 AM", "11:25 AM",
        #              "11:30 AM", "11:35 AM", "11:40 AM", "11:45 AM", "11:50 AM", "11:55 AM",
        #              "12:00 PM", "12:05 PM", "12:10 PM", "12:15 PM", "12:20 PM", "12:25 PM",
        #              "12:30 PM", "12:35 PM", "12:40 PM", "12:45 PM", "12:50 PM", "12:55 PM",
        #              "1:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"],
        collection: ["11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
                     "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM",
                     "1:00 PM", "1:15 PM", "1:30 PM", "1:45 PM",
                     "2:00 PM", "2:15 PM", "2:30 PM", "2:45 PM",
                     "3:00 PM",
                     "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM" #this line for debug
        ],
        selected: object.delivery_time,
        include_blank: false
    end

    #f.inputs do
    #  f.has_many :catering_restaurants, heading: 'Restaurants', allow_destroy: true, new_record: true do |restaurant|
    #    restaurant.input :restaurant_id, as: :select, collection: Restaurant.all.order('name ASC').pluck(:name, :id), include_blank: false
    #    restaurant.input :number_of_bags, as: :select,
    #       collection: ["1", "2", "3", "4", "1 or 2", "2 or 3", "3 or 4"],
    #       include_blank: false
    #    restaurant.input :pickup_time, as: :select,
    #       collection: ["10:45 AM", "10:50 AM", "10:55 AM", "11:00 AM", "11:05 AM", "11:10 AM", "11:15 AM", "11:20 AM", "11:25 AM",
    #                    "11:30 AM", "11:35 AM", "11:40 AM", "11:45 AM", "11:50 AM", "11:55 AM",
    #                    "12:00 PM", "12:05 PM", "12:10 PM", "12:15 PM", "12:20 PM", "12:25 PM",
    #                    "12:30 PM", "12:35 PM", "12:40 PM", "12:45 PM", "12:50 PM", "12:55 PM",
    #                    "1:00 PM"],
    #       include_blank: false
    #
    #    restaurant.has_many :catering_dishes, heading: "Dishes", allow_destroy: true, new_record: true do |dish|
    #      dish.input :dish
    #      dish.input :subselection
    #      dish.input :quantity
    #    end
    #
    #  end
    #end

    f.inputs do
      f.has_many :catering_restaurants, heading: 'Restaurants', allow_destroy: true, new_record: true do |restaurant|
        restaurant.input :restaurant_id, as: :select, collection: Restaurant.all.order('name ASC').pluck(:name, :id), include_blank: false
        restaurant.input :number_of_bags, as: :select,
           collection: ["1", "2", "3", "4", "1 or 2", "2 or 3", "3 or 4"],
           include_blank: false
        restaurant.input :pickup_time, as: :select,
           collection: ["10:45 AM", "10:50 AM", "10:55 AM",
                        "11:00 AM", "11:05 AM", "11:10 AM", "11:15 AM", "11:20 AM", "11:25 AM",
                        "11:30 AM", "11:35 AM", "11:40 AM", "11:45 AM", "11:50 AM", "11:55 AM",
                        "12:00 PM", "12:05 PM", "12:10 PM", "12:15 PM", "12:20 PM", "12:25 PM",
                        "12:30 PM", "12:35 PM", "12:40 PM", "12:45 PM", "12:50 PM", "12:55 PM",
                        "1:00 PM", "1:05 PM", "1:10 PM", "1:15 PM", "1:20 PM", "1:25 PM",
                        "1:30 PM", "1:35 PM", "1:40 PM", "1:45 PM", "1:50 PM", "1:55 PM",
                        "2:00 PM", "2:05 PM", "2:10 PM", "2:15 PM", "2:20 PM", "2:25 PM",
                        "2:30 PM", "2:35 PM", "2:40 PM", "2:45 PM", "2:50 PM", "2:55 PM",
                        "3:00 PM"],
           include_blank: false

        restaurant.has_many :catering_dishes do |dish|
          dish.input :dish_id, :as => :select, :collection => option_groups_from_collection_for_select(Restaurant.all, :dishes, :name, :id, :name)
          dish.input :subselection_id, :as => :select, :collection => option_groups_from_collection_for_select(Dish.all, :subselections, :name, :id, :name)
          dish.input :quantity
        end
        # f.input :student_id, :hint => 'Students grouped by teacher names', :as => :select, :collection => option_groups_from_collection_for_select(User.where(:admin => false, :active => true).order(:name), :students, :name, :id, :name)

        # f.inputs do
        #   f.has_many :catering_dishes, heading: "Dishes", allow_destroy: true, new_record: true do |dish|
        #     dish.input :dish_id, as: :select, collection: Dish.all
        #     dish.input :subselection_id, as: :select, collection: Subselection.all
        #     dish.input :quantity
        #   end
        #
        # end

      end
    end


    # f.inputs do
    #   f.has_many :catering_dishes, heading: 'Catering Dishes', allow_destroy: true, new_record: true do |dish|
    #     dish.input :restaurant_id, as: :select, collection: Restaurant.all.order('name ASC').pluck(:name, :id), include_blank: false do |restaurant|
    #       restaurant.input :dish_id, as: :select, collection: restaurant.dishes, include_blank: false
    #     end
    #     dish.input :dish_id, as: :select, collection: Dish.all
    #     dish.input :subselection_id, as: :select, collection: Subselection.all
    #     dish.input :quantity
    #     # dish.input :subselection_id, as: :nested_select,
    #     #            # fields: [:name, :id],
    #     #            level_1: { attribute: :restaurant_id },
    #     #            level_2: { attribute: :dish_id },
    #     #            level_3: { attribute: :subselection_id }
    #     #
    #     # dish.input :quantity
    #     # dish.input :subselection_id, as: :nested_select,
    #     #         level_1: {
    #     #             attribute: :restaurant_id,
    #     #             collection: Restaurant.all
    #     #         },
    #     #         level_2: {
    #     #             attribute: :dish_id,
    #     #             collection: Dish.all
    #     #         },
    #     #         level_3: {
    #     #             attribute: :subselection_id,
    #     #             collection: Subselection.all
    #     #         }
    #
    #     #
    #     # dish.input :dish_id, as: :select, collection: Dish.where()
    #     #
    #     # restaurant.input :number_of_bags, as: :select,
    #     #                  collection: ["1", "2", "3", "4", "1 or 2", "2 or 3", "3 or 4"],
    #     #                  include_blank: false
    #     # restaurant.input :pickup_time, as: :select,
    #     #                  collection: ["10:45 AM", "10:50 AM", "10:55 AM", "11:00 AM", "11:05 AM", "11:10 AM", "11:15 AM", "11:20 AM", "11:25 AM",
    #     #                               "11:30 AM", "11:35 AM", "11:40 AM", "11:45 AM", "11:50 AM", "11:55 AM",
    #     #                               "12:00 PM", "12:05 PM", "12:10 PM", "12:15 PM", "12:20 PM", "12:25 PM",
    #     #                               "12:30 PM", "12:35 PM", "12:40 PM", "12:45 PM", "12:50 PM", "12:55 PM",
    #     #                               "1:00 PM"],
    #     #                  include_blank: false
    #   end
    # end

    f.inputs "Order Status" do
      f.input :status, as: :select, collection: CateringOrder::STATUSES, include_blank: false
      if f.object.cancelled_at.nil?
        f.action :submit, :as => :button, label: 'Cancel Order', button_html: {name: 'cancel', value: f.object.id}
      end
    end

    f.inputs "Order Type" do
      f.input :order_type, as: :select, collection: CateringOrder::ORDER_TYPES, include_blank: false
    end

    # f.inputs do
    #   f.has_many :catering_items, heading: 'Catering Items', allow_destroy: true, new_record: true do |catering_item|
    #     catering_item.input :name
    #     catering_item.input :quantity
    #   end
    # end

    f.actions
  end

	index do
		selectable_column
    column "Restaurant 1", :catering_order do |order|
      if order.catering_restaurants.present?
        Restaurant.find(order.catering_restaurants.pluck(:restaurant_id).uniq.first).name unless order.catering_restaurants.pluck(:restaurant_id).uniq.count < 1
      else
        subs = order.subselections
        dishes = subs.pluck(:dish_id)
        restaurants = Restaurant.find(Dish.find(dishes).map{|dish| dish[:restaurant_id]}).uniq
        # FIX THIS
        # Restaurant.find(order.subselections.pluck(:restaurant_id).uniq.first).name unless order.subselections.pluck(:restaurant_id).uniq.count < 1
        restaurants.first.name unless restaurants.count < 1
      end
    end
    column "dishes", :catering_order do |order|
      if order.catering_restaurants.present?
        subs = order.subselections
        dishes = subs.pluck(:dish_id)
        # restaurants = Restaurant.find(Dish.find(dishes).map{|dish| dish[:restaurant_id]}).uniq

        # res = Restaurant.find(order.catering_restaurants.pluck(:restaurant_id).uniq.first
        dishes = order.catering_restaurants.first
        cdishes = dishes.catering_dishes
        subs = Subselection.find(cdishes.pluck(:subselection_id))
        table_for subs do
          column do |dish|
            # "#{order.catering_dishes.where(dish.id => :subselection_id).quantity} x #{dish.name}"
            # "#{order.catering_dishes.where(:subselection_id => dish.id).last.quantity} x #{dish.name}"

            # qty = order.catering_dishes.where(:subselection_id => dish.id).last.quantity
            qty = cdishes.where(:subselection_id => dish.id).last.quantity
            notes = cdishes.where(:subselection_id => dish.id).last.notes ||= ""
            text_node ('<span class="dishqty">' + qty.to_s + ' x ' + dish.dish.name + ' ('+ dish.name + ') <strong>'+ notes +'</strong></span><span class="meal-type"
            style="display:none">' + dish.meal_type + '</span>').html_safe
          end
        end
        # FIX THIS
      else
        table_for order.subselections.where(:restaurant_id => order.subselections.pluck(:restaurant_id).first) do
          column do |dish|
            # "#{order.catering_dishes.where(dish.id => :subselection_id).quantity} x #{dish.name}"
            # "#{order.catering_dishes.where(:subselection_id => dish.id).last.quantity} x #{dish.name}"
            qty = order.catering_dishes.where(:subselection_id => dish.id).last.quantity
            notes = order.catering_dishes.where(:subselection_id => dish.id).last.notes ||= ""
            text_node ('<span class="dishqty">' + qty.to_s + ' x ' + dish.dish.name + ' ('+ dish.name + ') <strong>'+ notes +'</strong></span><span class="meal-type" style="display:none">' + dish.meal_type + '</span>').html_safe
          end
        end
      end
    end
    column "Restaurant 2", :catering_order do |order|
      if order.catering_restaurants.present?
        Restaurant.find(order.catering_restaurants.pluck(:restaurant_id).uniq.last).name unless order.catering_restaurants.pluck(:restaurant_id).uniq.count < 2
      else
        # FIX THIS
        # Restaurant.find(order.subselections.pluck(:restaurant_id).uniq.first).name unless order.subselections.pluck(:restaurant_id).uniq.count < 1
        subs = order.subselections
        dishes = subs.pluck(:dish_id)
        restaurants = Restaurant.find(Dish.find(dishes).map{|dish| dish[:restaurant_id]}).uniq
        # FIX THIS
        # Restaurant.find(order.subselections.pluck(:restaurant_id).uniq.first).name unless order.subselections.pluck(:restaurant_id).uniq.count < 1
        restaurants.last.name unless restaurants.count < 2
      end
      #Restaurant.find(order.subselections.pluck(:restaurant_id).uniq.last).name unless order.subselections.pluck(:restaurant_id).uniq.count < 2
    end
    column "dishes2", :catering_order do |order|
      if order.catering_restaurants.present? && order.catering_restaurants.count > 1
        subs = order.subselections
        dishes = subs.pluck(:dish_id)
        # restaurants = Restaurant.find(Dish.find(dishes).map{|dish| dish[:restaurant_id]}).uniq

        # res = Restaurant.find(order.catering_restaurants.pluck(:restaurant_id).uniq.first
        dishes = order.catering_restaurants.last
        cdishes = dishes.catering_dishes
        subs = Subselection.find(cdishes.pluck(:subselection_id))
        table_for subs do
          column do |dish|
            # "#{order.catering_dishes.where(dish.id => :subselection_id).quantity} x #{dish.name}"
            # "#{order.catering_dishes.where(:subselection_id => dish.id).last.quantity} x #{dish.name}"

            # qty = order.catering_dishes.where(:subselection_id => dish.id).last.quantity
            qty = cdishes.where(:subselection_id => dish.id).last.quantity
            notes = cdishes.where(:subselection_id => dish.id).last.notes ||= ""
            text_node ('<span class="dishqty">' + qty.to_s + ' x ' + dish.dish.name + ' ('+ dish.name + ') <strong>'+ notes +'</strong></span><span class="meal-type"
            style="display:none">' + dish.meal_type + '</span>').html_safe
          end
        end
        # FIX THIS
      else
        # table_for order.subselections.where(:restaurant_id => order.subselections.pluck(:restaurant_id).last) do
        #   column do |dish|
        #     "#{order.catering_dishes.where(:subselection_id => dish.id).last.quantity} x #{dish.dish.name} (#{dish.name}) - ($#{dish.price}/dish) $#{order.catering_dishes.where(:subselection_id => dish.id).last.quantity.to_i*dish.price.to_i}"
        #   end
        # end unless order.subselections.pluck(:restaurant_id).uniq.count < 2
        if order.subselections.pluck(:restaurant_id).uniq.count > 1
          table_for order.subselections.where(:restaurant_id => order.subselections.pluck(:restaurant_id).last) do
            column do |dish|
              # "#{order.catering_dishes.where(dish.id => :subselection_id).quantity} x #{dish.name}"
              # "#{order.catering_dishes.where(:subselection_id => dish.id).last.quantity} x #{dish.name}"
              qty = order.catering_dishes.where(:subselection_id => dish.id).last.quantity
              notes = order.catering_dishes.where(:subselection_id => dish.id).last.notes ||= ""
              text_node ('<span class="dishqty">' + qty.to_s + ' x ' + dish.dish.name + ' ('+ dish.name + ') <strong>'+ notes +'</strong></span><span class="meal-type" style="display:none">' + dish.meal_type + '</span>').html_safe
            end
          end
        end
      end
      #
      # table_for order.subselections.where(:restaurant_id => order.subselections.pluck(:restaurant_id).last) do
      #   column do |dish|
      #     # "#{order.catering_dishes.where(:subselection_id => dish.id).last.quantity} x #{dish.name}"
      #     qty2 = order.catering_dishes.where(:subselection_id => dish.id).last.quantity
      #     text_node ('<span class="dishqty">' + qty2.to_s + ' x ' + dish.dish.name + ' ('+ dish.name + ')</span><span class="meal-type" style="display:none">' + dish.meal_type + '</span>').html_safe
      #   end
      # end unless order.subselections.pluck(:restaurant_id).uniq.count < 2
    end
    column "date", :catering_order do |order|
      order.delivery_date
    end
    column "time", :catering_order do |order|
      order.delivery_time
    end
    column "address"
    column "total", :catering_order do |order|
      sprintf('$%0.2f', order.total_price.to_f / 100.0).gsub(/(\d)(?=(\d\d\d)+(?!\d))/, "\\1,")
    end
  	# column :id
		column "Status", :catering_order do |order|
			case order.status
      when 'flagged', 'cancelled'
        raw("<div style='font-weight:bold;background-color:red;color:white;text-align:center;'>#{order.status.capitalize}</div>")
      when 'confirmed_ready', 'picked_up', 'arrived', 'completed'
        raw("<div style='font-weight:bold;background-color:green;color:white;text-align:center;'>#{order.status.capitalize}</div>")
      when 'confirmed_needsdriver', 'needs_payment'
        raw("<div style='font-weight:bold;background-color:yellow;color:black;text-align:center;'>#{order.status.capitalize}</div>")
      else
        order.status.capitalize
      end
		end

		# column "Order Type", :catering_order do |order|
    #   order.order_type.capitalize
		# end

    # column "Delivery Time", :catering_order do |order|
    #   order.delivery_time.to_i
    #   # CateringOrder::DELIVERY_TIME[order.delivery_time.to_i]
    # end

    # column "Preauthorized payment?", :catering_order do |order|
    #   order.preauthorized ? 'YES' : 'NO'
    # end

    column "Driver", :catering_order do |order|
      order.drivers.first.name unless order.drivers.empty?
    end

    column :actions do |order|
      links = []
      links << link_to('View', admin_catering_order_path(order))
      links << link_to('Edit', edit_admin_catering_order_path(order))
      links << link_to('Copy 1', '/', :id => "#{order.id}", :class => "export-order-data1")
      links << link_to('Copy 2', '/', :id => "#{order.id}", :class => "export-order-data2")
      if current_admin_user.super_admin?
        links << link_to('Delete', admin_catering_order_path(order), method: :delete, confirm: 'Are you sure?', :class => "del_order")
      end
      links.join(' ').html_safe
    end
  	# actions
  end

end
