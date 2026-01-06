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

  def new
    @story = Story.new
    @story.dish = Dish.find(params[:dish_id]) if params[:dish_id]
    @dishes = Dish.all
  end

  def create
    @story = Story.new(story_params)
    if @story.save
      redirect_to edit_story_path(@story), notice: 'Story was successfully created. Now add media items.'
    else
      @dishes = Dish.all
      render :new
    end
  end

  def edit
    @story = Story.find(params[:id])
    @dishes = Dish.all
  end

  def update
    @story = Story.find(params[:id])
    if @story.update(story_params)
      redirect_to edit_story_path(@story), notice: 'Story was successfully updated.'
    else
      @dishes = Dish.all
      render :edit
    end
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

  private

  def story_params
    params.require(:story).permit(:dish_id, :position)
  end
end
