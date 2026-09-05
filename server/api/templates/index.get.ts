import { eq } from 'drizzle-orm'
import { templates } from '../../db/schema'

/**
 * List all available templates (built-in + tenant's custom).
 * Public endpoint — no auth required (templates are catalog, not user data).
 */
export default defineEventHandler(async (event) => {
  const db = useDB()
  const rows = db.select().from(templates).where(eq(templates.isBuiltIn, 1)).all()

  return rows.map(r => ({
    ...r,
    pages: JSON.parse(r.pages || '[]'),
    isBuiltIn: !!r.isBuiltIn
  }))
})
