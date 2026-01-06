class CreateDishIngredients < ActiveRecord::Migration[6.1]
  def change
    create_table :dish_ingredients do |t|
      t.references :dish, null: false, foreign_key: true
      t.references :ingredient, null: false, foreign_key: true
      t.decimal :default_quantity
      t.boolean :is_customizable
      t.decimal :extra_cost

      t.timestamps
    end
  end
end

