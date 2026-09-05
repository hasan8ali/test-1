import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

/**
 * Multi-tenant schema.
 * Every table has tenant_id (except tenants itself and built-in templates).
 * Auto-filtered by the tenant middleware in server/utils/db.ts.
 */

export const tenants = sqliteTable('tenants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`)
})

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`)
})

export const themes = sqliteTable('themes', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id'),  // NULL for built-in themes
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  tokens: text('tokens').notNull().default('{}'),  // JSON: ThemeTokens
  parentThemeId: text('parent_theme_id'),           // for inheritance
  version: integer('version').notNull().default(1),
  isBuiltIn: integer('is_built_in', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`)
})

export const templates = sqliteTable('templates', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id'),  // NULL for built-in templates
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  category: text('category').notNull(),  // 'solo-course' | 'academy' | 'mentor'
  pages: text('pages').notNull(),        // JSON: array of page definitions
  defaultThemeId: text('default_theme_id'),
  thumbnail: text('thumbnail'),
  version: integer('version').notNull().default(1),
  isBuiltIn: integer('is_built_in', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`)
})

export const sites = sqliteTable('sites', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  templateId: text('template_id'),  // source template (NULL if blank)
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  themeId: text('theme_id').notNull(),
  status: text('status', { enum: ['draft', 'published'] }).notNull().default('draft'),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`)
})

export const pages = sqliteTable('pages', {
  id: text('id').primaryKey(),
  siteId: text('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  tenantId: text('tenant_id').notNull(),  // denormalized for fast filtering
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  blocks: text('blocks').notNull().default('[]'),  // JSON: Block[]
  meta: text('meta'),                               // JSON: SEO
  isHome: integer('is_home', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`)
})

export const assets = sqliteTable('assets', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  size: integer('size').notNull(),
  storageKey: text('storage_key').notNull(),  // path in local FS or R2 key
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`)
})

export type TenantRow = typeof tenants.$inferSelect
export type UserRow = typeof users.$inferSelect
export type ThemeRow = typeof themes.$inferSelect
export type TemplateRow = typeof templates.$inferSelect
export type SiteRow = typeof sites.$inferSelect
export type PageRow = typeof pages.$inferSelect
export type AssetRow = typeof assets.$inferSelect
