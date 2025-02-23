# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2021_10_20_030134) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_id", null: false
    t.string "resource_type", null: false
    t.integer "author_id"
    t.string "author_type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id"
  end

  create_table "admin_users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "super_admin", default: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "apartment_menus", force: :cascade do |t|
    t.integer "menu_id"
    t.integer "apartment_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["apartment_id"], name: "index_apartment_menus_on_apartment_id"
    t.index ["menu_id"], name: "index_apartment_menus_on_menu_id"
  end

  create_table "apartments", force: :cascade do |t|
    t.string "name"
    t.float "latitude"
    t.float "longitude"
    t.string "address"
    t.string "city"
    t.string "province"
    t.string "postal_code"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "status", default: 0
  end

  create_table "base_delivery_fees", force: :cascade do |t|
    t.float "base_fee", default: 20.0
    t.string "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "building_menus", force: :cascade do |t|
    t.integer "menu_id"
    t.integer "building_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["building_id"], name: "index_building_menus_on_building_id"
    t.index ["menu_id"], name: "index_building_menus_on_menu_id"
  end

  create_table "buildings", force: :cascade do |t|
    t.string "name"
    t.float "latitude"
    t.float "longitude"
    t.string "address"
    t.string "city"
    t.string "province"
    t.string "postal_code"
    t.string "type"
    t.text "notes"
    t.integer "status", default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "delivery_time", default: "12:00 PM"
  end

  create_table "catering_dishes", force: :cascade do |t|
    t.integer "quantity", default: 1, null: false
    t.integer "catering_order_id"
    t.integer "dish_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "restaurant_id"
    t.integer "subselection_id"
    t.integer "catering_restaurant_id"
    t.string "notes"
    t.index ["catering_order_id"], name: "index_catering_dishes_on_catering_order_id"
    t.index ["catering_restaurant_id"], name: "index_catering_dishes_on_catering_restaurant_id"
    t.index ["dish_id"], name: "index_catering_dishes_on_dish_id"
    t.index ["restaurant_id"], name: "index_catering_dishes_on_restaurant_id"
    t.index ["subselection_id"], name: "index_catering_dishes_on_subselection_id"
  end

  create_table "catering_drivers", force: :cascade do |t|
    t.integer "catering_order_id"
    t.integer "driver_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["catering_order_id"], name: "index_catering_drivers_on_catering_order_id"
    t.index ["driver_id"], name: "index_catering_drivers_on_driver_id"
  end

  create_table "catering_items", force: :cascade do |t|
    t.string "name", null: false
    t.string "quantity", default: "0", null: false
    t.string "notes"
    t.integer "catering_order_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["catering_order_id"], name: "index_catering_items_on_catering_order_id"
  end

  create_table "catering_orders", force: :cascade do |t|
    t.integer "office_id"
    t.string "order_type", default: "manual", null: false
    t.string "status", default: "pending", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.date "delivery_date"
    t.string "delivery_time", default: "12:00 PM", null: false
    t.boolean "notify_driver", default: false
    t.boolean "first_delivery_reminder", default: false
    t.string "address"
    t.string "charge_id"
    t.json "charge"
    t.boolean "preauthorized", default: false
    t.integer "user_id"
    t.string "sms_number"
    t.integer "total_price"
    t.string "stripe_invoice_id"
    t.datetime "cancelled_at"
    t.boolean "subscribed", default: false
    t.index ["office_id"], name: "index_catering_orders_on_office_id"
    t.index ["user_id"], name: "index_catering_orders_on_user_id"
  end

  create_table "catering_restaurants", force: :cascade do |t|
    t.integer "catering_order_id"
    t.integer "restaurant_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "pickup_time", default: "12:00 PM", null: false
    t.string "number_of_bags", default: "1", null: false
    t.index ["catering_order_id"], name: "index_catering_restaurants_on_catering_order_id"
    t.index ["restaurant_id"], name: "index_catering_restaurants_on_restaurant_id"
  end

  create_table "charges", force: :cascade do |t|
    t.integer "amount"
    t.integer "coupon_id"
    t.string "stripe_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "coupons", force: :cascade do |t|
    t.string "code"
    t.integer "discount_percent"
    t.datetime "expires_at"
    t.string "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer "priority", default: 0, null: false
    t.integer "attempts", default: 0, null: false
    t.text "handler", null: false
    t.text "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by"
    t.string "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
  end

  create_table "dishes", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.string "quantity", default: "0", null: false
    t.string "notes"
    t.string "meal_type", default: "meat", null: false
    t.string "dietary"
    t.string "price", default: "10", null: false
    t.string "image_url", default: "https://picsum.photos/340/335/?random"
    t.integer "restaurant_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "gf", default: false, null: false
    t.boolean "df", default: false, null: false
    t.boolean "vg", default: false, null: false
    t.boolean "gfo", default: false, null: false
    t.boolean "dfo", default: false, null: false
    t.boolean "vgo", default: false, null: false
    t.string "image_url2", default: "https://picsum.photos/340/335/?random"
    t.index ["restaurant_id"], name: "index_dishes_on_restaurant_id"
  end

  create_table "drivers", force: :cascade do |t|
    t.string "email", null: false
    t.string "phone", null: false
    t.string "name", null: false
    t.boolean "active", default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "food_surveys", force: :cascade do |t|
    t.integer "user_id"
    t.integer "order_id"
    t.integer "rating"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_type", "sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_type_and_sluggable_id"
  end

  create_table "meals", force: :cascade do |t|
    t.string "name"
    t.float "price", null: false
    t.integer "restaurant_id", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "menu_items", force: :cascade do |t|
    t.integer "menu_id"
    t.integer "meal_id"
    t.string "key"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "limit", default: 0
  end

  create_table "menus", force: :cascade do |t|
    t.integer "apartment_id"
    t.date "deliver_day"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "menu_status", default: 0
    t.string "name"
    t.string "image_url"
    t.string "shortened_image_url"
    t.integer "limit", default: 40
    t.string "url_safe_token"
  end

  create_table "newsletter_subscribers", force: :cascade do |t|
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "office_drivers", force: :cascade do |t|
    t.integer "office_id"
    t.integer "driver_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["driver_id"], name: "index_office_drivers_on_driver_id"
    t.index ["office_id"], name: "index_office_drivers_on_office_id"
  end

  create_table "office_menus", force: :cascade do |t|
    t.integer "menu_id"
    t.integer "office_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["menu_id"], name: "index_office_menus_on_menu_id"
    t.index ["office_id"], name: "index_office_menus_on_office_id"
  end

  create_table "offices", force: :cascade do |t|
    t.string "name"
    t.float "latitude"
    t.float "longitude"
    t.string "address"
    t.string "city"
    t.string "province"
    t.string "postal_code"
    t.integer "status", default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "building_id"
    t.date "catering_day"
    t.float "delivery_fee", default: 1.0
    t.float "tip_fee", default: 1.0
    t.string "phone"
    t.string "catering_time", default: "12:00 PM"
    t.string "contact_name"
    t.string "contact_phone"
    t.string "contact_email"
    t.index ["building_id"], name: "index_offices_on_building_id"
  end

  create_table "opening_hours", force: :cascade do |t|
    t.integer "restaurant_id"
    t.integer "day"
    t.time "closes"
    t.time "opens"
    t.datetime "valid_from"
    t.datetime "valid_through"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "orders", force: :cascade do |t|
    t.integer "menu_item_id"
    t.integer "user_id"
    t.integer "order_status", default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "deliver_time"
    t.json "charge"
    t.boolean "catered", default: false
  end

  create_table "pairings", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "placed_orders", force: :cascade do |t|
    t.integer "apartment_id"
    t.string "deliver_time"
    t.date "deliver_date"
    t.integer "office_id"
    t.index ["office_id"], name: "index_placed_orders_on_office_id"
  end

  create_table "promotion_statuses", force: :cascade do |t|
    t.boolean "active", default: true
    t.integer "uses_left", default: 1
    t.datetime "expired_on"
    t.integer "user_id"
    t.integer "promotion_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["promotion_id"], name: "index_promotion_statuses_on_promotion_id"
    t.index ["user_id"], name: "index_promotion_statuses_on_user_id"
  end

  create_table "promotions", force: :cascade do |t|
    t.string "description"
    t.float "discount_percentage"
    t.float "discount_amount"
    t.integer "total_uses", default: 1
    t.datetime "promo_expires_at"
    t.integer "priority_level", default: 0
    t.boolean "active", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "delivery_fee_discount_amount"
    t.float "delivery_fee_discount_percentage"
    t.boolean "autoapply", default: false
  end

  create_table "restaurants", force: :cascade do |t|
    t.string "name"
    t.float "latitude"
    t.float "longitude"
    t.integer "open_status", default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "address"
    t.text "description"
    t.integer "min_quantity", default: 10
    t.string "city", default: "Vancouver"
    t.integer "pairing_id"
    t.string "subtitle"
    t.text "daysopen", default: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], array: true
    t.string "slug"
  end

  create_table "subselections", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "price"
    t.string "dietary"
    t.string "meal_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "dish_id"
    t.integer "restaurant_id"
    t.boolean "gf", default: false, null: false
    t.boolean "df", default: false, null: false
    t.boolean "vg", default: false, null: false
    t.boolean "gfo", default: false, null: false
    t.boolean "dfo", default: false, null: false
    t.boolean "vgo", default: false, null: false
    t.integer "serves", default: 1
    t.index ["dish_id"], name: "index_subselections_on_dish_id"
    t.index ["restaurant_id"], name: "index_subselections_on_restaurant_id"
  end

  create_table "user_coupons", force: :cascade do |t|
    t.integer "user_id"
    t.integer "coupon_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["coupon_id"], name: "index_user_coupons_on_coupon_id"
    t.index ["user_id"], name: "index_user_coupons_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.integer "office_id"
    t.string "email"
    t.string "phone"
    t.string "stripe_token"
    t.integer "user_status", default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "pin"
    t.string "name"
    t.string "last_name"
    t.integer "building_id"
    t.string "referral_code"
    t.integer "five_order", default: 0
    t.integer "referrer_id"
    t.integer "user_id"
    t.string "url_safe_token"
    t.boolean "super_user", default: false
    t.boolean "weekly", default: false
    t.boolean "referral_code_used", default: false
    t.boolean "promo_code_used", default: false
    t.boolean "reset_payment_request", default: false
    t.boolean "food_survey", default: false
    t.string "office_address"
    t.string "office_name"
    t.string "address"
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "address2"
    t.index ["building_id"], name: "index_users_on_building_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end
end
