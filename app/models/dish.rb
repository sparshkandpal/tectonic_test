class Dish < ApplicationRecord
  belongs_to :restaurant
  has_many :dish_ingredients, dependent: :destroy
  has_many :ingredients, through: :dish_ingredients
  has_many :cart_items, dependent: :destroy
  has_one_attached :image

  def calculate_price_with_customizations(customizations_hash)
    PriceCalculator.calculate(self, customizations_hash)
  end
end


