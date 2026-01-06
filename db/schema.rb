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

ActiveRecord::Schema.define(version: 2026_01_06_132752) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "cart_items", force: :cascade do |t|
    t.string "session_id"
    t.bigint "dish_id", null: false
    t.integer "quantity", default: 1
    t.jsonb "customizations"
    t.decimal "total_price"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["dish_id"], name: "index_cart_items_on_dish_id"
  end

  create_table "dish_ingredients", force: :cascade do |t|
    t.bigint "dish_id", null: false
    t.bigint "ingredient_id", null: false
    t.decimal "default_quantity"
    t.boolean "is_customizable"
    t.decimal "extra_cost"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["dish_id"], name: "index_dish_ingredients_on_dish_id"
    t.index ["ingredient_id"], name: "index_dish_ingredients_on_ingredient_id"
  end

  create_table "dishes", force: :cascade do |t|
    t.bigint "restaurant_id", null: false
    t.string "name"
    t.text "description"
    t.decimal "base_price"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["restaurant_id"], name: "index_dishes_on_restaurant_id"
  end

  create_table "hotspots", force: :cascade do |t|
    t.bigint "media_item_id", null: false
    t.bigint "ingredient_id", null: false
    t.decimal "x_position"
    t.decimal "y_position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["ingredient_id"], name: "index_hotspots_on_ingredient_id"
    t.index ["media_item_id"], name: "index_hotspots_on_media_item_id"
  end

  create_table "ingredients", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "image_url"
    t.integer "calories"
    t.decimal "protein"
    t.decimal "carbs"
    t.decimal "fat"
    t.text "allergens"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "media_items", force: :cascade do |t|
    t.bigint "story_id", null: false
    t.integer "media_type"
    t.integer "position"
    t.integer "duration", default: 5000
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["story_id"], name: "index_media_items_on_story_id"
  end

  create_table "restaurants", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "logo_url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "stories", force: :cascade do |t|
    t.bigint "dish_id", null: false
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["dish_id"], name: "index_stories_on_dish_id"
  end

  create_table "substitutions", force: :cascade do |t|
    t.bigint "ingredient_id", null: false
    t.bigint "substitute_ingredient_id", null: false
    t.decimal "price_adjustment"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["ingredient_id"], name: "index_substitutions_on_ingredient_id"
    t.index ["substitute_ingredient_id"], name: "index_substitutions_on_substitute_ingredient_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "cart_items", "dishes"
  add_foreign_key "dish_ingredients", "dishes"
  add_foreign_key "dish_ingredients", "ingredients"
  add_foreign_key "dishes", "restaurants"
  add_foreign_key "hotspots", "ingredients"
  add_foreign_key "hotspots", "media_items"
  add_foreign_key "media_items", "stories"
  add_foreign_key "stories", "dishes"
  add_foreign_key "substitutions", "ingredients"
  add_foreign_key "substitutions", "ingredients", column: "substitute_ingredient_id"
end
