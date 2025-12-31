// Re-export stores from features for backward compatibility
export { useWatchlistStore } from '@/features/watchlist';
export { useFavoritesStore } from '@/features/favorites';
export { useRatingsStore } from '@/features/ratings';

// UI Store remains in root as it's shared across features
export { useUIStore } from './ui-store';

// Settings and Notifications stores
export { useSettingsStore } from './settings-store';
export { useNotificationsStore } from './notifications-store';

// Re-export types
export type { PosterQuality, ViewMode } from './settings-store';
