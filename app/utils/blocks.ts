import { z } from 'zod'
import type { BlockDefinition, BlockType } from '~/types/builder'

/**
 * Central registry of all block definitions.
 * Each block declares: type, label, icon, category, acceptsChildren,
 * defaultProps, and a Zod schema for prop validation.
 *
 * The renderer (`blocks/renderers/*`) maps `type` -> component.
 * The inspector (`app/components/builder/inspector/*`) uses the schema to
 * generate the right form fields automatically.
 */

const uuid = () =>
  (globalThis.crypto?.randomUUID?.() ??
    'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    }))

export const newBlockId = uuid

/* ---------- Schemas ---------- */

const alignSchema = z.enum(['right', 'center', 'left', 'justify'])
const spacingSchema = z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl'])

/* ---------- Layout blocks ---------- */

const container: BlockDefinition = {
  type: 'container',
  label: 'حاوية',
  description: 'حاوية بعرض محدد، تقبل أي blocks بداخلها',
  category: 'layout',
  icon: 'i-lucide-square-stack',
  acceptsChildren: true,
  defaultProps: () => ({
    maxWidth: 'lg', // sm | md | lg | xl | full
    paddingX: 'md',
    paddingY: 'md',
    background: 'transparent', // transparent | surface | surface-elevated | primary | secondary
    align: 'right',
    gap: 'md'
  }),
  schema: z.object({
    maxWidth: z.enum(['sm', 'md', 'lg', 'xl', 'full']),
    paddingX: spacingSchema,
    paddingY: spacingSchema,
    background: z.enum(['transparent', 'surface', 'surface-elevated', 'primary', 'secondary']),
    align: alignSchema,
    gap: spacingSchema
  })
}

const grid: BlockDefinition = {
  type: 'grid',
  label: 'شبكة',
  description: 'شبكة responsive بعدد أعمدة متغير',
  category: 'layout',
  icon: 'i-lucide-layout-grid',
  acceptsChildren: true,
  defaultProps: () => ({
    columns: 3,
    columnsMobile: 1,
    columnsTablet: 2,
    gap: 'md',
    minItemWidth: 'auto' // auto | 200px | 280px | 360px
  }),
  schema: z.object({
    columns: z.number().min(1).max(6),
    columnsMobile: z.number().min(1).max(2),
    columnsTablet: z.number().min(1).max(4),
    gap: spacingSchema,
    minItemWidth: z.enum(['auto', '200px', '280px', '360px'])
  })
}

const columns: BlockDefinition = {
  type: 'columns',
  label: 'أعمدة',
  description: 'أعمدة بنسب مخصصة (مثلاً 1/3 + 2/3)',
  category: 'layout',
  icon: 'i-lucide-columns',
  acceptsChildren: true,
  defaultProps: () => ({
    layout: '1-1', // 1-1 | 1-2 | 2-1 | 1-3 | 3-1 | 1-1-1 | custom
    gap: 'md',
    stackOnMobile: true
  }),
  schema: z.object({
    layout: z.enum(['1-1', '1-2', '2-1', '1-3', '3-1', '1-1-1']),
    gap: spacingSchema,
    stackOnMobile: z.boolean()
  })
}

const divider: BlockDefinition = {
  type: 'divider',
  label: 'فاصل',
  description: 'خط فاصل أفقي',
  category: 'layout',
  icon: 'i-lucide-minus',
  acceptsChildren: false,
  defaultProps: () => ({
    style: 'solid', // solid | dashed | dotted | gradient
    color: 'border', // border | primary | secondary
    width: 'sm' // sm | md | lg
  }),
  schema: z.object({
    style: z.enum(['solid', 'dashed', 'dotted', 'gradient']),
    color: z.enum(['border', 'primary', 'secondary']),
    width: z.enum(['sm', 'md', 'lg'])
  })
}

const spacer: BlockDefinition = {
  type: 'spacer',
  label: 'مسافة',
  description: 'مساحة فارغة عمودية',
  category: 'layout',
  icon: 'i-lucide-move-vertical',
  acceptsChildren: false,
  defaultProps: () => ({ size: 'lg' }),
  schema: z.object({ size: z.enum(['sm', 'md', 'lg', 'xl', '2xl', '3xl']) })
}

/* ---------- Content blocks ---------- */

const heading: BlockDefinition = {
  type: 'heading',
  label: 'عنوان',
  description: 'عنوان من 4 مستويات (H1-H4)',
  category: 'content',
  icon: 'i-lucide-heading',
  acceptsChildren: false,
  defaultProps: () => ({
    level: 2,
    text: 'عنوان جديد',
    align: 'right',
    color: 'text' // text | textMuted | primary | secondary | accent
  }),
  schema: z.object({
    level: z.number().min(1).max(4),
    text: z.string().min(1).max(200),
    align: alignSchema,
    color: z.enum(['text', 'textMuted', 'primary', 'secondary', 'accent'])
  })
}

const text: BlockDefinition = {
  type: 'text',
  label: 'نص',
  description: 'فقرة نصية بسيطة',
  category: 'content',
  icon: 'i-lucide-type',
  acceptsChildren: false,
  defaultProps: () => ({
    text: 'اكتب نصك هنا...',
    align: 'right',
    color: 'text',
    size: 'base', // sm | base | lg | xl
    weight: 'normal' // thin | normal | medium | semibold | bold
  }),
  schema: z.object({
    text: z.string().max(5000),
    align: alignSchema,
    color: z.enum(['text', 'textMuted', 'primary', 'secondary', 'accent']),
    size: z.enum(['sm', 'base', 'lg', 'xl']),
    weight: z.enum(['thin', 'normal', 'medium', 'semibold', 'bold'])
  })
}

const richtext: BlockDefinition = {
  type: 'richtext',
  label: 'نص منسّق',
  description: 'نص مع تنسيقات (Bold, Italic, Links...)',
  category: 'content',
  icon: 'i-lucide-pilcrow',
  acceptsChildren: false,
  defaultProps: () => ({
    html: '<p>ابدأ الكتابة هنا...</p>',
    align: 'right',
    size: 'base'
  }),
  schema: z.object({
    html: z.string().max(50000),
    align: alignSchema,
    size: z.enum(['sm', 'base', 'lg', 'xl'])
  })
}

const image: BlockDefinition = {
  type: 'image',
  label: 'صورة',
  description: 'صورة من رابط أو رفع من الجهاز',
  category: 'content',
  icon: 'i-lucide-image',
  acceptsChildren: false,
  defaultProps: () => ({
    src: '',
    alt: '',
    width: 'auto', // auto | 100% | 50% | 320px | 640px | 1024px
    radius: 'lg',
    shadow: 'md',
    align: 'center'
  }),
  schema: z.object({
    src: z.string().url().or(z.string().startsWith('data:')).or(z.literal('')),
    alt: z.string().max(300),
    width: z.enum(['auto', '100%', '50%', '320px', '640px', '1024px']),
    radius: z.enum(['none', 'sm', 'md', 'lg', 'xl', 'full']),
    shadow: z.enum(['none', 'sm', 'md', 'lg', 'xl']),
    align: z.enum(['right', 'center', 'left'])
  })
}

const video: BlockDefinition = {
  type: 'video',
  label: 'فيديو',
  description: 'فيديو من YouTube/Vimeo أو رابط مباشر',
  category: 'content',
  icon: 'i-lucide-video',
  acceptsChildren: false,
  defaultProps: () => ({
    src: '',
    provider: 'youtube', // youtube | vimeo | direct
    aspectRatio: '16/9',
    radius: 'lg'
  }),
  schema: z.object({
    src: z.string().max(2000),
    provider: z.enum(['youtube', 'vimeo', 'direct']),
    aspectRatio: z.enum(['16/9', '4/3', '1/1', '21/9']),
    radius: z.enum(['none', 'sm', 'md', 'lg', 'xl'])
  })
}

const button: BlockDefinition = {
  type: 'button',
  label: 'زر',
  description: 'زر قابل للنقر مع رابط',
  category: 'content',
  icon: 'i-lucide-mouse-pointer-click',
  acceptsChildren: false,
  defaultProps: () => ({
    text: 'اضغط هنا',
    href: '#',
    variant: 'primary', // primary | secondary | outline | ghost | link
    size: 'lg', // sm | md | lg | xl
    align: 'right',
    icon: '',
    target: 'self' // self | blank
  }),
  schema: z.object({
    text: z.string().max(100),
    href: z.string().max(2000),
    variant: z.enum(['primary', 'secondary', 'accent', 'outline', 'ghost', 'link']),
    size: z.enum(['sm', 'md', 'lg', 'xl']),
    align: alignSchema,
    icon: z.string(),
    target: z.enum(['self', 'blank'])
  })
}

const icon: BlockDefinition = {
  type: 'icon',
  label: 'أيقونة',
  description: 'أيقونة من مكتبة Lucide',
  category: 'content',
  icon: 'i-lucide-smile',
  acceptsChildren: false,
  defaultProps: () => ({
    name: 'i-lucide-star',
    size: 'lg', // sm | md | lg | xl | 2xl
    color: 'primary'
  }),
  schema: z.object({
    name: z.string(),
    size: z.enum(['sm', 'md', 'lg', 'xl', '2xl']),
    color: z.enum(['text', 'textMuted', 'primary', 'secondary', 'accent'])
  })
}

/* ---------- Composed blocks ---------- */

const hero: BlockDefinition = {
  type: 'hero',
  label: 'Hero',
  description: 'قسم رئيسي بصورة وعنوان وزر CTA',
  category: 'composed',
  icon: 'i-lucide-mountain-snow',
  acceptsChildren: false,
  defaultProps: () => ({
    eyebrow: 'مرحباً بك في',
    title: 'منصة تعليم استثنائية',
    subtitle: 'تعلّم من أفضل المدرّسين، في أي وقت ومن أي مكان. انضم لآلاف الطلاب اليوم.',
    primaryButton: { text: 'ابدأ الآن', href: '#' },
    secondaryButton: { text: 'تصفح الكورسات', href: '#' },
    image: '',
    layout: 'split-right', // split-right | split-left | centered | full-bg
    background: 'gradient', // gradient | solid | image | transparent
    align: 'right'
  }),
  schema: z.object({
    eyebrow: z.string().max(100),
    title: z.string().max(200),
    subtitle: z.string().max(500),
    primaryButton: z.object({ text: z.string(), href: z.string() }),
    secondaryButton: z.object({ text: z.string(), href: z.string() }).optional(),
    image: z.string(),
    layout: z.enum(['split-right', 'split-left', 'centered', 'full-bg']),
    background: z.enum(['gradient', 'solid', 'image', 'transparent']),
    align: alignSchema
  })
}

const featureGrid: BlockDefinition = {
  type: 'feature-grid',
  label: 'ميزات',
  description: 'شبكة ميزات بأيقونات وعناوين',
  category: 'composed',
  icon: 'i-lucide-layers',
  acceptsChildren: false,
  defaultProps: () => ({
    title: 'لماذا تختارنا؟',
    subtitle: 'ميزات تجعلنا الخيار الأمثل لتعلّمك',
    columns: 3,
    features: [
      { icon: 'i-lucide-graduation-cap', title: 'مدرّسون خبراء', description: 'تعلم من أفضل المدرّسين في مجالاتهم' },
      { icon: 'i-lucide-clock', title: 'وصول مدى الحياة', description: 'ادرس وأنت حر في وقتك ومنزلك' },
      { icon: 'i-lucide-badge-check', title: 'شهادة معتمدة', description: 'احصل على شهادة عند إتمام الكورس' }
    ]
  }),
  schema: z.object({
    title: z.string().max(200),
    subtitle: z.string().max(500),
    columns: z.number().min(1).max(4),
    features: z.array(z.object({
      icon: z.string(),
      title: z.string().max(100),
      description: z.string().max(300)
    })).max(12)
  })
}

const pricingCard: BlockDefinition = {
  type: 'pricing-card',
  label: 'بطاقة سعر',
  description: 'بطاقة سعر مع ميزات وزر شراء',
  category: 'composed',
  icon: 'i-lucide-credit-card',
  acceptsChildren: false,
  defaultProps: () => ({
    name: 'الباقة الأساسية',
    price: '299',
    currency: 'ج.م',
    period: '/كورس',
    description: 'مثالية للمبتدئين',
    features: ['وصول لجميع الدروس', 'شهادة إتمام', 'دعم فني', 'تحديثات مجانية'],
    ctaText: 'اشترك الآن',
    ctaHref: '#',
    featured: false
  }),
  schema: z.object({
    name: z.string().max(100),
    price: z.string().max(50),
    currency: z.string().max(10),
    period: z.string().max(50),
    description: z.string().max(200),
    features: z.array(z.string()).max(20),
    ctaText: z.string().max(50),
    ctaHref: z.string(),
    featured: z.boolean()
  })
}

const testimonial: BlockDefinition = {
  type: 'testimonial',
  label: 'رأي عميل',
  description: 'اقتباس عميل مع صورة واسم',
  category: 'composed',
  icon: 'i-lucide-quote',
  acceptsChildren: false,
  defaultProps: () => ({
    quote: 'منصة ممتازة! تعلمت منها أكثر مما توقعت. المدرّسون محترفون والمحتوى قيم جداً.',
    authorName: 'أحمد محمد',
    authorTitle: 'مطور برمجيات',
    authorImage: '',
    rating: 5
  }),
  schema: z.object({
    quote: z.string().max(500),
    authorName: z.string().max(100),
    authorTitle: z.string().max(100),
    authorImage: z.string(),
    rating: z.number().min(0).max(5)
  })
}

const faq: BlockDefinition = {
  type: 'faq',
  label: 'أسئلة شائعة',
  description: 'قائمة أسئلة وأجوبة قابلة للطي',
  category: 'composed',
  icon: 'i-lucide-help-circle',
  acceptsChildren: false,
  defaultProps: () => ({
    title: 'الأسئلة الشائعة',
    items: [
      { question: 'كيف أشترك في كورس؟', answer: 'اختر الكورس، اضغط اشترك، أكمل الدفع، وابدأ التعلم فوراً.' },
      { question: 'هل أحصل على شهادة؟', answer: 'نعم، بعد إتمام الكورس تحصل على شهادة معتمدة.' },
      { question: 'هل يوجد استرجاع للمبلغ؟', answer: 'خلال 14 يوم من الشراء إذا لم تبدأ الكورس.' }
    ]
  }),
  schema: z.object({
    title: z.string().max(200),
    items: z.array(z.object({
      question: z.string().max(300),
      answer: z.string().max(1000)
    })).max(20)
  })
}

const cta: BlockDefinition = {
  type: 'cta',
  label: 'CTA',
  description: 'قسم دعوة لاتخاذ إجراء',
  category: 'composed',
  icon: 'i-lucide-megaphone',
  acceptsChildren: false,
  defaultProps: () => ({
    title: 'جاهز لبدء رحلتك؟',
    subtitle: 'انضم لآلاف الطلاب today',
    buttonText: 'سجّل مجاناً',
    buttonHref: '#',
    background: 'gradient'
  }),
  schema: z.object({
    title: z.string().max(200),
    subtitle: z.string().max(300),
    buttonText: z.string().max(50),
    buttonHref: z.string(),
    background: z.enum(['gradient', 'solid', 'image'])
  })
}

const stats: BlockDefinition = {
  type: 'stats',
  label: 'إحصائيات',
  description: 'أرقام وإحصائيات بارزة',
  category: 'composed',
  icon: 'i-lucide-bar-chart-3',
  acceptsChildren: false,
  defaultProps: () => ({
    items: [
      { value: '10K+', label: 'طالب نشط' },
      { value: '500+', label: 'كورس متاح' },
      { value: '50+', label: 'مدرّس خبير' },
      { value: '4.9', label: 'تقييم المتوسط' }
    ]
  }),
  schema: z.object({
    items: z.array(z.object({
      value: z.string().max(20),
      label: z.string().max(50)
    })).min(1).max(6)
  })
}

/* ---------- Tolnera-specific ---------- */

const courseGrid: BlockDefinition = {
  type: 'course-grid',
  label: 'شبكة كورسات',
  description: 'شبكة كورسات (تسحب من API لاحقاً)',
  category: 'tolnera',
  icon: 'i-lucide-graduation-cap',
  acceptsChildren: false,
  defaultProps: () => ({
    title: 'الكورسات الأكثر شعبية',
    columns: 3,
    limit: 6,
    showFilter: true,
    apiUrl: '/api/tolnera/courses' // future: real Tolnera API
  }),
  schema: z.object({
    title: z.string().max(200),
    columns: z.number().min(1).max(4),
    limit: z.number().min(1).max(24),
    showFilter: z.boolean(),
    apiUrl: z.string()
  })
}

const courseCard: BlockDefinition = {
  type: 'course-card',
  label: 'بطاقة كورس',
  description: 'بطاقة كورس واحدة',
  category: 'tolnera',
  icon: 'i-lucide-book-open',
  acceptsChildren: false,
  defaultProps: () => ({
    title: 'تعلّم البرمجة من الصفر',
    instructor: 'م. سارة أحمد',
    price: '299',
    currency: 'ج.م',
    image: '',
    rating: 4.8,
    students: 1240,
    duration: '12 ساعة',
    href: '#'
  }),
  schema: z.object({
    title: z.string().max(200),
    instructor: z.string().max(100),
    price: z.string().max(50),
    currency: z.string().max(10),
    image: z.string(),
    rating: z.number().min(0).max(5),
    students: z.number(),
    duration: z.string().max(50),
    href: z.string()
  })
}

const instructorCard: BlockDefinition = {
  type: 'instructor-card',
  label: 'بطاقة مدرّس',
  description: 'بطاقة تعريف مدرّس',
  category: 'tolnera',
  icon: 'i-lucide-user-round',
  acceptsChildren: false,
  defaultProps: () => ({
    name: 'م. سارة أحمد',
    title: 'مهندسة برمجيات @ Google',
    bio: 'خبرة 10 سنوات في تطوير الويب. درّبت أكثر من 5000 طالب.',
    image: '',
    socials: { twitter: '#', linkedin: '#', github: '#' }
  }),
  schema: z.object({
    name: z.string().max(100),
    title: z.string().max(100),
    bio: z.string().max(500),
    image: z.string(),
    socials: z.object({
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      website: z.string().optional()
    })
  })
}

const signupForm: BlockDefinition = {
  type: 'signup-form',
  label: 'نموذج تسجيل',
  description: 'نموذج اشتراك بإيميل',
  category: 'tolnera',
  icon: 'i-lucide-user-plus',
  acceptsChildren: false,
  defaultProps: () => ({
    title: 'سجّل في النشرة البريدية',
    subtitle: 'كن أول من يعرف عن الكورسات الجديدة',
    placeholder: 'بريدك الإلكتروني',
    buttonText: 'اشترك',
    apiEndpoint: '/api/leads/subscribe'
  }),
  schema: z.object({
    title: z.string().max(200),
    subtitle: z.string().max(300),
    placeholder: z.string().max(100),
    buttonText: z.string().max(50),
    apiEndpoint: z.string()
  })
}

/* ---------- Advanced (sandboxed) ---------- */

const customHtml: BlockDefinition = {
  type: 'custom-html',
  label: 'HTML مخصص',
  description: 'كود HTML/CSS/JS مخصص (في sandbox معزول)',
  category: 'advanced',
  icon: 'i-lucide-code-2',
  acceptsChildren: false,
  defaultProps: () => ({
    html: '<div style="padding:1rem;text-align:center;background:#f1f5f9;border-radius:8px;">كودك هنا</div>',
    height: 200
  }),
  schema: z.object({
    html: z.string().max(50000),
    height: z.number().min(50).max(2000)
  })
}

const codeBlock: BlockDefinition = {
  type: 'code-block',
  label: 'بلوك كود',
  description: 'عرض كود برمجي منسّق',
  category: 'advanced',
  icon: 'i-lucide-terminal',
  acceptsChildren: false,
  defaultProps: () => ({
    code: 'const hello = "world";\nconsole.log(hello);',
    language: 'javascript',
    showLineNumbers: true
  }),
  schema: z.object({
    code: z.string().max(10000),
    language: z.string().max(50),
    showLineNumbers: z.boolean()
  })
}

/* ---------- Registry ---------- */

export const blockDefinitions: Record<BlockType, BlockDefinition> = {
  container, grid, columns, divider, spacer,
  heading, text, richtext, image, video, button, icon,
  hero, 'feature-grid': featureGrid, 'pricing-card': pricingCard,
  testimonial, faq, cta, stats,
  'course-grid': courseGrid, 'course-card': courseCard,
  'instructor-card': instructorCard, 'signup-form': signupForm,
  'custom-html': customHtml, 'code-block': codeBlock
}

export const listBlocksByCategory = () => {
  const cats: Record<string, BlockDefinition[]> = {
    layout: [], content: [], composed: [], tolnera: [], advanced: []
  }
  for (const def of Object.values(blockDefinitions)) {
    cats[def.category].push(def)
  }
  return cats
}

export const getBlockDefinition = (type: BlockType): BlockDefinition => {
  const def = blockDefinitions[type]
  if (!def) throw new Error(`Unknown block type: ${type}`)
  return def
}

/* ---------- Factory: create a new Block instance ---------- */

export const createBlock = (type: BlockType, overrides: Partial<Block> = {}): Block => {
  const def = getBlockDefinition(type)
  return {
    id: newBlockId(),
    type,
    props: def.defaultProps(),
    visibility: { mobile: true, tablet: true, desktop: true },
    children: def.acceptsChildren ? [] : undefined,
    ...overrides
  }
}
