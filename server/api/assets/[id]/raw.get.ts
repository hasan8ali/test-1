import { eq } from 'drizzle-orm'
import { assets } from '../../../db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const db = useDB()
  const asset = db.select().from(assets).where(eq(assets.id, id)).get()
  if (!asset) throw createError({ statusCode: 404, statusMessage: 'Asset not found' })

  // Cache for 1 year (assets are immutable once uploaded)
  setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  setResponseHeader(event, 'Content-Type', asset.type)
  setResponseHeader(event, 'Content-Length', String(asset.size))
  setResponseHeader(event, 'Content-Disposition', `inline; filename="${encodeURIComponent(asset.name)}"`)

  return asset.data
})
