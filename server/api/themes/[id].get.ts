import { eq } from 'drizzle-orm'
import { themes } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const db = useDB()
  const theme = db.select().from(themes).where(eq(themes.id, id)).get()
  if (!theme) throw createError({ statusCode: 404, statusMessage: 'Theme not found' })

  // Resolve inheritance chain (parent tokens overridden by child)
  const resolved = resolveTheme(db, theme.id)

  return {
    id: theme.id,
    name: theme.name,
    description: theme.description,
    thumbnail: theme.thumbnail,
    tokens: resolved,
    parentThemeId: theme.parentThemeId,
    isBuiltIn: theme.isBuiltIn,
    createdAt: theme.createdAt,
    updatedAt: theme.updatedAt
  }
})

function resolveTheme(db: ReturnType<typeof useDB>, id: string): Record<string, string> {
  const row = db.select().from(themes).where(eq(themes.id, id)).get()
  if (!row) return {}
  const own = JSON.parse(row.tokens || '{}')
  if (row.parentThemeId) {
    const parent = resolveTheme(db, row.parentThemeId)
    return { ...parent, ...own }
  }
  return own
}
