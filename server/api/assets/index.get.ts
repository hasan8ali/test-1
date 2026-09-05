import { eq } from 'drizzle-orm'
import { assets } from '../../db/schema'
import { requireAuth, getTenantId } from '../../lib/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const tenantId = getTenantId(event)
  const db = useDB()

  const rows = db.select().from(assets).where(eq(assets.tenantId, tenantId)).all()
  return rows.map(r => ({
    ...r,
    url: `/api/assets/raw/${r.storageKey}`
  }))
})
