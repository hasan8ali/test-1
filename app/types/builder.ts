/* ===== Core types for the builder ===== */

export type BlockType =
  // Layout
  | 'container' | 'columns' | 'spacer' | 'divider'
  // Content
  | 'heading' | 'text' | 'image' | 'video' | 'button' | 'icon'
  // Composed
  | 'hero' | 'feature-grid' | 'pricing-table' | 'testimonial-grid'
  | 'faq' | 'stats' | 'enrollment-cta' | 'page-header'
  // Education-specific
  | 'course-grid' | 'course-card' | 'curriculum-list'
  | 'instructor-bio' | 'instructor-grid'
  // Advanced
  | 'custom-code'

export interface BlockResponsive {
  tablet?: Record<string, any>
  mobile?: Record<string, any>
}

export interface BlockVisibility {
  mobile: boolean
  tablet: boolean
  desktop: boolean
}

export interface Block {
  id: string
  type: BlockType
  props: Record<string, any>
  responsive?: BlockResponsive
  visibility: BlockVisibility
  children?: Block[]
  advanced?: { customClass?: string; customId?: string }
}

export interface ThemeTokens {
  'color.bg'?: string
  'color.surface'?: string
  'color.text'?: string
  'color.textMuted'?: string
  'color.accent'?: string
  'color.accentFg'?: string
  'color.border'?: string
  'font.heading'?: string
  'font.body'?: string
  'radius'?: string
  [key: string]: string | undefined
}

export interface Theme {
  id: string
  tenantId: string | null
  name: string
  description: string
  tokens: ThemeTokens
  parentThemeId: string | null
  version: number
  isBuiltIn: boolean
  createdAt: number
  updatedAt: number
}

export interface TemplatePage {
  slug: string
  title: string
  isHome: boolean
  blocks: Block[]
}

export interface Template {
  id: string
  tenantId: string | null
  name: string
  description: string
  category: 'solo-course' | 'academy' | 'mentor' | string
  pages: TemplatePage[]
  defaultThemeId: string | null
  thumbnail: string | null
  version: number
  isBuiltIn: boolean
}

export interface Site {
  id: string
  tenantId: string
  templateId: string | null
  name: string
  slug: string
  themeId: string
  status: 'draft' | 'published'
  createdAt: number
  updatedAt: number
}

export interface Page {
  id: string
  siteId: string
  tenantId: string
  slug: string
  title: string
  blocks: Block[]
  meta: { description?: string; ogImage?: string } | null
  isHome: boolean
  createdAt: number
  updatedAt: number
}

export interface Asset {
  id: string
  tenantId: string
  name: string
  type: string
  size: number
  storageKey: string
  url: string
  createdAt: number
}

export interface AuthUser {
  id: string
  tenantId: string
  email: string
  name: string
}

/* ===== Block registry metadata ===== */

export type BlockCategory = 'layout' | 'content' | 'composed' | 'education' | 'advanced'

export interface BlockDefinition {
  type: BlockType
  label: string
  description: string
  category: BlockCategory
  icon: string
  acceptsChildren: boolean
  defaultProps: () => Record<string, any>
}
