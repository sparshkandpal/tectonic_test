class StoryCleanupJob < ApplicationJob
  queue_as :default

  def perform
    expired_stories = Story.expired
    count = expired_stories.count
    expired_stories.destroy_all
    Rails.logger.info "Deleted #{count} expired stories (older than 24 hours)"
  end
end

