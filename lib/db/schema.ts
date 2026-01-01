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

export const userPreferences = pgTable('user_preferences', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  // Content preferences
  posterQuality: text('poster_quality').default('medium'),
  viewMode: text('view_mode').default('grid'),
  showRatings: boolean('show_ratings').default(true).notNull(),
  showReleaseYear: boolean('show_release_year').default(true).notNull(),
  // Privacy preferences
  privateProfile: boolean('private_profile').default(false).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type NewUserPreference = typeof userPreferences.$inferInsert;
