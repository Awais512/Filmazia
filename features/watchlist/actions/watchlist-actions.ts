"use server";

import { and, eq } from 'drizzle-orm';
import { requireAuth } from '@/features/auth/utils/require-auth';
import { db } from '@/lib/db';
import { watchlist } from '@/lib/db/schema';

export type WatchlistItemPayload = {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
};

const toIsoString = (value: Date | string | null) => {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
};

export async function getWatchlistAction() {
  const user = await requireAuth();

  const items = await db.select().from(watchlist).where(eq(watchlist.userId, user.id));

  return items.map((item) => ({
    id: item.itemId,
    addedAt: toIsoString(item.addedAt) ?? new Date().toISOString(),
    watched: item.watched,
    watchedAt: toIsoString(item.watchedAt) ?? undefined,
    type: item.itemType as 'movie' | 'tv',
    title: item.title,
    poster_path: item.posterPath,
  }));
}

export async function addWatchlistAction(payload: WatchlistItemPayload) {
  const user = await requireAuth();

  await db
    .insert(watchlist)
    .values({
      userId: user.id,
      itemId: payload.id,
      itemType: payload.type,
      title: payload.title,
      posterPath: payload.poster_path,
      addedAt: new Date(),
      watched: false,
      watchedAt: null,
    })
    .onConflictDoUpdate({
      target: [watchlist.userId, watchlist.itemId],
      set: {
        itemType: payload.type,
        title: payload.title,
        posterPath: payload.poster_path,
        addedAt: new Date(),
        watched: false,
        watchedAt: null,
      },
    });
}

export async function removeWatchlistAction(payload: { id: number }) {
  const user = await requireAuth();

  await db
    .delete(watchlist)
    .where(and(eq(watchlist.userId, user.id), eq(watchlist.itemId, payload.id)));
}

export async function markWatchlistWatchedAction(payload: { id: number }) {
  const user = await requireAuth();

  await db
    .update(watchlist)
    .set({ watched: true, watchedAt: new Date() })
    .where(and(eq(watchlist.userId, user.id), eq(watchlist.itemId, payload.id)));
}

export async function markWatchlistUnwatchedAction(payload: { id: number }) {
  const user = await requireAuth();

  await db
    .update(watchlist)
    .set({ watched: false, watchedAt: null })
    .where(and(eq(watchlist.userId, user.id), eq(watchlist.itemId, payload.id)));
}

// NEW: Clear all watchlist items for the current user
export async function clearWatchlistAction() {
  const user = await requireAuth();

  await db.delete(watchlist).where(eq(watchlist.userId, user.id));
}
