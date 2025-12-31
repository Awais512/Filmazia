'use server';

import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getUser } from '@/features/auth/utils/get-user';
import type { Notification } from '@/lib/db/schema';

export async function getNotificationsAction(): Promise<{
  success: boolean;
  data?: Notification[];
  error?: string;
}> {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const userNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, user.id),
      orderBy: [desc(notifications.createdAt)],
      limit: 50,
    });

    return { success: true, data: userNotifications };
  } catch (error) {
    console.error('Error getting notifications:', error);
    return { success: false, error: 'Failed to get notifications' };
  }
}
