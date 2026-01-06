class DishIngredientsController < ApplicationController
  before_action :set_dish
  before_action :set_dish_ingredient, only: [:edit, :update, :destroy]

  def new
    @dish_ingredient = @dish.dish_ingredients.build
    @ingredients = Ingredient.all
  end

  def create
    @dish_ingredient = @dish.dish_ingredients.build(dish_ingredient_params)
    if @dish_ingredient.save
      redirect_to edit_dish_path(@dish), notice: 'Ingredient was successfully added to dish.'
    else
      @ingredients = Ingredient.all
      render :new
    end
  end

  def edit
    @ingredients = Ingredient.all
  end

  def update
    if @dish_ingredient.update(dish_ingredient_params)
      redirect_to edit_dish_path(@dish), notice: 'Dish ingredient was successfully updated.'
    else
      @ingredients = Ingredient.all
      render :edit
    end
  end

  def destroy
    @dish_ingredient.destroy
    redirect_to edit_dish_path(@dish), notice: 'Ingredient was successfully removed from dish.'
  end

  private

  def set_dish
    @dish = Dish.find(params[:dish_id])
  end

  def set_dish_ingredient
    @dish_ingredient = @dish.dish_ingredients.find(params[:id])
  end

  def dish_ingredient_params
    params.require(:dish_ingredient).permit(:ingredient_id, :default_quantity, :is_customizable, :extra_cost)
  end
end
