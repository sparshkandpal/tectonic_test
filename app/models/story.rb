class Story < ApplicationRecord
  belongs_to :restaurant
  has_many :media_items, -> { order(position: :asc) }, dependent: :destroy

  scope :ordered, -> { order(position: :asc) }
  scope :recent, -> { where('created_at > ?', 24.hours.ago) }
  scope :expired, -> { where('created_at <= ?', 24.hours.ago) }

  # Keep dish reference for backward compatibility (optional)
  belongs_to :dish, optional: true
end
