import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

/* Timestamps are stored as Unix epoch seconds (integer). */

export const pages = sqliteTable('pages', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  status: text('status', { enum: ['draft', 'published'] }).notNull().default('draft'),
  themeId: text('theme_id').notNull(),
  /** Serialized Block[] (JSON) */
  blocks: text('blocks').notNull().default('[]'),
  /** SEO + social meta (JSON) */
  meta: text('meta'),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`)
})

export const themes = sqliteTable('themes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  thumbnail: text('thumbnail'),
  /** JSON: ThemeTokens */
  tokens: text('tokens').notNull().default('{}'),
  parentThemeId: text('parent_theme_id'),
  isBuiltIn: integer('is_built_in', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`)
})

export const assets = sqliteTable('assets', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  size: integer('size').notNull(),
  /** Magic-byte-validated file blob */
  data: blob('data', { mode: 'buffer' }).notNull(),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`)
})

export const snapshots = sqliteTable('snapshots', {
  id: text('id').primaryKey(),
  pageId: text('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  /** Serialized Block[] (JSON) */
  blocks: text('blocks').notNull(),
  label: text('label'),
  summary: text('summary'),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`)
})

export type PageRow = typeof pages.$inferSelect
export type ThemeRow = typeof themes.$inferSelect
export type AssetRow = typeof assets.$inferSelect
export type SnapshotRow = typeof snapshots.$inferSelect
