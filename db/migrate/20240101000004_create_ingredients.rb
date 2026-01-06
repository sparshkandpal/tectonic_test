class CreateIngredients < ActiveRecord::Migration[6.1]
  def change
    create_table :ingredients do |t|
      t.string :name
      t.text :description
      t.string :image_url
      t.integer :calories
      t.decimal :protein
      t.decimal :carbs
      t.decimal :fat
      t.text :allergens

      t.timestamps
    end
  end
end

