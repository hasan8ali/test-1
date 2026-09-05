import { desc, eq } from 'drizzle-orm'
import { themes } from '../../db/schema'

export default defineEventHandler(async () => {
  const db = useDB()
  const rows = db.select().from(themes).orderBy(desc(themes.createdAt)).all()
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    thumbnail: row.thumbnail,
    tokens: JSON.parse(row.tokens || '{}'),
    parentThemeId: row.parentThemeId,
    isBuiltIn: row.isBuiltIn,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }))
})
