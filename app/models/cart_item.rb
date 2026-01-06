class CartItem < ApplicationRecord
  belongs_to :dish

  before_save :calculate_total_price

  def self.for_session(session_id)
    where(session_id: session_id)
  end

  private

  def calculate_total_price
    self.total_price = dish.calculate_price_with_customizations(customizations || {})[:total]
  end
end

