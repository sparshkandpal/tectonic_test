class MediaItem < ApplicationRecord
  belongs_to :story
  has_one_attached :file
  has_many :hotspots, dependent: :destroy

  enum media_type: { image: 0, video: 1 }

  def duration_ms
    image? ? 5000 : duration
  end
end

