import { eq, or } from 'drizzle-orm'
import { themes } from '../../db/schema'
import { requireAuth, getTenantId } from '../../lib/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const tenantId = getTenantId(event)
  const db = useDB()

  // Built-in themes + tenant's custom themes
  const rows = db.select().from(themes)
    .where(or(eq(themes.tenantId, tenantId), eq(themes.isBuiltIn, 1)))
    .all()

  return rows.map(r => ({
    ...r,
    tokens: JSON.parse(r.tokens || '{}'),
    isBuiltIn: !!r.isBuiltIn
  }))
})
