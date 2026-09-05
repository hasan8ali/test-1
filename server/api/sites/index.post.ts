import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { sites, pages, templates, themes } from '../../db/schema'
import { requireAuth, getTenantId } from '../../lib/auth'
import { genId, slugify } from '../../utils/security'

const schema = z.object({
  name: z.string().min(1).max(200),
  templateId: z.string().nullable().optional(),
  themeId: z.string().optional()
})

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const tenantId = getTenantId(event)
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error.flatten() })
  }

  const db = useDB()
  const now = Math.floor(Date.now() / 1000)
  const siteId = genId()
  const slug = slugify(parsed.data.name)

  // Resolve theme: explicit > template default > first built-in
  let themeId = parsed.data.themeId
  if (!themeId && parsed.data.templateId) {
    const tpl = db.select().from(templates).where(eq(templates.id, parsed.data.templateId)).get()
    themeId = tpl?.defaultThemeId || undefined
  }
  if (!themeId) {
    const builtinTheme = db.select().from(themes).where(eq(themes.isBuiltIn, 1)).get()
    themeId = builtinTheme?.id || 'theme-mono-dark'
  }

  // Create site
  db.insert(sites).values({
    id: siteId,
    tenantId,
    templateId: parsed.data.templateId || null,
    name: parsed.data.name,
    slug,
    themeId,
    status: 'draft',
    createdAt: now,
    updatedAt: now
  }).run()

  // If template specified, clone its pages
  if (parsed.data.templateId) {
    const tpl = db.select().from(templates).where(eq(templates.id, parsed.data.templateId)).get()
    if (tpl) {
      const tplPages = JSON.parse(tpl.pages) as any[]
      for (const tp of tplPages) {
        db.insert(pages).values({
          id: genId(),
          siteId,
          tenantId,
          slug: tp.slug || '',
          title: tp.title,
          blocks: JSON.stringify(tp.blocks || []),
          meta: null,
          isHome: tp.isHome ? 1 : 0,
          createdAt: now,
          updatedAt: now
        }).run()
      }
    }
  } else {
    // Create a single empty home page
    db.insert(pages).values({
      id: genId(),
      siteId,
      tenantId,
      slug: '',
      title: 'الرئيسية',
      blocks: '[]',
      meta: null,
      isHome: 1,
      createdAt: now,
      updatedAt: now
    }).run()
  }

  return { id: siteId, slug, name: parsed.data.name, themeId, status: 'draft' }
})
