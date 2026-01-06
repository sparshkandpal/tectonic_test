class Ingredient < ApplicationRecord
  has_many :dish_ingredients
  has_many :hotspots
  has_many :substitutions, foreign_key: :ingredient_id
  has_many :substitute_options, through: :substitutions, source: :substitute_ingredient

  serialize :allergens, Array
end

