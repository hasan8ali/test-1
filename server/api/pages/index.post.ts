import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { pages } from '../../db/schema'
import { generateId, slugify } from '../../utils/security'

const createSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().max(100).optional(),
  themeId: z.string().min(1),
  blocks: z.array(z.any()).optional().default([]),
  status: z.enum(['draft', 'published']).default('draft'),
  meta: z.object({
    description: z.string().max(300).optional(),
    ogImage: z.string().optional(),
    keywords: z.array(z.string()).optional()
  }).optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid page data',
      data: parsed.error.flatten()
    })
  }

  const db = useDB()
  const id = generateId()
  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.title)

  // Ensure slug uniqueness
  const existing = db.select().from(pages).where(eq(pages.slug, slug)).get()
  const finalSlug = existing ? `${slug}-${id.slice(0, 6)}` : slug

  const now = Math.floor(Date.now() / 1000)
  const newPage = {
    id,
    slug: finalSlug,
    title: parsed.data.title,
    status: parsed.data.status,
    themeId: parsed.data.themeId,
    blocks: JSON.stringify(parsed.data.blocks || []),
    meta: parsed.data.meta ? JSON.stringify(parsed.data.meta) : null,
    createdAt: now,
    updatedAt: now
  }

  db.insert(pages).values(newPage).run()

  return {
    id,
    slug: finalSlug,
    title: newPage.title,
    status: newPage.status,
    themeId: newPage.themeId,
    blocks: parsed.data.blocks || [],
    meta: parsed.data.meta,
    createdAt: now,
    updatedAt: now
  }
})
