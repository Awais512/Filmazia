-- Drop notifications table and its policies
DROP TABLE IF EXISTS notifications CASCADE;

-- Remove notification-related columns from user_preferences table
ALTER TABLE user_preferences
  DROP COLUMN IF EXISTS genre_alerts_enabled,
  DROP COLUMN IF EXISTS favorite_genres,
  DROP COLUMN IF EXISTS watchlist_reminders;
