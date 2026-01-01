'use server';

import { db } from '@/lib/db';
import { userPreferences } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUser } from '@/features/auth/utils/get-user';

export interface UpdatePreferencesData {
  posterQuality?: string;
  viewMode?: string;
  showRatings?: boolean;
  showReleaseYear?: boolean;
  privateProfile?: boolean;
}

export async function updatePreferencesAction(
  data: UpdatePreferencesData
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Check if preferences exist
    const existing = await db.query.userPreferences.findFirst({
      where: eq(userPreferences.userId, user.id),
    });

    const updateData: Record<string, unknown> = { ...data };

    if (existing) {
      // Update existing preferences
      await db
        .update(userPreferences)
        .set(updateData)
        .where(eq(userPreferences.userId, user.id));
    } else {
      // Create new preferences
      await db.insert(userPreferences).values({
        userId: user.id,
        ...updateData,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating preferences:', error);
    return { success: false, error: 'Failed to update preferences' };
  }
}
