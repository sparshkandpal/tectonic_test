class StoriesController < ApplicationController
  def index
    @stories = Story.includes(dish: :restaurant, media_items: [:hotspots, { hotspots: :ingredient }]).ordered
  end

  def show
    @story = Story.includes(
      dish: [:restaurant, :dish_ingredients, { dish_ingredients: :ingredient }],
      media_items: [:hotspots, { hotspots: :ingredient }]
    ).find(params[:id])
  end

  def save_progress
    session_id = session.id.to_s
    media_index = params[:media_index].to_i
    StoryProgressService.save_progress(session_id, params[:id], media_index)
    head :ok
  end

  def get_progress
    session_id = session.id.to_s
    media_index = StoryProgressService.get_progress(session_id, params[:id])
    render json: { media_index: media_index }
  end
end

