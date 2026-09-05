import { getStorage } from '../../../utils/storage'

/**
 * Serve raw asset by storage key.
 * Public endpoint — assets are served on published pages.
 */
export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, 'key')
  if (!key) throw createError({ statusCode: 400, statusMessage: 'Missing key' })

  // Prevent path traversal
  if (key.includes('..') || key.startsWith('/')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid key' })
  }

  const storage = getStorage()
  let buf: Buffer
  try {
    buf = await storage.read(key)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Asset not found' })
  }

  const { detectMime } = await import('../../../utils/security')
  const mime = detectMime(buf) || 'application/octet-stream'

  setResponseHeader(event, 'Content-Type', mime)
  setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  return buf
})
