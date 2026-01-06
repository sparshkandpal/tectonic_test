module Api
  class DishesController < ApplicationController
    def calculate_price
      dish = Dish.find(params[:id])
      customizations = params[:customizations] || {}
      result = PriceCalculator.calculate(dish, customizations)
      render json: result
    end
  end
end

