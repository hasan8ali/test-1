/**
 * Security utilities — HTML sanitization, ID generation, magic-byte validation.
 */

import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

/**
 * Sanitize user-provided HTML to prevent XSS.
 * Allows a safe subset of tags/attributes for rich-text blocks.
 */
export function sanitizeHTML(dirty: string): string {
  const window = new JSDOM('').window
  const purify = DOMPurify(window)
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'mark', 'small', 'sub', 'sup',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img', 'blockquote', 'code', 'pre',
      'span', 'div', 'hr',
      'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'style', 'id',
      'target', 'rel', 'width', 'height', 'colspan', 'rowspan',
      'data-*'
    ],
    ALLOW_DATA_ATTR: true,
    ALLOW_ARIA_ATTR: true
  })
}

/**
 * Generate a stable unique ID (uuid v4 if crypto is available, fallback otherwise).
 */
export function generateId(): string {
  return globalThis.crypto?.randomUUID?.() ?? 
    'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
}

/**
 * Slugify a string for URLs (Arabic-aware).
 */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\u0600-\u06FFa-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || `page-${Date.now()}`
}

/**
 * Magic-byte validation for uploaded files.
 * Prevents disguised file uploads (e.g., .exe renamed to .png).
 */
const FILE_SIGNATURES: Record<string, { offset: number; bytes: number[] }> = {
  'image/jpeg': { offset: 0, bytes: [0xff, 0xd8, 0xff] },
  'image/png': { offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47] },
  'image/gif': { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] },
  'image/webp': { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF
  'image/svg+xml': { offset: 0, bytes: [0x3c, 0x73, 0x76, 0x67] }, // <svg
  'image/x-icon': { offset: 0, bytes: [0x00, 0x00, 0x01, 0x00] },
  'application/pdf': { offset: 0, bytes: [0x25, 0x50, 0x44, 0x46] } // %PDF
}

export function detectFileType(buffer: Buffer): string | null {
  for (const [mime, sig] of Object.entries(FILE_SIGNATURES)) {
    const slice = buffer.subarray(sig.offset, sig.offset + sig.bytes.length)
    if (slice.length === sig.bytes.length && sig.bytes.every((b, i) => slice[i] === b)) {
      return mime
    }
  }
  // SVG might have leading whitespace
  const head = buffer.subarray(0, 200).toString('utf-8').trim().toLowerCase()
  if (head.startsWith('<svg') || head.startsWith('<?xml')) {
    return 'image/svg+xml'
  }
  return null
}

/**
 * Validate that an uploaded file matches its declared type.
 */
export function validateFileType(buffer: Buffer, declaredType: string): boolean {
  const detected = detectFileType(buffer)
  if (!detected) return false
  return detected === declaredType
}

/**
 * Maximum upload size: 5 MB
 */
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024

/**
 * Wrap a stable ID for use across server requests.
 */
export function ensureId(id?: string): string {
  return id && /^[a-zA-Z0-9_-]{8,128}$/.test(id) ? id : generateId()
}
