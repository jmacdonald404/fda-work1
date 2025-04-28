class CateringUpdateService
  attr_reader :catering_order, :dish_id, :subselection_id, :quantity, :delivery_date, :delivery_time, :dish_notes

  def initialize(catering_order, dish_id, subselection_id, quantity, delivery_time, delivery_date, dish_notes)
    @catering_order = catering_order
    @dish_id = dish_id
    @subselection_id = subselection_id
    @quantity = quantity
    @delivery_date = delivery_date
    @delivery_time = delivery_time
    @dish_notes = dish_notes
  end

  def update_order
    if @catering_order
      if existing_catering_dish
        if quantity_zero
          destroy_existing_dish
        else
          update_existing_dish
        end
      else
        if !quantity_zero
          add_new_dish
        end
      end
      puts "#{@delivery_date} DELIVERY DATE ####### - #{@delivery_time} DELIVERY TIME #######"
      # puts "#{delivery_date}"
      # puts "#{delivery_date.to_date}"
      # ddate = @delivery_date.to_date
      # ddate = Date.strptime("#{@delivery_date} 12:00AM", '%m/%d/%Y %H:%M%p')
      ddate = Date.strptime("#{@delivery_date} 12:00AM", '%d/%m/%Y %H:%M%p')
      puts ddate
      @catering_order.update(
        # delivery_time: CateringOrder::DELIVERY_TIME[@delivery_time],
        delivery_time: @delivery_time,
        delivery_date: ddate
      )
    end
    @catering_order
  end

  def add_new_dish
    puts "################ #{@subselection_id} #{@quantity}"
    dish_by_id = Dish.find(@dish_id)
    puts dish_by_id
    puts catering_order.to_json
    puts catering_order.subselections.last
    puts Subselection.find(@subselection_id)
    b = CateringRestaurant.create(catering_order: catering_order, restaurant: dish_by_id.restaurant)
    b.save!
    a = CateringDish.create(catering_order: catering_order, dish: dish_by_id, subselection: Subselection.find(@subselection_id),quantity: @quantity,notes: @dish_notes, restaurant: dish_by_id.restaurant, catering_restaurant: b)
    a.save!
    # catering_order.subselections << Subselection.find(@subselection_id)
    # puts catering_order.catering_dishes.all
    # new_catering_dish = catering_order.catering_dishes.find_by(subselection_id: @subselection_id)
    # puts new_catering_dish
    # new_catering_dish.update!(quantity: @quantity, notes: @dish_notes)
  end

  def update_existing_dish
    existing_catering_dish.update!(quantity: @quantity, notes: @dish_notes)
  end

  def destroy_existing_dish
    existing_catering_dish.destroy!
  end

  def existing_catering_dish
    @catering_order.catering_dishes.find_by(subselection_id: @subselection_id)
  end

  def quantity_zero
    @quantity.zero?
  end
end
