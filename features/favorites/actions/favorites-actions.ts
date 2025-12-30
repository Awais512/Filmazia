"use server";

import { and, eq } from 'drizzle-orm';
import { requireAuth } from '@/features/auth/utils/require-auth';
import { db } from '@/lib/db';
import { favorites } from '@/lib/db/schema';

export type FavoriteItemPayload = {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
};

const toIsoString = (value: Date | string) =>
  value instanceof Date ? value.toISOString() : value;

export async function getFavoritesAction() {
  const user = await requireAuth();

  const items = await db.select().from(favorites).where(eq(favorites.userId, user.id));

  return {
    items: items.map((item) => ({
      id: item.itemId,
      addedAt: toIsoString(item.addedAt),
      type: item.itemType as 'movie' | 'tv',
      title: item.title,
      poster_path: item.posterPath,
    })),
  };
}

export async function addFavoriteAction(payload: FavoriteItemPayload) {
  const user = await requireAuth();

  await db
    .insert(favorites)
    .values({
      userId: user.id,
      itemId: payload.id,
      itemType: payload.type,
      title: payload.title,
      posterPath: payload.poster_path,
      addedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [favorites.userId, favorites.itemId],
      set: {
        itemType: payload.type,
        title: payload.title,
        posterPath: payload.poster_path,
        addedAt: new Date(),
      },
    });
}

export async function removeFavoriteAction(payload: { id: number }) {
  const user = await requireAuth();

  await db
    .delete(favorites)
    .where(and(eq(favorites.userId, user.id), eq(favorites.itemId, payload.id)));
}

// NEW: Clear all favorites for the current user
export async function clearFavoritesAction() {
  const user = await requireAuth();

  await db.delete(favorites).where(eq(favorites.userId, user.id));
}
