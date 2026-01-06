# Story Cleanup Background Job

Stories are automatically deleted after 24 hours of creation. This is handled by a background job.

## Setup

### Option 1: Cron Job (Recommended for Production)

Add to your crontab (`crontab -e`):

```bash
# Run story cleanup every hour
0 * * * * cd /path/to/app && bin/rails stories:cleanup RAILS_ENV=production
```

### Option 2: Rails Runner (Manual)

Run manually when needed:

```bash
bin/rails stories:cleanup
```

### Option 3: Active Job (Requires Job Processor)

If you have Sidekiq, Delayed Job, or another job processor configured:

```ruby
# Schedule in an initializer or rake task
StoryCleanupJob.perform_later
```

## Testing

To test the cleanup manually:

```ruby
# In Rails console
Story.expired.count  # Check how many stories will be deleted
Story.expired.destroy_all  # Delete expired stories
```

## Configuration

The 24-hour expiration is defined in `app/models/story.rb`:

```ruby
scope :recent, -> { where('created_at > ?', 24.hours.ago) }
scope :expired, -> { where('created_at <= ?', 24.hours.ago) }
```

To change the expiration time, modify the scope in the Story model.

