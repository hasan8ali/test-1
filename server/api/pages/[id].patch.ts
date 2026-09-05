import { z } from 'zod'
import { eq, and, desc } from 'drizzle-orm'
import { pages, snapshots } from '../../db/schema'
import { generateId } from '../../utils/security'

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().max(100).optional(),
  status: z.enum(['draft', 'published']).optional(),
  themeId: z.string().min(1).optional(),
  blocks: z.array(z.any()).optional(),
  meta: z.object({
    description: z.string().max(300).optional(),
    ogImage: z.string().optional(),
    keywords: z.array(z.string()).optional()
  }).optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const body = await readBody(event)
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid page data',
      data: parsed.error.flatten()
    })
  }

  const db = useDB()

  // Get the current page (so we can snapshot its blocks before update)
  const current = db.select().from(pages).where(eq(pages.id, id)).get()
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Page not found' })

  // Build the update set
  const updates: Record<string, any> = { updatedAt: Math.floor(Date.now() / 1000) }
  if (parsed.data.title !== undefined) updates.title = parsed.data.title
  if (parsed.data.slug !== undefined) {
    updates.slug = parsed.data.slug
    // ensure uniqueness
    const other = db.select().from(pages)
      .where(and(eq(pages.slug, parsed.data.slug))).get()
    if (other && other.id !== id) {
      updates.slug = `${parsed.data.slug}-${id.slice(0, 6)}`
    }
  }
  if (parsed.data.status !== undefined) updates.status = parsed.data.status
  if (parsed.data.themeId !== undefined) updates.themeId = parsed.data.themeId
  if (parsed.data.blocks !== undefined) updates.blocks = JSON.stringify(parsed.data.blocks)
  if (parsed.data.meta !== undefined) updates.meta = JSON.stringify(parsed.data.meta)

  db.update(pages).set(updates).where(eq(pages.id, id)).run()

  // Capture a snapshot for time-travel (only if blocks changed)
  if (parsed.data.blocks !== undefined) {
    const now = Math.floor(Date.now() / 1000)
    db.insert(snapshots).values({
      id: generateId(),
      pageId: id,
      blocks: JSON.stringify(parsed.data.blocks),
      summary: 'تعديل تلقائي',
      createdAt: now
    }).run()

    // Keep only the last 50 snapshots per page
    const all = db.select().from(snapshots)
      .where(eq(snapshots.pageId, id))
      .orderBy(desc(snapshots.createdAt))
      .all()
    if (all.length > 50) {
      const toDelete = all.slice(50)
      for (const s of toDelete) {
        db.delete(snapshots).where(eq(snapshots.id, s.id)).run()
      }
    }
  }

  // Return updated page
  const updated = db.select().from(pages).where(eq(pages.id, id)).get()
  return {
    id: updated!.id,
    slug: updated!.slug,
    title: updated!.title,
    status: updated!.status,
    themeId: updated!.themeId,
    blocks: JSON.parse(updated!.blocks),
    meta: updated!.meta ? JSON.parse(updated!.meta) : undefined,
    createdAt: updated!.createdAt,
    updatedAt: updated!.updatedAt
  }
})
