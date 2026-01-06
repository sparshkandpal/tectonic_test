class Hotspot < ApplicationRecord
  belongs_to :media_item
  belongs_to :ingredient

  validates :x_position, presence: true, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :y_position, presence: true, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
end

