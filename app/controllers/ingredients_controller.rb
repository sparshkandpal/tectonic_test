class IngredientsController < ApplicationController
  def show
    @ingredient = Ingredient.find(params[:id])
  end

  def substitutions
    @ingredient = Ingredient.find(params[:id])
    @substitutions = @ingredient.substitutions.includes(:substitute_ingredient)
    render json: @substitutions.map { |s|
      {
        id: s.id,
        substitute_ingredient: {
          id: s.substitute_ingredient.id,
          name: s.substitute_ingredient.name
        },
        price_adjustment: s.price_adjustment
      }
    }
  end
end

