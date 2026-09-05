import { eq } from 'drizzle-orm'
import { assets } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const db = useDB()
  const asset = db.select().from(assets).where(eq(assets.id, id)).get()
  if (!asset) throw createError({ statusCode: 404, statusMessage: 'Asset not found' })

  db.delete(assets).where(eq(assets.id, id)).run()
  return { success: true, id }
})
