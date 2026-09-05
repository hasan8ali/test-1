import { eq, and } from 'drizzle-orm'
import { sites, pages } from '../../db/schema'
import { requireAuth, getTenantId } from '../../lib/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const tenantId = getTenantId(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const db = useDB()

  // Delete pages first (cascade should handle, but explicit for safety)
  db.delete(pages).where(eq(pages.siteId, id)).run()
  const result = db.delete(sites)
    .where(and(eq(sites.id, id), eq(sites.tenantId, tenantId)))
    .run()

  if (result.changes === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Site not found' })
  }

  return { success: true }
})
