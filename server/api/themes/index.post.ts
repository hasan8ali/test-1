import { z } from 'zod'
import { themes } from '../../db/schema'
import { requireAuth, getTenantId } from '../../lib/auth'
import { genId } from '../../utils/security'

const schema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).default(''),
  tokens: z.record(z.string(), z.string()).default({}),
  parentThemeId: z.string().nullable().optional()
})

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const tenantId = getTenantId(event)
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }

  const db = useDB()
  const now = Math.floor(Date.now() / 1000)
  const id = genId()

  db.insert(themes).values({
    id,
    tenantId,
    name: parsed.data.name,
    description: parsed.data.description,
    tokens: JSON.stringify(parsed.data.tokens),
    parentThemeId: parsed.data.parentThemeId || null,
    version: 1,
    isBuiltIn: false,
    createdAt: now,
    updatedAt: now
  }).run()

  return { id, ...parsed.data, isBuiltIn: false, version: 1, createdAt: now, updatedAt: now }
})
