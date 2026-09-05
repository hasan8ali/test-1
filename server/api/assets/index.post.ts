import { z } from 'zod'
import { assets } from '../../db/schema'
import { generateId, validateFileType, MAX_UPLOAD_SIZE, detectFileType } from '../../utils/security'

/**
 * Upload an asset (image/file).
 * Accepts multipart/form-data with field 'file'.
 * Validates file size and magic bytes (not just the declared MIME).
 */
export default defineEventHandler(async (event) => {
  const form = await readFormData(event)
  const file = form.get('file')
  if (!(file instanceof File)) {
    throw createError({ statusCode: 400, statusMessage: 'No file provided' })
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw createError({
      statusCode: 413,
      statusMessage: `File too large. Max ${MAX_UPLOAD_SIZE / 1024 / 1024}MB`
    })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // Validate type via magic bytes (don't trust the declared MIME)
  const detectedType = detectFileType(buffer)
  if (!detectedType) {
    throw createError({
      statusCode: 415,
      statusMessage: 'Unsupported file type'
    })
  }

  // Only allow image types in v1 (block images, hero backgrounds)
  if (!detectedType.startsWith('image/')) {
    throw createError({
      statusCode: 415,
      statusMessage: 'Only image files are allowed in v1'
    })
  }

  if (!validateFileType(buffer, detectedType)) {
    throw createError({ statusCode: 415, statusMessage: 'File type mismatch' })
  }

  const db = useDB()
  const id = generateId()
  const now = Math.floor(Date.now() / 1000)

  db.insert(assets).values({
    id,
    name: file.name,
    type: detectedType,
    size: file.size,
    data: buffer,
    createdAt: now
  }).run()

  return {
    id,
    name: file.name,
    type: detectedType,
    size: file.size,
    url: `/api/assets/${id}/raw`,
    createdAt: now
  }
})
