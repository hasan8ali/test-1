import { eq } from 'drizzle-orm'
import { pages, snapshots } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const db = useDB()
  const page = db.select().from(pages).where(eq(pages.id, id)).get()
  if (!page) throw createError({ statusCode: 404, statusMessage: 'Page not found' })

  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    status: page.status,
    themeId: page.themeId,
    blocks: JSON.parse(page.blocks || '[]'),
    meta: page.meta ? JSON.parse(page.meta) : undefined,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt
  }
})
