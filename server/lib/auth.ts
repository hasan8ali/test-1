import type { H3Event } from 'h3'
import { verifyToken } from '../utils/security'
import type { AuthUser } from '~/types/builder'

/**
 * Auth middleware — verifies JWT and attaches user to event.context.
 * Skips auth for /api/auth/login and /api/auth/register.
 */
export async function requireAuth(event: H3Event): Promise<AuthUser> {
  const url = getRequestURL(event)
  const path = url.pathname

  // Public routes
  if (path === '/api/auth/login' || path === '/api/auth/register') {
    throw new Error('Public route — should not require auth')
  }

  // Public page rendering + raw assets
  if (path.startsWith('/api/public/') || path.startsWith('/api/assets/raw/')) {
    throw new Error('Public route')
  }

  const auth = getHeader(event, 'authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : getCookie(event, 'tolnera_token')

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized — no token' })
  }

  const payload = await verifyToken(token)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized — invalid token' })
  }

  const user: AuthUser = {
    id: payload.userId,
    tenantId: payload.tenantId,
    email: payload.email,
    name: '' // filled by callers if needed
  }

  event.context.auth = user
  return user
}

/**
 * Get the current tenant_id from auth context.
 * Throws if not authenticated.
 */
export function getTenantId(event: H3Event): string {
  const user = event.context.auth as AuthUser | undefined
  if (!user?.tenantId) {
    throw createError({ statusCode: 401, statusMessage: 'No tenant context' })
  }
  return user.tenantId
}
