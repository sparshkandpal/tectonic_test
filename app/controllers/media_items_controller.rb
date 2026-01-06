class MediaItemsController < ApplicationController
  def show
    @media_item = MediaItem.includes(:hotspots, hotspots: :ingredient).find(params[:id])
  end
end

