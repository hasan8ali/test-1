import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { users } from '../../db/schema'
import { verifyPassword, signToken } from '../../utils/security'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }

  const db = useDB()
  const user = db.select().from(users).where(eq(users.email, parsed.data.email)).get()
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const token = await signToken({
    userId: user.id,
    tenantId: user.tenantId,
    email: user.email
  })

  setCookie(event, 'tolnera_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/'
  })

  return {
    token,
    user: { id: user.id, tenantId: user.tenantId, email: user.email, name: user.name }
  }
})
