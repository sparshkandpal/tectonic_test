class CreateCartItems < ActiveRecord::Migration[6.1]
  def change
    create_table :cart_items do |t|
      t.string :session_id
      t.references :dish, null: false, foreign_key: true
      t.integer :quantity, default: 1
      t.jsonb :customizations
      t.decimal :total_price

      t.timestamps
    end
  end
end

