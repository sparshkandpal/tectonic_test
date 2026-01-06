class Story < ApplicationRecord
  belongs_to :dish
  has_many :media_items, -> { order(position: :asc) }, dependent: :destroy

  scope :ordered, -> { order(position: :asc) }
end

