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
        privateProfile: prefs.privateProfile,
      },
    };
  } catch (error) {
    console.error('Error getting preferences:', error);
    return { success: false, error: 'Failed to get preferences' };
  }
}
