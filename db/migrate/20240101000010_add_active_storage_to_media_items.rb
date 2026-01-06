class AddActiveStorageToMediaItems < ActiveRecord::Migration[6.1]
  def change
    # Active Storage will handle the attachment table
    # This migration ensures the media_items table is ready
  end
end

