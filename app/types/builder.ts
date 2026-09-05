/**
 * Core type definitions for the Tolnera Page & Theme Builder.
 * These types are the contract between the canvas, the renderer, the
 * inspector, the API, and the database. Keep them centralized.
 */

/* ---------- Block tree ---------- */

export type BlockType =
  // Layout
  | 'container'
  | 'grid'
  | 'columns'
  | 'divider'
  | 'spacer'
  // Content
  | 'heading'
  | 'text'
  | 'richtext'
  | 'image'
  | 'video'
  | 'button'
  | 'icon'
  // Composed
  | 'hero'
  | 'feature-grid'
  | 'pricing-card'
  | 'testimonial'
  | 'faq'
  | 'cta'
  | 'stats'
  // Tolnera-specific (forward-compat with main platform)
  | 'course-grid'
  | 'course-card'
  | 'instructor-card'
  | 'signup-form'
  // Advanced (sandboxed)
  | 'custom-html'
  | 'code-block'

export interface BlockVisibility {
  mobile: boolean
  tablet: boolean
  desktop: boolean
}

export interface BlockAdvanced {
  /** Custom CSS class appended to the block root */
  customClass?: string
  /** Inline CSS style (sanitized on render) */
  customStyle?: string
  /** Custom HTML id */
  customId?: string
}

export interface Block<T = Record<string, any>> {
  /** Stable unique id (uuid v4) */
  id: string
  /** Block type — dispatches to the matching renderer + inspector */
  type: BlockType
  /** Block-specific configuration */
  props: T
  /** Children for container-type blocks */
  children?: Block[]
  /** Responsive visibility rules */
  visibility: BlockVisibility
  /** Advanced overrides for power users */
  advanced?: BlockAdvanced
}

/* ---------- Page ---------- */

export type PageStatus = 'draft' | 'published'

export interface Page {
  id: string
  slug: string
  title: string
  status: PageStatus
  themeId: string
  /** Serialized Block[] (the page body) */
  blocks: Block[]
  /** SEO + social */
  meta?: {
    description?: string
    ogImage?: string
    keywords?: string[]
  }
  createdAt: number
  updatedAt: number
}

/* ---------- Theme ---------- */

export interface ThemeTokens {
  /* Brand colors */
  'color.primary'?: string
  'color.primaryForeground'?: string
  'color.secondary'?: string
  'color.secondaryForeground'?: string
  'color.accent'?: string
  'color.accentForeground'?: string

  /* Surface */
  'color.bg'?: string
  'color.surface'?: string
  'color.surfaceElevated'?: string
  'color.border'?: string

  /* Text */
  'color.text'?: string
  'color.textMuted'?: string
  'color.textSubtle'?: string

  /* Typography */
  'font.heading'?: string
  'font.body'?: string
  'font.mono'?: string

  /* Radius */
  'radius.sm'?: string
  'radius.md'?: string
  'radius.lg'?: string
  'radius.xl'?: string

  /* Shadows */
  'shadow.sm'?: string
  'shadow.md'?: string
  'shadow.lg'?: string
}

export interface Theme {
  id: string
  name: string
  description: string
  /** Thumbnail image (data URL or path) */
  thumbnail?: string
  /** Token overrides (inherits from parent + built-in defaults) */
  tokens: ThemeTokens
  /** Parent theme for inheritance */
  parentThemeId?: string | null
  isBuiltIn: boolean
  createdAt: number
  updatedAt: number
}

/* ---------- Snapshots (time travel) ---------- */

export interface Snapshot {
  id: string
  pageId: string
  /** Serialized Block[] at the moment of capture */
  blocks: Block[]
  /** Optional named checkpoint */
  label?: string
  /** Diff summary vs previous snapshot, for the timeline UI */
  summary?: string
  createdAt: number
}

/* ---------- Assets ---------- */

export interface Asset {
  id: string
  name: string
  type: string // MIME
  size: number
  /** Blob data (stored in SQLite) */
  data: ArrayBuffer
  url: string // computed: /api/assets/[id]/raw
  createdAt: number
}

/* ---------- Block registry metadata ---------- */

export type BlockCategory = 'layout' | 'content' | 'composed' | 'tolnera' | 'advanced'

export interface BlockDefinition {
  type: BlockType
  label: string
  description: string
  category: BlockCategory
  /** Lucide icon name */
  icon: string
  /** Whether this block can have children */
  acceptsChildren: boolean
  /** Default props when a new instance is created */
  defaultProps: () => Record<string, any>
  /** Zod schema for validating props */
  schema: any
}
