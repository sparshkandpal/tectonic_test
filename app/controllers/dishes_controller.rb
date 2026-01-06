class DishesController < ApplicationController
  def new
    @dish = Dish.new
    @restaurants = Restaurant.all
  end

  def create
    @dish = Dish.new(dish_params)
    if @dish.save
      redirect_to new_story_path(dish_id: @dish.id), notice: 'Dish was successfully created. Now add a story with media.'
    else
      @restaurants = Restaurant.all
      render :new
    end
  end

  def edit
    @dish = Dish.find(params[:id])
    @restaurants = Restaurant.all
  end

  def update
    @dish = Dish.find(params[:id])
    if @dish.update(dish_params)
      redirect_to @dish, notice: 'Dish was successfully updated.'
    else
      @restaurants = Restaurant.all
      render :edit
    end
  end

  def customization_panel
    @dish = Dish.includes(:dish_ingredients, dish_ingredients: :ingredient).find(params[:id])
  end

  private

  def dish_params
    params.require(:dish).permit(:restaurant_id, :name, :description, :base_price, :image)
  end
end

