class HotspotsController < ApplicationController
  def index
    @hotspots = Hotspot.includes(:ingredient).where(media_item_id: params[:media_item_id])
    render json: @hotspots.map { |h| 
      {
        id: h.id,
        ingredient: {
          id: h.ingredient.id,
          name: h.ingredient.name,
          calories: h.ingredient.calories,
          protein: h.ingredient.protein,
          carbs: h.ingredient.carbs,
          fat: h.ingredient.fat,
          allergens: h.ingredient.allergens
        },
        x_position: h.x_position,
        y_position: h.y_position
      }
    }
  end
end

