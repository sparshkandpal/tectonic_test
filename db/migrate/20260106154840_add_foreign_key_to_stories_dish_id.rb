class AddForeignKeyToStoriesDishId < ActiveRecord::Migration[6.1]
  def change
    add_foreign_key :stories, :dishes, column: :dish_id
    add_index :stories, :dish_id
  end
end
