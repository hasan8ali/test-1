/**
 * Asset storage abstraction.
 * Currently: local filesystem.
 * Future: swap to Cloudflare R2 by implementing the same interface.
 */

import { mkdirSync, writeFileSync, readFileSync, unlinkSync, existsSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'

const STORAGE_DIR = resolve(process.cwd(), process.env.TOLNERA_STORAGE_DIR || './data/assets')

export interface AssetStorage {
  save(key: string, data: Buffer, contentType: string): Promise<string>
  read(key: string): Promise<Buffer>
  delete(key: string): Promise<void>
  url(key: string): string
}

class LocalStorage implements AssetStorage {
  async save(key: string, data: Buffer): Promise<string> {
    const fullPath = join(STORAGE_DIR, key)
    mkdirSync(dirname(fullPath), { recursive: true })
    writeFileSync(fullPath, data)
    return this.url(key)
  }
  async read(key: string): Promise<Buffer> {
    const fullPath = join(STORAGE_DIR, key)
    if (!existsSync(fullPath)) throw new Error('Asset not found')
    return readFileSync(fullPath)
  }
  async delete(key: string): Promise<void> {
    const fullPath = join(STORAGE_DIR, key)
    if (existsSync(fullPath)) unlinkSync(fullPath)
  }
  url(key: string): string {
    return `/api/assets/raw/${key}`
  }
}

let _storage: AssetStorage | null = null
export function getStorage(): AssetStorage {
  if (!_storage) _storage = new LocalStorage()
  return _storage
}
