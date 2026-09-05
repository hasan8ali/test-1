import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { sites } from '../../db/schema'
import { requireAuth, getTenantId } from '../../lib/auth'

const schema = z.object({
  name: z.string().min(1).max(200).optional(),
  themeId: z.string().optional(),
  status: z.enum(['draft', 'published']).optional()
})

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const tenantId = getTenantId(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }

  const db = useDB()
  const updates: Record<string, any> = { updatedAt: Math.floor(Date.now() / 1000) }
  if (parsed.data.name !== undefined) updates.name = parsed.data.name
  if (parsed.data.themeId !== undefined) updates.themeId = parsed.data.themeId
  if (parsed.data.status !== undefined) updates.status = parsed.data.status

  const result = db.update(sites).set(updates)
    .where(and(eq(sites.id, id), eq(sites.tenantId, tenantId)))
    .run()

  if (result.changes === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Site not found' })
  }

  return { success: true }
})
