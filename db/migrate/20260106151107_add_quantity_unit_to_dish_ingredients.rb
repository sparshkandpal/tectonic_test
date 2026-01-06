class AddQuantityUnitToDishIngredients < ActiveRecord::Migration[6.1]
  def change
    add_column :dish_ingredients, :quantity_unit, :string, default: 'units'
  end
end
