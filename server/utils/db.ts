import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import * as schema from '../db/schema'

let _db: ReturnType<typeof drizzle> | null = null
let _sqlite: Database.Database | null = null

/**
 * Singleton database connection.
 * The DB file lives at `data/tolnera.db` (hardcoded default).
 * Override with TOLNERA_DB_PATH env var if needed.
 */
export function useDB() {
  if (!_db) {
    const dbPath = resolve(process.cwd(), process.env.TOLNERA_DB_PATH || './data/tolnera.db')

    // Ensure directory exists
    mkdirSync(dirname(dbPath), { recursive: true })

    _sqlite = new Database(dbPath)
    _sqlite.pragma('journal_mode = WAL')
    _sqlite.pragma('foreign_keys = ON')
    _sqlite.pragma('synchronous = NORMAL')

    _db = drizzle(_sqlite, { schema })

    // Run migrations (idempotent)
    initSchema(_sqlite)
  }
  return _db
}

/**
 * Initialize the schema with raw SQL (Drizzle-kit migrations would be used
 * in production; for the first release we declare everything explicitly).
 */
function initSchema(sqlite: Database.Database) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      theme_id TEXT NOT NULL,
      blocks TEXT NOT NULL DEFAULT '[]',
      meta TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS themes (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      thumbnail TEXT,
      tokens TEXT NOT NULL DEFAULT '{}',
      parent_theme_id TEXT,
      is_built_in INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      size INTEGER NOT NULL,
      data BLOB NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS snapshots (
      id TEXT PRIMARY KEY NOT NULL,
      page_id TEXT NOT NULL,
      blocks TEXT NOT NULL,
      label TEXT,
      summary TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
    CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
    CREATE INDEX IF NOT EXISTS idx_themes_builtin ON themes(is_built_in);
    CREATE INDEX IF NOT EXISTS idx_snapshots_page ON snapshots(page_id, created_at DESC);
  `)

  // Seed built-in themes if none exist
  const count = sqlite.prepare('SELECT COUNT(*) as c FROM themes WHERE is_built_in = 1').get() as { c: number }
  if (count.c === 0) {
    seedBuiltInThemes(sqlite)
  }
}

function seedBuiltInThemes(sqlite: Database.Database) {
  const now = Math.floor(Date.now() / 1000)
  const themes = [
    {
      id: 'theme-aurora',
      name: 'Aurora',
      description: 'ثيم عصري بألوان البنفسجي والأزرق — مثالي لمنصات التعليم',
      tokens: JSON.stringify({
        'color.primary': '#6366f1',
        'color.primaryForeground': '#ffffff',
        'color.secondary': '#8b5cf6',
        'color.secondaryForeground': '#ffffff',
        'color.accent': '#ec4899',
        'color.bg': '#ffffff',
        'color.surface': '#f8fafc',
        'color.surfaceElevated': '#ffffff',
        'color.border': '#e2e8f0',
        'color.text': '#0f172a',
        'color.textMuted': '#64748b',
        'color.textSubtle': '#94a3b8',
        'font.heading': "'Cairo', 'Inter', sans-serif",
        'font.body': "'Cairo', 'Inter', sans-serif",
        'radius.lg': '0.75rem',
        'radius.xl': '1rem'
      })
    },
    {
      id: 'theme-midnight',
      name: 'Midnight',
      description: 'ثيم داكن فاخر — للعلامات التجارية الراقية',
      tokens: JSON.stringify({
        'color.primary': '#a78bfa',
        'color.primaryForeground': '#0f172a',
        'color.secondary': '#22d3ee',
        'color.secondaryForeground': '#0f172a',
        'color.accent': '#f472b6',
        'color.bg': '#0f172a',
        'color.surface': '#1e293b',
        'color.surfaceElevated': '#334155',
        'color.border': '#475569',
        'color.text': '#f1f5f9',
        'color.textMuted': '#cbd5e1',
        'color.textSubtle': '#94a3b8',
        'font.heading': "'Reem Kufi', sans-serif",
        'font.body': "'IBM Plex Sans Arabic', sans-serif",
        'radius.lg': '0.5rem',
        'radius.xl': '0.75rem'
      })
    },
    {
      id: 'theme-sunset',
      name: 'Sunset',
      description: 'ثيم دافئ بألوان البرتقالي والوردي — للكورسات الإبداعية',
      tokens: JSON.stringify({
        'color.primary': '#f97316',
        'color.primaryForeground': '#ffffff',
        'color.secondary': '#e11d48',
        'color.secondaryForeground': '#ffffff',
        'color.accent': '#facc15',
        'color.bg': '#fffbeb',
        'color.surface': '#fef3c7',
        'color.surfaceElevated': '#ffffff',
        'color.border': '#fde68a',
        'color.text': '#451a03',
        'color.textMuted': '#92400e',
        'color.textSubtle': '#b45309',
        'font.heading': "'Tajawal', sans-serif",
        'font.body': "'Tajawal', sans-serif",
        'radius.lg': '1rem',
        'radius.xl': '1.5rem'
      })
    },
    {
      id: 'theme-forest',
      name: 'Forest',
      description: 'ثيم طبيعي بألوان الأخضر — للكورسات الصحية والبيئية',
      tokens: JSON.stringify({
        'color.primary': '#10b981',
        'color.primaryForeground': '#ffffff',
        'color.secondary': '#059669',
        'color.secondaryForeground': '#ffffff',
        'color.accent': '#84cc16',
        'color.bg': '#f0fdf4',
        'color.surface': '#dcfce7',
        'color.surfaceElevated': '#ffffff',
        'color.border': '#bbf7d0',
        'color.text': '#052e16',
        'color.textMuted': '#166534',
        'color.textSubtle': '#15803d',
        'font.heading': "'Cairo', sans-serif",
        'font.body': "'Cairo', sans-serif",
        'radius.lg': '0.75rem',
        'radius.xl': '1.25rem'
      })
    },
    {
      id: 'theme-mono',
      name: 'Mono',
      description: 'ثيم مينيمال أبيض وأسود — للكورسات التقنية والأكاديمية',
      tokens: JSON.stringify({
        'color.primary': '#000000',
        'color.primaryForeground': '#ffffff',
        'color.secondary': '#525252',
        'color.secondaryForeground': '#ffffff',
        'color.accent': '#737373',
        'color.bg': '#ffffff',
        'color.surface': '#fafafa',
        'color.surfaceElevated': '#ffffff',
        'color.border': '#e5e5e5',
        'color.text': '#171717',
        'color.textMuted': '#525252',
        'color.textSubtle': '#a3a3a3',
        'font.heading': "'Inter', sans-serif",
        'font.body': "'Inter', sans-serif",
        'radius.lg': '0',
        'radius.xl': '0'
      })
    },
    {
      id: 'theme-ocean',
      name: 'Ocean',
      description: 'ثيم هادئ بألوان الأزرق والفيروزي — للكورسات البحرية والعلمية',
      tokens: JSON.stringify({
        'color.primary': '#0ea5e9',
        'color.primaryForeground': '#ffffff',
        'color.secondary': '#06b6d4',
        'color.secondaryForeground': '#ffffff',
        'color.accent': '#6366f1',
        'color.bg': '#f0f9ff',
        'color.surface': '#e0f2fe',
        'color.surfaceElevated': '#ffffff',
        'color.border': '#bae6fd',
        'color.text': '#082f49',
        'color.textMuted': '#0c4a6e',
        'color.textSubtle': '#0369a1',
        'font.heading': "'Cairo', sans-serif",
        'font.body': "'IBM Plex Sans Arabic', sans-serif",
        'radius.lg': '0.75rem',
        'radius.xl': '1.25rem'
      })
    }
  ]

  const stmt = sqlite.prepare(`
    INSERT INTO themes (id, name, description, tokens, is_built_in, created_at, updated_at)
    VALUES (@id, @name, @description, @tokens, 1, @now, @now)
  `)

  for (const t of themes) {
    stmt.run({ ...t, now })
  }
}
