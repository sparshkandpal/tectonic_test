class StoryProgressService
  REDIS_KEY_PATTERN = 'story_progress:%s:%s'
  TTL = 24.hours

  def self.save_progress(session_id, story_id, media_index)
    redis = Redis.new
    key = REDIS_KEY_PATTERN % [session_id, story_id]
    redis.setex(key, TTL.to_i, media_index)
  end

  def self.get_progress(session_id, story_id)
    redis = Redis.new
    key = REDIS_KEY_PATTERN % [session_id, story_id]
    value = redis.get(key)
    value ? value.to_i : 0
  end
end

