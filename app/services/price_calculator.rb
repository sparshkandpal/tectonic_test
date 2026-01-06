class PriceCalculator
  def self.calculate(dish, customizations)
    base_price = (dish.base_price || 0).to_f
    adjustments = 0.0

    customizations.each do |ingredient_id, customization|
      ingredient_id = ingredient_id.to_i
      dish_ingredient = dish.dish_ingredients.find_by(ingredient_id: ingredient_id)
      next unless dish_ingredient

      quantity = customization['quantity'].to_f
      default_quantity = (dish_ingredient.default_quantity || 0).to_f

      # Calculate quantity adjustment
      if quantity > default_quantity
        extra_quantity = quantity - default_quantity
        extra_cost = (dish_ingredient.extra_cost || 0).to_f
        adjustments += extra_quantity * extra_cost
      end

      # Calculate substitution adjustment
      if customization['substitution_id'].present?
        substitution = Substitution.find_by(
          ingredient_id: ingredient_id,
          id: customization['substitution_id']
        )
        if substitution && substitution.price_adjustment
          adjustments += substitution.price_adjustment.to_f
        end
      end
    end

    {
      base_price: base_price,
      adjustments: adjustments,
      total: base_price + adjustments
    }
  end
end

