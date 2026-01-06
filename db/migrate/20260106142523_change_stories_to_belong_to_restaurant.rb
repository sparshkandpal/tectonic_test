class ChangeStoriesToBelongToRestaurant < ActiveRecord::Migration[6.1]
  def up
    # Add restaurant_id column
    add_reference :stories, :restaurant, null: true, foreign_key: true
    
    # Migrate existing data: get restaurant from dish
    execute <<-SQL
      UPDATE stories
      SET restaurant_id = (
        SELECT dishes.restaurant_id
        FROM dishes
        WHERE dishes.id = stories.dish_id
      )
    SQL
    
    # Remove dish_id column
    remove_reference :stories, :dish, foreign_key: true
    
    # Make restaurant_id required
    change_column_null :stories, :restaurant_id, false
  end

  def down
    # Add dish_id back
    add_reference :stories, :dish, null: true, foreign_key: true
    
    # Migrate data back (this is lossy - we'll use first dish of restaurant)
    execute <<-SQL
      UPDATE stories
      SET dish_id = (
        SELECT dishes.id
        FROM dishes
        WHERE dishes.restaurant_id = stories.restaurant_id
        LIMIT 1
      )
    SQL
    
    # Remove restaurant_id
    remove_reference :stories, :restaurant, foreign_key: true
    
    # Make dish_id required
    change_column_null :stories, :dish_id, false
  end
end
