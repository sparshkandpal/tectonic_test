class MediaItemsController < ApplicationController
  def show
    @media_item = MediaItem.includes(:hotspots, hotspots: :ingredient).find(params[:id])
  end

  def new
    @story = Story.find(params[:story_id])
    @media_item = @story.media_items.build
  end

  def create
    @story = Story.find(params[:story_id])
    @media_item = @story.media_items.build(media_item_params)
    
    # Set position if not provided
    @media_item.position ||= @story.media_items.count + 1
    
    if @media_item.save
      redirect_to edit_story_path(@story), notice: 'Media item was successfully added.'
    else
      render :new
    end
  end

  def edit
    @media_item = MediaItem.find(params[:id])
    @story = @media_item.story
  end

  def update
    @media_item = MediaItem.find(params[:id])
    @story = @media_item.story
    if @media_item.update(media_item_params)
      redirect_to edit_story_path(@story), notice: 'Media item was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @media_item = MediaItem.find(params[:id])
    @story = @media_item.story
    @media_item.destroy
    redirect_to edit_story_path(@story), notice: 'Media item was successfully deleted.'
  end

  private

  def media_item_params
    params.require(:media_item).permit(:media_type, :position, :duration, :file)
  end
end
