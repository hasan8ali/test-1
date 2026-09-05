import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { themes } from '../../db/schema'

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  tokens: z.object({}).passthrough().optional(),
  thumbnail: z.string().nullable().optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const body = await readBody(event)
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid theme', data: parsed.error.flatten() })
  }

  const db = useDB()
  const existing = db.select().from(themes).where(eq(themes.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Theme not found' })

  // Built-in themes cannot be mutated (only forked — via POST /themes with parentThemeId)
  if (existing.isBuiltIn) {
    throw createError({ statusCode: 403, statusMessage: 'Cannot modify built-in theme. Fork it instead.' })
  }

  const updates: Record<string, any> = { updatedAt: Math.floor(Date.now() / 1000) }
  if (parsed.data.name !== undefined) updates.name = parsed.data.name
  if (parsed.data.description !== undefined) updates.description = parsed.data.description
  if (parsed.data.tokens !== undefined) updates.tokens = JSON.stringify(parsed.data.tokens)
  if (parsed.data.thumbnail !== undefined) updates.thumbnail = parsed.data.thumbnail

  db.update(themes).set(updates).where(eq(themes.id, id)).run()

  const updated = db.select().from(themes).where(eq(themes.id, id)).get()
  return {
    id: updated!.id,
    name: updated!.name,
    description: updated!.description,
    thumbnail: updated!.thumbnail,
    tokens: JSON.parse(updated!.tokens),
    parentThemeId: updated!.parentThemeId,
    isBuiltIn: updated!.isBuiltIn,
    createdAt: updated!.createdAt,
    updatedAt: updated!.updatedAt
  }
})
