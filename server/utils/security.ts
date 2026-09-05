import { randomUUID } from 'node:crypto'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

/* ===== JWT ===== */
const secret = new TextEncoder().encode(
  process.env.TOLNERA_JWT_SECRET || (useRuntimeConfig ? useRuntimeConfig().jwtSecret : 'dev-secret')
)

export async function signToken(payload: { userId: string; tenantId: string; email: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<{ userId: string; tenantId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as any
  } catch {
    return null
  }
}

/* ===== Password hashing ===== */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

/* ===== IDs ===== */
export function genId(): string {
  return randomUUID()
}

export function slugify(s: string): string {
  return s.trim().toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\u0600-\u06FFa-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || `id-${Date.now()}`
}

/* ===== HTML sanitization (server-side) ===== */
let purify: any = null
function getPurify() {
  if (!purify) {
    const dom = new JSDOM('')
    purify = DOMPurify(dom.window as any)
  }
  return purify
}

export function sanitizeHTML(dirty: string): string {
  return getPurify().sanitize(dirty, {
    ALLOWED_TAGS: ['p','br','strong','em','u','s','mark','small','sub','sup','h1','h2','h3','h4','h5','h6','ul','ol','li','a','img','blockquote','code','pre','span','div','hr','table','thead','tbody','tr','th','td'],
    ALLOWED_ATTR: ['href','src','alt','title','class','style','id','target','rel','width','height','colspan','rowspan'],
    ALLOW_DATA_ATTR: true
  })
}

/* ===== Magic-byte validation for uploads ===== */
const SIGS: Record<string, number[]> = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/gif': [0x47, 0x49, 0x46, 0x38],
  'image/webp': [0x52, 0x49, 0x46, 0x46]
}

export function detectMime(buf: Buffer): string | null {
  for (const [mime, sig] of Object.entries(SIGS)) {
    if (buf.subarray(0, sig.length).equals(Buffer.from(sig))) return mime
  }
  const head = buf.subarray(0, 200).toString('utf-8').trim().toLowerCase()
  if (head.startsWith('<svg') || head.startsWith('<?xml')) return 'image/svg+xml'
  return null
}

export const MAX_UPLOAD = 5 * 1024 * 1024
