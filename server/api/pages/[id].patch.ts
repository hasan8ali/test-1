import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { pages, sites } from '../../db/schema'
import { requireAuth, getTenantId } from '../../lib/auth'

const schema = z.object({
  blocks: z.array(z.any()),
  title: z.string().max(200).optional(),
  slug: z.string().max(100).optional(),
  meta: z.object({ description: z.string().optional(), ogImage: z.string().optional() }).optional()
})

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const tenantId = getTenantId(event)
  const pageId = getRouterParam(event, 'id')
  if (!pageId) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }

  const db = useDB()

  // Verify page belongs to tenant (via site)
  const page = db.select().from(pages)
    .where(and(eq(pages.id, pageId), eq(pages.tenantId, tenantId)))
    .get()
  if (!page) throw createError({ statusCode: 404, statusMessage: 'Page not found' })

  const updates: Record<string, any> = { updatedAt: Math.floor(Date.now() / 1000) }
  if (parsed.data.blocks !== undefined) updates.blocks = JSON.stringify(parsed.data.blocks)
  if (parsed.data.title !== undefined) updates.title = parsed.data.title
  if (parsed.data.slug !== undefined) updates.slug = parsed.data.slug
  if (parsed.data.meta !== undefined) updates.meta = JSON.stringify(parsed.data.meta)

  db.update(pages).set(updates).where(eq(pages.id, pageId)).run()

  return { success: true }
})
