import { z } from 'zod'
import { snapshots } from '../../db/schema'
import { generateId } from '../../utils/security'

const schema = z.object({
  pageId: z.string().min(1),
  blocks: z.array(z.any()),
  label: z.string().max(100).optional(),
  summary: z.string().max(300).optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid snapshot', data: parsed.error.flatten() })
  }

  const db = useDB()
  const id = generateId()
  const now = Math.floor(Date.now() / 1000)

  db.insert(snapshots).values({
    id,
    pageId: parsed.data.pageId,
    blocks: JSON.stringify(parsed.data.blocks),
    label: parsed.data.label,
    summary: parsed.data.summary,
    createdAt: now
  }).run()

  return {
    id,
    pageId: parsed.data.pageId,
    blocks: parsed.data.blocks,
    label: parsed.data.label,
    summary: parsed.data.summary,
    createdAt: now
  }
})
