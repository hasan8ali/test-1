import { eq } from 'drizzle-orm'
import { sites } from '../../db/schema'
import { requireAuth, getTenantId } from '../../lib/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const tenantId = getTenantId(event)
  const db = useDB()

  const rows = db.select().from(sites).where(eq(sites.tenantId, tenantId)).all()
  return rows
})
