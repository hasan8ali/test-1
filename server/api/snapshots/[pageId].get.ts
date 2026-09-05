import { z } from 'zod'
import { desc, eq } from 'drizzle-orm'
import { snapshots } from '../../db/schema'
import { generateId } from '../../utils/security'

export default defineEventHandler(async (event) => {
  const pageId = getRouterParam(event, 'pageId')
  if (!pageId) throw createError({ statusCode: 400, statusMessage: 'Missing pageId' })

  const db = useDB()
  const rows = db.select()
    .from(snapshots)
    .where(eq(snapshots.pageId, pageId))
    .orderBy(desc(snapshots.createdAt))
    .all()

  return rows.map((r) => ({
    id: r.id,
    pageId: r.pageId,
    blocks: JSON.parse(r.blocks),
    label: r.label,
    summary: r.summary,
    createdAt: r.createdAt
  }))
})
