import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const favoriteFolders = pgTable('favorite_folders', {
  id: text('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const favorites = pgTable(
  'favorites',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    itemId: integer('item_id').notNull(),
    itemType: text('item_type').notNull(),
    title: text('title').notNull(),
    posterPath: text('poster_path'),
    folderId: text('folder_id').references(() => favoriteFolders.id, {
      onDelete: 'set null',
    }),
    addedAt: timestamp('added_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.itemId] }),
  })
);

export const watchlist = pgTable(
  'watchlist',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    itemId: integer('item_id').notNull(),
    itemType: text('item_type').notNull(),
    title: text('title').notNull(),
    posterPath: text('poster_path'),
    addedAt: timestamp('added_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    watched: boolean('watched').default(false).notNull(),
    watchedAt: timestamp('watched_at', { withTimezone: true }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.itemId] }),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
