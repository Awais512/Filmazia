"use server";

import { and, eq } from 'drizzle-orm';
import { requireAuth } from '@/features/auth/utils/require-auth';
import { db } from '@/lib/db';
import { favoriteFolders, favorites } from '@/lib/db/schema';

export type FavoriteItemPayload = {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  folderId?: string;
};

const toIsoString = (value: Date | string) =>
  value instanceof Date ? value.toISOString() : value;

export async function getFavoritesAction() {
  const user = await requireAuth();

  const [items, folders] = await Promise.all([
    db.select().from(favorites).where(eq(favorites.userId, user.id)),
    db.select().from(favoriteFolders).where(eq(favoriteFolders.userId, user.id)),
  ]);

  const itemsByFolder = new Map<string, number[]>();

  for (const item of items) {
    if (!item.folderId) continue;
    const current = itemsByFolder.get(item.folderId) ?? [];
    current.push(item.itemId);
    itemsByFolder.set(item.folderId, current);
  }

  return {
    items: items.map((item) => ({
      id: item.itemId,
      addedAt: toIsoString(item.addedAt),
      folderId: item.folderId ?? undefined,
      type: item.itemType as 'movie' | 'tv',
      title: item.title,
      poster_path: item.posterPath,
    })),
    folders: folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      movieIds: itemsByFolder.get(folder.id) ?? [],
      createdAt: toIsoString(folder.createdAt),
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
      folderId: payload.folderId ?? null,
      addedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [favorites.userId, favorites.itemId],
      set: {
        itemType: payload.type,
        title: payload.title,
        posterPath: payload.poster_path,
        folderId: payload.folderId ?? null,
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

export async function createFavoriteFolderAction(payload: { id: string; name: string }) {
  const user = await requireAuth();

  await db.insert(favoriteFolders).values({
    id: payload.id,
    userId: user.id,
    name: payload.name,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function renameFavoriteFolderAction(payload: { id: string; name: string }) {
  const user = await requireAuth();

  await db
    .update(favoriteFolders)
    .set({
      name: payload.name,
      updatedAt: new Date(),
    })
    .where(and(eq(favoriteFolders.userId, user.id), eq(favoriteFolders.id, payload.id)));
}

export async function deleteFavoriteFolderAction(payload: { id: string }) {
  const user = await requireAuth();

  await db
    .update(favorites)
    .set({ folderId: null })
    .where(and(eq(favorites.userId, user.id), eq(favorites.folderId, payload.id)));

  await db
    .delete(favoriteFolders)
    .where(and(eq(favoriteFolders.userId, user.id), eq(favoriteFolders.id, payload.id)));
}

export async function removeFavoriteFromFolderAction(payload: { id: number; folderId: string }) {
  const user = await requireAuth();

  await db
    .update(favorites)
    .set({ folderId: null })
    .where(
      and(
        eq(favorites.userId, user.id),
        eq(favorites.itemId, payload.id),
        eq(favorites.folderId, payload.folderId)
      )
    );
}
