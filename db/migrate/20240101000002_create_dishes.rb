class CreateDishes < ActiveRecord::Migration[6.1]
  def change
    create_table :dishes do |t|
      t.references :restaurant, null: false, foreign_key: true
      t.string :name
      t.text :description
      t.decimal :base_price

      t.timestamps
    end
  end
end

