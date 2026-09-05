import { eq, desc } from 'drizzle-orm'
import { pages } from '../../db/schema'

export default defineEventHandler(async () => {
  const db = useDB()
  const rows = db.select().from(pages).orderBy(desc(pages.updatedAt)).all()

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status,
    themeId: row.themeId,
    blocks: safeParse(row.blocks, []),
    meta: safeParse(row.meta, undefined),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }))
})

function safeParse<T>(s: string | null, fallback: T): T {
  if (!s) return fallback
  try { return JSON.parse(s) as T } catch { return fallback }
}
