'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PosterQuality = 'low' | 'medium' | 'high';
export type ViewMode = 'grid' | 'list';

interface SettingsState {
  posterQuality: PosterQuality;
  viewMode: ViewMode;
  showRatings: boolean;
  showReleaseYear: boolean;
  privateProfile: boolean;
  setSettings: (settings: Partial<Pick<SettingsState, 'posterQuality' | 'viewMode' | 'showRatings' | 'showReleaseYear' | 'privateProfile'>>) => void;
  setFromServer: (settings: Partial<{ posterQuality: string | null; viewMode: string | null; showRatings: boolean; showReleaseYear: boolean; privateProfile: boolean }>) => void;
  clearLocalCache: () => void;
}

const getQualityFromStorage = (): PosterQuality => {
  if (typeof window === 'undefined') return 'medium';
  return 'medium';
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      posterQuality: getQualityFromStorage(),
      viewMode: 'grid',
      showRatings: true,
      showReleaseYear: true,
      privateProfile: false,

      setSettings: (settings) => {
        set(settings);
      },

      setFromServer: (settings) => {
        set({
          posterQuality: (settings.posterQuality as PosterQuality) || 'medium',
          viewMode: (settings.viewMode as ViewMode) || 'grid',
          showRatings: settings.showRatings ?? true,
          showReleaseYear: settings.showReleaseYear ?? true,
          privateProfile: settings.privateProfile ?? false,
        });
      },

      clearLocalCache: () => {
        localStorage.removeItem('filmazia-favorites');
        localStorage.removeItem('filmazia-watchlist');
        localStorage.removeItem('filmazia-settings');
        window.location.reload();
      },
    }),
    {
      name: 'filmazia-settings',
      partialize: (state) => ({
        posterQuality: state.posterQuality,
        viewMode: state.viewMode,
        showRatings: state.showRatings,
        showReleaseYear: state.showReleaseYear,
        privateProfile: state.privateProfile,
      }),
    }
  )
);
