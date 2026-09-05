import { eq, and } from 'drizzle-orm'
import { sites, pages } from '../../db/schema'
import { requireAuth, getTenantId } from '../../lib/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const tenantId = getTenantId(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const db = useDB()

  // Site (auto-filtered by tenant)
  const site = db.select().from(sites)
    .where(and(eq(sites.id, id), eq(sites.tenantId, tenantId)))
    .get()
  if (!site) throw createError({ statusCode: 404, statusMessage: 'Site not found' })

  // Pages
  const pageRows = db.select().from(pages).where(eq(pages.siteId, site.id)).all()

  return {
    ...site,
    pages: pageRows.map(p => ({
      ...p,
      blocks: JSON.parse(p.blocks || '[]'),
      meta: p.meta ? JSON.parse(p.meta) : null,
      isHome: !!p.isHome
    }))
  }
})
