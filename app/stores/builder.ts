import { defineStore } from 'pinia'
import type { Block, BlockType, Page, Theme, Snapshot } from '~/types/builder'
import { createBlock, getBlockDefinition } from '~/utils/blocks'

interface BuilderState {
  /** Current page being edited */
  page: Page | null
  /** Resolved theme (with inheritance) */
  theme: Theme | null
  /** All available themes (for picker) */
  themes: Theme[]
  /** Currently selected block id */
  selectedBlockId: string | null
  /** Snapshot history for time-travel */
  snapshots: Snapshot[]
  /** Preview device */
  device: 'mobile' | 'tablet' | 'desktop'
  /** Whether we're in advanced mode */
  advancedMode: boolean
  /** Loading state */
  loading: boolean
  /** Saving state */
  saving: boolean
  /** Last save time */
  lastSavedAt: number | null
  /** Whether there are unsaved changes */
  dirty: boolean
}

export const useBuilderStore = defineStore('builder', {
  state: (): BuilderState => ({
    page: null,
    theme: null,
    themes: [],
    selectedBlockId: null,
    snapshots: [],
    device: 'desktop',
    advancedMode: false,
    loading: false,
    saving: false,
    lastSavedAt: null,
    dirty: false
  }),

  getters: {
    /** Get the block tree as a flat list (with parent ids) */
    flatBlocks(state): Array<{ block: Block; parentId: string | null; depth: number }> {
      const result: Array<{ block: Block; parentId: string | null; depth: number }> = []
      const walk = (blocks: Block[], parentId: string | null, depth: number) => {
        for (const b of blocks) {
          result.push({ block: b, parentId, depth })
          if (b.children?.length) walk(b.children, b.id, depth + 1)
        }
      }
      if (state.page) walk(state.page.blocks, null, 0)
      return result
    },

    /** Currently selected block object */
    selectedBlock(state): Block | null {
      if (!state.selectedBlockId || !state.page) return null
      const find = (blocks: Block[]): Block | null => {
        for (const b of blocks) {
          if (b.id === state.selectedBlockId) return b
          if (b.children) {
            const found = find(b.children)
            if (found) return found
          }
        }
        return null
      }
      return find(state.page.blocks)
    },

    /** Parent of the selected block */
    selectedBlockParent(state): Block | null {
      if (!state.selectedBlockId || !state.page) return null
      const find = (blocks: Block[]): Block | null => {
        for (const b of blocks) {
          if (b.children?.some((c) => c.id === state.selectedBlockId)) return b
          if (b.children) {
            const found = find(b.children)
            if (found) return found
          }
        }
        return null
      }
      return find(state.page.blocks)
    },

    isDirty(state) {
      return state.dirty
    }
  },

  actions: {
    setPage(page: Page) {
      this.page = page
      this.dirty = false
      this.selectedBlockId = null
    },

    setTheme(theme: Theme) {
      this.theme = theme
    },

    setThemes(themes: Theme[]) {
      this.themes = themes
    },

    selectBlock(id: string | null) {
      this.selectedBlockId = id
    },

    setDevice(device: 'mobile' | 'tablet' | 'desktop') {
      this.device = device
    },

    toggleAdvanced() {
      this.advancedMode = !this.advancedMode
    },

    setSnapshots(snaps: Snapshot[]) {
      this.snapshots = snaps
    },

    markDirty() {
      this.dirty = true
    },

    markSaved() {
      this.dirty = false
      this.lastSavedAt = Date.now()
    },

    /** Add a new block at the end of root or inside a parent */
    addBlock(type: BlockType, parentId: string | null = null, index?: number): Block {
      const block = createBlock(type)
      const blocks = this.page!.blocks
      if (!parentId) {
        if (typeof index === 'number') blocks.splice(index, 0, block)
        else blocks.push(block)
      } else {
        const parent = this.findBlock(parentId)
        if (parent && parent.children) {
          if (typeof index === 'number') parent.children.splice(index, 0, block)
          else parent.children.push(block)
        }
      }
      this.markDirty()
      this.selectedBlockId = block.id
      return block
    },

    /** Remove a block from the tree */
    removeBlock(id: string) {
      if (!this.page) return
      const removeFrom = (blocks: Block[]): boolean => {
        const idx = blocks.findIndex((b) => b.id === id)
        if (idx >= 0) {
          blocks.splice(idx, 1)
          return true
        }
        for (const b of blocks) {
          if (b.children && removeFrom(b.children)) return true
        }
        return false
      }
      removeFrom(this.page.blocks)
      if (this.selectedBlockId === id) this.selectedBlockId = null
      this.markDirty()
    },

    /** Update a block's props (merges) */
    updateBlockProps(id: string, props: Record<string, any>) {
      const block = this.findBlock(id)
      if (!block) return
      block.props = { ...block.props, ...props }
      this.markDirty()
    },

    /** Move a block to a new parent + index */
    moveBlock(id: string, newParentId: string | null, newIndex: number) {
      if (!this.page) return
      const block = this.findBlock(id)
      if (!block) return
      // Don't allow dropping a block into its own descendant
      if (newParentId && this.isDescendant(newParentId, id)) return
      // Remove from current location
      this.removeBlockSilent(id)
      // Insert at new location
      if (!newParentId) {
        this.page.blocks.splice(newIndex, 0, block)
      } else {
        const parent = this.findBlock(newParentId)
        if (parent) {
          if (!parent.children) parent.children = []
          parent.children.splice(newIndex, 0, block)
        }
      }
      this.markDirty()
    },

    /** Duplicate a block (with new ids for itself + descendants) */
    duplicateBlock(id: string): Block | null {
      const block = this.findBlock(id)
      if (!block) return null
      const clone = JSON.parse(JSON.stringify(block))
      this.reassignIds(clone)
      // Insert right after the original
      const parent = this.findParent(id)
      if (parent && parent.children) {
        const idx = parent.children.findIndex((b) => b.id === id)
        parent.children.splice(idx + 1, 0, clone)
      } else if (this.page) {
        const idx = this.page.blocks.findIndex((b) => b.id === id)
        this.page.blocks.splice(idx + 1, 0, clone)
      }
      this.markDirty()
      this.selectedBlockId = clone.id
      return clone
    },

    /** Update visibility settings */
    setBlockVisibility(id: string, visibility: Partial<Block['visibility']>) {
      const block = this.findBlock(id)
      if (!block) return
      block.visibility = { ...block.visibility, ...visibility }
      this.markDirty()
    },

    /** Update advanced overrides */
    setBlockAdvanced(id: string, advanced: Partial<Block['advanced']>) {
      const block = this.findBlock(id)
      if (!block) return
      block.advanced = { ...block.advanced, ...advanced }
      this.markDirty()
    },

    /* ---------- Internal helpers ---------- */

    findBlock(id: string): Block | null {
      if (!this.page) return null
      const find = (blocks: Block[]): Block | null => {
        for (const b of blocks) {
          if (b.id === id) return b
          if (b.children) {
            const f = find(b.children)
            if (f) return f
          }
        }
        return null
      }
      return find(this.page.blocks)
    },

    findParent(id: string): Block | null {
      if (!this.page) return null
      const find = (blocks: Block[]): Block | null => {
        for (const b of blocks) {
          if (b.children?.some((c) => c.id === id)) return b
          if (b.children) {
            const f = find(b.children)
            if (f) return f
          }
        }
        return null
      }
      return find(this.page.blocks)
    },

    isDescendant(maybeChildId: string, ancestorId: string): boolean {
      const ancestor = this.findBlock(ancestorId)
      if (!ancestor?.children) return false
      const check = (blocks: Block[]): boolean => {
        for (const b of blocks) {
          if (b.id === maybeChildId) return true
          if (b.children && check(b.children)) return true
        }
        return false
      }
      return check(ancestor.children)
    },

    removeBlockSilent(id: string) {
      if (!this.page) return
      const removeFrom = (blocks: Block[]): boolean => {
        const idx = blocks.findIndex((b) => b.id === id)
        if (idx >= 0) {
          blocks.splice(idx, 1)
          return true
        }
        for (const b of blocks) {
          if (b.children && removeFrom(b.children)) return true
        }
        return false
      }
      removeFrom(this.page.blocks)
    },

    reassignIds(block: Block) {
      block.id = (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2))
      if (block.children) {
        for (const c of block.children) this.reassignIds(c)
      }
    }
  }
})
