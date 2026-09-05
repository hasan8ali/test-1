import { defineStore } from 'pinia'
import type { Block, BlockType, Site, Page, Theme } from '~/types/builder'

/* ===== History entry for undo/redo ===== */
interface HistoryEntry {
  blocks: Block[]
  selectedId: string | null
  label: string
  timestamp: number
}

interface BuilderState {
  site: Site | null
  pages: Page[]
  currentPage: Page | null
  theme: Theme | null
  selectedBlockId: string | null
  /* History stack — real undo/redo, not DB backups */
  history: HistoryEntry[]
  historyIndex: number
  /* UI */
  device: 'mobile' | 'tablet' | 'desktop'
  advancedMode: boolean
  leftPanel: 'blocks' | 'layers'
  rightPanelOpen: boolean
  leftPanelOpen: boolean
  /* Loading */
  loading: boolean
  saving: boolean
  dirty: boolean
}

const MAX_HISTORY = 100

function cloneBlocks(blocks: Block[]): Block[] {
  return JSON.parse(JSON.stringify(blocks))
}

export const useBuilderStore = defineStore('builder', {
  state: (): BuilderState => ({
    site: null,
    pages: [],
    currentPage: null,
    theme: null,
    selectedBlockId: null,
    history: [],
    historyIndex: -1,
    device: 'desktop',
    advancedMode: false,
    leftPanel: 'blocks',
    rightPanelOpen: true,
    leftPanelOpen: true,
    loading: false,
    saving: false,
    dirty: false
  }),

  getters: {
    canUndo: (s) => s.historyIndex > 0,
    canRedo: (s) => s.historyIndex < s.history.length - 1,
    selectedBlock(s): Block | null {
      if (!s.selectedBlockId || !s.currentPage) return null
      return findBlock(s.currentPage.blocks, s.selectedBlockId)
    },
    flatBlocks(s): Array<{ block: Block; depth: number }> {
      const result: Array<{ block: Block; depth: number }> = []
      const walk = (blocks: Block[], depth: number) => {
        for (const b of blocks) {
          result.push({ block: b, depth })
          if (b.children) walk(b.children, depth + 1)
        }
      }
      if (s.currentPage) walk(s.currentPage.blocks, 0)
      return result
    }
  },

  actions: {
    /* ===== Load ===== */
    setSite(site: Site, pages: Page[], theme: Theme | null) {
      this.site = site
      this.pages = pages
      this.theme = theme
      this.currentPage = pages.find(p => p.isHome) || pages[0] || null
      this.history = []
      this.historyIndex = -1
      this.selectedBlockId = null
      this.dirty = false
      this.pushHistory('Initial load')
    },

    setCurrentPage(pageId: string) {
      const page = this.pages.find(p => p.id === pageId)
      if (page) {
        this.currentPage = page
        this.selectedBlockId = null
        this.history = []
        this.historyIndex = -1
        this.pushHistory('Switch page')
      }
    },

    /* ===== History (real undo/redo) ===== */
    pushHistory(label: string) {
      if (!this.currentPage) return
      // Truncate any redo entries
      this.history = this.history.slice(0, this.historyIndex + 1)
      // Push current state
      this.history.push({
        blocks: cloneBlocks(this.currentPage.blocks),
        selectedId: this.selectedBlockId,
        label,
        timestamp: Date.now()
      })
      // Cap history
      if (this.history.length > MAX_HISTORY) {
        this.history.shift()
      } else {
        this.historyIndex++
      }
      this.dirty = true
    },

    undo() {
      if (!this.canUndo || !this.currentPage) return
      this.historyIndex--
      const entry = this.history[this.historyIndex]
      this.currentPage.blocks = cloneBlocks(entry.blocks)
      this.selectedBlockId = entry.selectedId
      this.dirty = true
    },

    redo() {
      if (!this.canRedo || !this.currentPage) return
      this.historyIndex++
      const entry = this.history[this.historyIndex]
      this.currentPage.blocks = cloneBlocks(entry.blocks)
      this.selectedBlockId = entry.selectedId
      this.dirty = true
    },

    /* ===== Block operations ===== */
    addBlock(type: BlockType, parentId: string | null = null) {
      if (!this.currentPage) return
      const block = createBlock(type)
      if (!parentId) {
        this.currentPage.blocks.push(block)
      } else {
        const parent = findBlock(this.currentPage.blocks, parentId)
        if (parent) {
          if (!parent.children) parent.children = []
          parent.children.push(block)
        }
      }
      this.selectedBlockId = block.id
      this.pushHistory(`Add ${type}`)
    },

    removeBlock(id: string) {
      if (!this.currentPage) return
      const removed = removeFromTree(this.currentPage.blocks, id)
      if (removed) {
        if (this.selectedBlockId === id) this.selectedBlockId = null
        this.pushHistory('Remove block')
      }
    },

    updateBlockProps(id: string, props: Record<string, any>) {
      if (!this.currentPage) return
      const block = findBlock(this.currentPage.blocks, id)
      if (!block) return
      Object.assign(block.props, props)
      this.pushHistory('Edit props')
    },

    moveBlock(id: string, toParentId: string | null, toIndex: number) {
      if (!this.currentPage) return
      const block = findBlock(this.currentPage.blocks, id)
      if (!block) return
      // Prevent dropping into own descendant
      if (toParentId && isDescendant(this.currentPage.blocks, toParentId, id)) return
      removeFromTree(this.currentPage.blocks, id)
      if (!toParentId) {
        this.currentPage.blocks.splice(toIndex, 0, block)
      } else {
        const parent = findBlock(this.currentPage.blocks, toParentId)
        if (parent) {
          if (!parent.children) parent.children = []
          parent.children.splice(toIndex, 0, block)
        }
      }
      this.pushHistory('Move block')
    },

    duplicateBlock(id: string) {
      if (!this.currentPage) return
      const block = findBlock(this.currentPage.blocks, id)
      if (!block) return
      const clone = JSON.parse(JSON.stringify(block))
      reassignIds(clone)
      // Insert after original
      const parent = findParent(this.currentPage.blocks, id)
      if (parent && parent.children) {
        const idx = parent.children.findIndex(b => b.id === id)
        parent.children.splice(idx + 1, 0, clone)
      } else {
        const idx = this.currentPage.blocks.findIndex(b => b.id === id)
        this.currentPage.blocks.splice(idx + 1, 0, clone)
      }
      this.selectedBlockId = clone.id
      this.pushHistory('Duplicate block')
    },

    setVisibility(id: string, vis: Partial<Block['visibility']>) {
      if (!this.currentPage) return
      const block = findBlock(this.currentPage.blocks, id)
      if (!block) return
      Object.assign(block.visibility, vis)
      this.pushHistory('Toggle visibility')
    },

    setAdvanced(id: string, adv: Partial<Block['advanced']>) {
      if (!this.currentPage) return
      const block = findBlock(this.currentPage.blocks, id)
      if (!block) return
      block.advanced = { ...block.advanced, ...adv }
      this.pushHistory('Edit advanced')
    },

    /* ===== Selection ===== */
    selectBlock(id: string | null) {
      this.selectedBlockId = id
    },

    /* ===== UI ===== */
    setDevice(d: 'mobile' | 'tablet' | 'desktop') {
      this.device = d
    },
    toggleAdvanced() {
      this.advancedMode = !this.advancedMode
    },
    toggleLeftPanel() {
      this.leftPanelOpen = !this.leftPanelOpen
    },
    toggleRightPanel() {
      this.rightPanelOpen = !this.rightPanelOpen
    },
    setLeftPanel(p: 'blocks' | 'layers') {
      this.leftPanel = p
    },

    /* ===== Save ===== */
    markSaved() {
      this.dirty = false
    }
  }
})

/* ===== Helpers ===== */
function findBlock(blocks: Block[], id: string): Block | null {
  for (const b of blocks) {
    if (b.id === id) return b
    if (b.children) {
      const f = findBlock(b.children, id)
      if (f) return f
    }
  }
  return null
}

function findParent(blocks: Block[], id: string): Block | null {
  for (const b of blocks) {
    if (b.children?.some(c => c.id === id)) return b
    if (b.children) {
      const f = findParent(b.children, id)
      if (f) return f
    }
  }
  return null
}

function removeFromTree(blocks: Block[], id: string): boolean {
  const idx = blocks.findIndex(b => b.id === id)
  if (idx >= 0) {
    blocks.splice(idx, 1)
    return true
  }
  for (const b of blocks) {
    if (b.children && removeFromTree(b.children, id)) return true
  }
  return false
}

function isDescendant(blocks: Block[], descendantId: string, ancestorId: string): boolean {
  const ancestor = findBlock(blocks, ancestorId)
  if (!ancestor?.children) return false
  const check = (bs: Block[]): boolean => {
    for (const b of bs) {
      if (b.id === descendantId) return true
      if (b.children && check(b.children)) return true
    }
    return false
  }
  return check(ancestor.children)
}

function reassignIds(block: Block) {
  block.id = crypto.randomUUID()
  if (block.children) block.children.forEach(reassignIds)
}

/* ===== Block factory ===== */
import { blockDefinitions } from '~/utils/blocks'

function createBlock(type: BlockType): Block {
  const def = blockDefinitions[type]
  return {
    id: crypto.randomUUID(),
    type,
    props: def.defaultProps(),
    visibility: { mobile: true, tablet: true, desktop: true },
    children: def.acceptsChildren ? [] : undefined
  }
}
