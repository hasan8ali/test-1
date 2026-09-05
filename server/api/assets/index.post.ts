import { eq } from 'drizzle-orm'
import { assets } from '../../db/schema'
import { requireAuth, getTenantId } from '../../lib/auth'
import { genId, detectMime, MAX_UPLOAD } from '../../utils/security'
import { getStorage } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const tenantId = getTenantId(event)

  const form = await readFormData(event)
  const file = form.get('file')
  if (!(file instanceof File)) {
    throw createError({ statusCode: 400, statusMessage: 'No file provided' })
  }

  if (file.size > MAX_UPLOAD) {
    throw createError({ statusCode: 413, statusMessage: 'File too large (max 5MB)' })
  }

  const buf = Buffer.from(await file.arrayBuffer())
  const mime = detectMime(buf)
  if (!mime) {
    throw createError({ statusCode: 415, statusMessage: 'Unsupported file type' })
  }

  const id = genId()
  const now = Math.floor(Date.now() / 1000)
  const storageKey = `${tenantId}/${id}-${file.name}`

  const storage = getStorage()
  await storage.save(storageKey, buf, mime)

  const db = useDB()
  db.insert(assets).values({
    id,
    tenantId,
    name: file.name,
    type: mime,
    size: file.size,
    storageKey,
    createdAt: now
  }).run()

  return {
    id,
    name: file.name,
    type: mime,
    size: file.size,
    storageKey,
    url: storage.url(storageKey),
    createdAt: now
  }
})
