import { eq, and } from 'drizzle-orm'
import { sites, pages, themes } from '../../db/schema'

/**
 * Public endpoint — fetch a published site + its home page.
 * No auth required.
 */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing slug' })

  const db = useDB()
  const site = db.select().from(sites)
    .where(and(eq(sites.slug, slug), eq(sites.status, 'published')))
    .get()
  if (!site) throw createError({ statusCode: 404, statusMessage: 'Site not found' })

  const theme = db.select().from(themes).where(eq(themes.id, site.themeId)).get()
  const pageRows = db.select().from(pages).where(eq(pages.siteId, site.id)).all()

  return {
    site: {
      id: site.id,
      name: site.name,
      slug: site.slug,
      themeId: site.themeId
    },
    theme: theme ? {
      ...theme,
      tokens: JSON.parse(theme.tokens || '{}'),
      isBuiltIn: !!theme.isBuiltIn
    } : null,
    pages: pageRows.map(p => ({
      ...p,
      blocks: JSON.parse(p.blocks || '[]'),
      meta: p.meta ? JSON.parse(p.meta) : null,
      isHome: !!p.isHome
    }))
  }
})
