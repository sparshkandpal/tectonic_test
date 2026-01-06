class CreateHotspots < ActiveRecord::Migration[6.1]
  def change
    create_table :hotspots do |t|
      t.references :media_item, null: false, foreign_key: true
      t.references :ingredient, null: false, foreign_key: true
      t.decimal :x_position
      t.decimal :y_position

      t.timestamps
    end
  end
end

