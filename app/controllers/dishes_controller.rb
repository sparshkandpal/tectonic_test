class DishesController < ApplicationController
  def customization_panel
    @dish = Dish.includes(:dish_ingredients, dish_ingredients: :ingredient).find(params[:id])
  end
end

