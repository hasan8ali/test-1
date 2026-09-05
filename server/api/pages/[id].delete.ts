import { eq } from 'drizzle-orm'
import { pages, snapshots } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const db = useDB()
  const page = db.select().from(pages).where(eq(pages.id, id)).get()
  if (!page) throw createError({ statusCode: 404, statusMessage: 'Page not found' })

  // Cascade delete: snapshots will be removed by FK constraint
  db.delete(snapshots).where(eq(snapshots.pageId, id)).run()
  db.delete(pages).where(eq(pages.id, id)).run()

  return { success: true, id }
})
