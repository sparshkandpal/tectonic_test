class Story < ApplicationRecord
  belongs_to :restaurant
  belongs_to :dish, optional: true
  has_many :media_items, -> { order(position: :asc) }, dependent: :destroy
  has_one_attached :image

  scope :ordered, -> { order(position: :asc) }
  scope :recent, -> { where('created_at > ?', 24.hours.ago) }
  scope :expired, -> { where('created_at <= ?', 24.hours.ago) }
end
