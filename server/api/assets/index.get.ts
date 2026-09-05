import { desc, eq } from 'drizzle-orm'
import { assets } from '../../db/schema'

export default defineEventHandler(async () => {
  const db = useDB()
  const rows = db.select({
    id: assets.id,
    name: assets.name,
    type: assets.type,
    size: assets.size,
    createdAt: assets.createdAt
  }).from(assets).orderBy(desc(assets.createdAt)).all()

  return rows.map((r) => ({
    ...r,
    url: `/api/assets/${r.id}/raw`
  }))
})
