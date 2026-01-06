class StoriesController < ApplicationController
  def index
    @restaurants = Restaurant.includes(:stories).where(id: Story.select(:restaurant_id).distinct)
    @current_restaurant_id = params[:restaurant_id] || @restaurants.first&.id
    
    if @current_restaurant_id
      @current_restaurant = Restaurant.find(@current_restaurant_id)
      @stories = @current_restaurant.stories
        .includes(:restaurant, media_items: [:hotspots, { hotspots: :ingredient }])
        .recent
        .ordered
    else
      @stories = Story.none
    end
  end

  def show
    @story = Story.includes(
      :restaurant,
      media_items: [:hotspots, { hotspots: :ingredient }]
    ).find(params[:id])
    
    # Get dish for customization (first dish of restaurant or story's dish if exists)
    @dish = @story.dish || @story.restaurant.dishes.first
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
    @restaurants = Restaurant.all
  end

  def update
    @story = Story.find(params[:id])
    if @story.update(story_params)
      redirect_to edit_story_path(@story), notice: 'Story was successfully updated.'
    else
      @restaurants = Restaurant.all
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
    params.require(:story).permit(:restaurant_id, :dish_id, :position)
  end
end
