class CreateSubstitutions < ActiveRecord::Migration[6.1]
  def change
    create_table :substitutions do |t|
      t.references :ingredient, null: false, foreign_key: true
      t.references :substitute_ingredient, null: false, foreign_key: { to_table: :ingredients }
      t.decimal :price_adjustment

      t.timestamps
    end
  end
end

