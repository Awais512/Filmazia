'use server';

import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUser } from '@/features/auth/utils/get-user';

export async function clearNotificationsAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    await db.delete(notifications).where(eq(notifications.userId, user.id));

    return { success: true };
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return { success: false, error: 'Failed to clear notifications' };
  }
}
