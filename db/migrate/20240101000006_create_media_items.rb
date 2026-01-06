class CreateMediaItems < ActiveRecord::Migration[6.1]
  def change
    create_table :media_items do |t|
      t.references :story, null: false, foreign_key: true
      t.integer :media_type
      t.integer :position
      t.integer :duration, default: 5000

      t.timestamps
    end
  end
end

