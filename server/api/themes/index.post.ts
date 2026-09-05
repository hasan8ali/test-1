import { z } from 'zod'
import { themes } from '../../db/schema'
import { generateId } from '../../utils/security'

const tokensSchema = z.object({}).passthrough() // accept any token keys

const createThemeSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).default(''),
  tokens: tokensSchema.default({}),
  parentThemeId: z.string().nullable().optional(),
  thumbnail: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = createThemeSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid theme', data: parsed.error.flatten() })
  }

  const db = useDB()
  const id = generateId()
  const now = Math.floor(Date.now() / 1000)

  db.insert(themes).values({
    id,
    name: parsed.data.name,
    description: parsed.data.description,
    tokens: JSON.stringify(parsed.data.tokens),
    parentThemeId: parsed.data.parentThemeId ?? null,
    thumbnail: parsed.data.thumbnail ?? null,
    isBuiltIn: false,
    createdAt: now,
    updatedAt: now
  }).run()

  return {
    id,
    name: parsed.data.name,
    description: parsed.data.description,
    tokens: parsed.data.tokens,
    parentThemeId: parsed.data.parentThemeId ?? null,
    isBuiltIn: false,
    createdAt: now,
    updatedAt: now
  }
})
