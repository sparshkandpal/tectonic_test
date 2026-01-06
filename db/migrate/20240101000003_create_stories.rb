class CreateStories < ActiveRecord::Migration[6.1]
  def change
    create_table :stories do |t|
      t.references :dish, null: false, foreign_key: true
      t.integer :position

      t.timestamps
    end
  end
end

