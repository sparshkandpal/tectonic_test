class Substitution < ApplicationRecord
  belongs_to :ingredient
  belongs_to :substitute_ingredient, class_name: 'Ingredient'
end

