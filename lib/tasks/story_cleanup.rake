namespace :stories do
  desc "Delete stories older than 24 hours"
  task cleanup: :environment do
    expired_stories = Story.expired
    count = expired_stories.count
    expired_stories.destroy_all
    puts "Deleted #{count} expired stories (older than 24 hours)"
  end
end

