'use server';

import { db } from '@/lib/db';
import { userPreferences } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUser } from '@/features/auth/utils/get-user';

export interface UserPreferencesData {
  posterQuality: string | null;
  viewMode: string | null;
  showRatings: boolean;
  showReleaseYear: boolean;
  genreAlertsEnabled: boolean;
  favoriteGenres: number[] | null;
  watchlistReminders: boolean;
  privateProfile: boolean;
}

export async function getPreferencesAction(): Promise<{
  success: boolean;
  data?: UserPreferencesData;
  error?: string;
}> {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const prefs = await db.query.userPreferences.findFirst({
      where: eq(userPreferences.userId, user.id),
    });

    if (!prefs) {
      // Return default preferences
      return {
        success: true,
        data: {
          posterQuality: 'medium',
          viewMode: 'grid',
          showRatings: true,
          showReleaseYear: true,
          genreAlertsEnabled: false,
          favoriteGenres: [],
          watchlistReminders: false,
          privateProfile: false,
        },
      };
    }

    return {
      success: true,
      data: {
        posterQuality: prefs.posterQuality,
        viewMode: prefs.viewMode,
        showRatings: prefs.showRatings,
        showReleaseYear: prefs.showReleaseYear,
        genreAlertsEnabled: prefs.genreAlertsEnabled,
        favoriteGenres: (prefs.favoriteGenres as unknown as number[]) || null,
        watchlistReminders: prefs.watchlistReminders,
        privateProfile: prefs.privateProfile,
      },
    };
  } catch (error) {
    console.error('Error getting preferences:', error);
    return { success: false, error: 'Failed to get preferences' };
  }
}
