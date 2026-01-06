class DishIngredient < ApplicationRecord
  belongs_to :dish
  belongs_to :ingredient

  scope :customizable, -> { where(is_customizable: true) }
end

