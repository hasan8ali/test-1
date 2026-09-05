import { eq } from 'drizzle-orm'
import { themes, pages } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const db = useDB()
  const theme = db.select().from(themes).where(eq(themes.id, id)).get()
  if (!theme) throw createError({ statusCode: 404, statusMessage: 'Theme not found' })

  // Prevent deletion if any page uses this theme
  const inUse = db.select().from(pages).where(eq(pages.themeId, id)).get()
  if (inUse) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Theme is in use by a page. Reassign pages first.'
    })
  }

  // Built-in themes cannot be deleted
  if (theme.isBuiltIn) {
    throw createError({ statusCode: 403, statusMessage: 'Cannot delete built-in theme' })
  }

  db.delete(themes).where(eq(themes.id, id)).run()
  return { success: true, id }
})
