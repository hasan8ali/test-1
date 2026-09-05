import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { users, tenants } from '../../db/schema'
import { hashPassword, signToken, genId, slugify } from '../../utils/security'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  name: z.string().min(2).max(100)
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error.flatten() })
  }

  const db = useDB()

  // Check if email exists
  const existing = db.select().from(users).where(eq(users.email, parsed.data.email)).get()
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  }

  // Create tenant + user
  const tenantId = genId()
  const userId = genId()
  const now = Math.floor(Date.now() / 1000)

  db.insert(tenants).values({
    id: tenantId,
    name: parsed.data.name + '\'s workspace',
    slug: slugify(parsed.data.name) + '-' + tenantId.slice(0, 6),
    createdAt: now
  }).run()

  db.insert(users).values({
    id: userId,
    tenantId,
    email: parsed.data.email,
    passwordHash: await hashPassword(parsed.data.password),
    name: parsed.data.name,
    createdAt: now
  }).run()

  const token = await signToken({ userId, tenantId, email: parsed.data.email })

  setCookie(event, 'tolnera_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/'
  })

  return {
    token,
    user: { id: userId, tenantId, email: parsed.data.email, name: parsed.data.name }
  }
})
