class PriceCalculator
  def self.calculate(dish, customizations)
    base_price = dish.base_price
    adjustments = 0.0

    customizations.each do |ingredient_id, customization|
      ingredient_id = ingredient_id.to_i
      dish_ingredient = dish.dish_ingredients.find_by(ingredient_id: ingredient_id)
      next unless dish_ingredient

      quantity = customization['quantity'].to_f
      default_quantity = dish_ingredient.default_quantity.to_f

      # Calculate quantity adjustment
      if quantity > default_quantity
        extra_quantity = quantity - default_quantity
        adjustments += extra_quantity * dish_ingredient.extra_cost
      end

      # Calculate substitution adjustment
      if customization['substitution_id'].present?
        substitution = Substitution.find_by(
          ingredient_id: ingredient_id,
          id: customization['substitution_id']
        )
        adjustments += substitution.price_adjustment if substitution
      end
    end

    {
      base_price: base_price,
      adjustments: adjustments,
      total: base_price + adjustments
    }
  end
end

