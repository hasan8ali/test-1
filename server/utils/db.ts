import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import * as schema from '../db/schema'

let _db: ReturnType<typeof drizzle> | null = null
let _sqlite: Database.Database | null = null

export function useDB() {
  if (!_db) {
    const dbPath = resolve(process.cwd(), process.env.TOLNERA_DB_PATH || './data/tolnera.db')
    mkdirSync(dirname(dbPath), { recursive: true })
    _sqlite = new Database(dbPath)
    _sqlite.pragma('journal_mode = WAL')
    _sqlite.pragma('foreign_keys = ON')
    _sqlite.pragma('synchronous = NORMAL')
    _db = drizzle(_sqlite, { schema })
    initSchema(_sqlite)
  }
  return _db
}

function initSchema(sqlite: Database.Database) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      tenant_id TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS themes (
      id TEXT PRIMARY KEY NOT NULL,
      tenant_id TEXT,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      tokens TEXT NOT NULL DEFAULT '{}',
      parent_theme_id TEXT,
      version INTEGER NOT NULL DEFAULT 1,
      is_built_in INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY NOT NULL,
      tenant_id TEXT,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL,
      pages TEXT NOT NULL,
      default_theme_id TEXT,
      thumbnail TEXT,
      version INTEGER NOT NULL DEFAULT 1,
      is_built_in INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS sites (
      id TEXT PRIMARY KEY NOT NULL,
      tenant_id TEXT NOT NULL,
      template_id TEXT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      theme_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY NOT NULL,
      site_id TEXT NOT NULL,
      tenant_id TEXT NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      blocks TEXT NOT NULL DEFAULT '[]',
      meta TEXT,
      is_home INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
      FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY NOT NULL,
      tenant_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      size INTEGER NOT NULL,
      storage_key TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_themes_tenant ON themes(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_templates_builtin ON templates(is_built_in);
    CREATE INDEX IF NOT EXISTS idx_sites_tenant ON sites(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_pages_site ON pages(site_id);
    CREATE INDEX IF NOT EXISTS idx_pages_tenant ON pages(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_assets_tenant ON assets(tenant_id);
  `)

  const hasThemes = sqlite.prepare('SELECT COUNT(*) as c FROM themes WHERE is_built_in = 1').get() as { c: number }
  if (hasThemes.c === 0) seedBuiltIns(sqlite)
}

function seedBuiltIns(sqlite: Database.Database) {
  const now = Math.floor(Date.now() / 1000)

  // ===== Built-in themes =====
  const themes = [
    {
      id: 'theme-mono-dark',
      name: 'Mono Dark',
      description: 'داكن مونوكروم — Resend-style',
      tokens: JSON.stringify({
        'color.bg': '#0a0a0a',
        'color.surface': '#171717',
        'color.text': '#fafafa',
        'color.textMuted': '#a3a3a3',
        'color.accent': '#bef264',
        'color.accentFg': '#0a0a0a',
        'color.border': '#262626',
        'font.heading': "'IBM Plex Sans Arabic', sans-serif",
        'font.body': "'IBM Plex Sans Arabic', sans-serif",
        'radius': '8px'
      })
    },
    {
      id: 'theme-mono-light',
      name: 'Mono Light',
      description: 'فاتح مونوكروم — نضيف',
      tokens: JSON.stringify({
        'color.bg': '#ffffff',
        'color.surface': '#fafafa',
        'color.text': '#0a0a0a',
        'color.textMuted': '#525252',
        'color.accent': '#84cc16',
        'color.accentFg': '#0a0a0a',
        'color.border': '#e5e5e5',
        'font.heading': "'IBM Plex Sans Arabic', sans-serif",
        'font.body': "'IBM Plex Sans Arabic', sans-serif",
        'radius': '8px'
      })
    },
    {
      id: 'theme-warm',
      name: 'Warm',
      description: 'دافئ بألوان التراب',
      tokens: JSON.stringify({
        'color.bg': '#fefcF5',
        'color.surface': '#faf6ee',
        'color.text': '#1c1917',
        'color.textMuted': '#78716c',
        'color.accent': '#d97706',
        'color.accentFg': '#fefcF5',
        'color.border': '#e7e0d4',
        'font.heading': "'IBM Plex Sans Arabic', sans-serif",
        'font.body': "'IBM Plex Sans Arabic', sans-serif",
        'radius': '6px'
      })
    },
    {
      id: 'theme-editorial',
      name: 'Editorial',
      description: 'تحريري بألوان الجريدة',
      tokens: JSON.stringify({
        'color.bg': '#fdfcfb',
        'color.surface': '#f5f3f0',
        'color.text': '#1c1917',
        'color.textMuted': '#57534e',
        'color.accent': '#dc2626',
        'color.accentFg': '#fdfcfb',
        'color.border': '#e7e5e4',
        'font.heading': 'Georgia, serif',
        'font.body': "'IBM Plex Sans Arabic', sans-serif",
        'radius': '2px'
      })
    }
  ]

  const themeStmt = sqlite.prepare(`
    INSERT INTO themes (id, tenant_id, name, description, tokens, is_built_in, created_at, updated_at)
    VALUES (@id, NULL, @name, @description, @tokens, 1, @now, @now)
  `)
  for (const t of themes) themeStmt.run({ ...t, now })

  // ===== Built-in templates (3 distinct layouts) =====
  // Defined in server/utils/templates-seed.ts for clarity
  const { seedTemplates } = require('./templates-seed')
  seedTemplates(sqlite, now, themes[0].id)
}
