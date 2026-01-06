class Restaurant < ApplicationRecord
  has_many :dishes, dependent: :destroy
  has_many :stories, dependent: :destroy

  validates :name, presence: true
end


