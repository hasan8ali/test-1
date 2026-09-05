import type { BlockDefinition, BlockType } from '~/types/builder'

/**
 * Block registry — all 20+ block types across 5 categories.
 * Each block has: type, label, icon, category, acceptsChildren, defaultProps.
 *
 * Decision: We build the canvas with Vue components + vuedraggable
 * instead of GrapesJS. Reason: GrapesJS has its own flat block model
 * that doesn't fit the infinite-nesting tree structure we need.
 * vuedraggable handles drag/drop within recursive components cleanly.
 */

const defs: Record<BlockType, BlockDefinition> = {
  /* ===== Layout ===== */
  container: {
    type: 'container', label: 'حاوية', description: 'تغليف مجموعة بلوكات',
    category: 'layout', icon: 'i-lucide-square', acceptsChildren: true,
    defaultProps: () => ({ paddingY: 'md', paddingX: 'md', background: 'transparent', maxWidth: 'full' })
  },
  columns: {
    type: 'columns', label: 'أعمدة', description: 'تقسيم لعمودين أو أكثر',
    category: 'layout', icon: 'i-lucide-columns-2', acceptsChildren: true,
    defaultProps: () => ({ layout: '1-1', gap: 'md', stackMobile: true })
  },
  spacer: {
    type: 'spacer', label: 'مسافة', description: 'مساحة فارغة',
    category: 'layout', icon: 'i-lucide-move-vertical', acceptsChildren: false,
    defaultProps: () => ({ size: 'lg' })
  },
  divider: {
    type: 'divider', label: 'فاصل', description: 'خط فاصل',
    category: 'layout', icon: 'i-lucide-minus', acceptsChildren: false,
    defaultProps: () => ({ style: 'solid' })
  },

  /* ===== Content ===== */
  heading: {
    type: 'heading', label: 'عنوان', description: 'عنوان رئيسي',
    category: 'content', icon: 'i-lucide-heading', acceptsChildren: false,
    defaultProps: () => ({ text: 'عنوان جديد', level: 2, align: 'right' })
  },
  text: {
    type: 'text', label: 'نص', description: 'فقرة نصية',
    category: 'content', icon: 'i-lucide-type', acceptsChildren: false,
    defaultProps: () => ({ content: 'اكتب نصك هنا...', size: 'base', align: 'right', maxWidth: 'full' })
  },
  image: {
    type: 'image', label: 'صورة', description: 'صورة من رابط أو رفع',
    category: 'content', icon: 'i-lucide-image', acceptsChildren: false,
    defaultProps: () => ({ src: '', alt: '', radius: 'md', align: 'center' })
  },
  video: {
    type: 'video', label: 'فيديو', description: 'YouTube / Vimeo / مباشر',
    category: 'content', icon: 'i-lucide-video', acceptsChildren: false,
    defaultProps: () => ({ src: '', provider: 'youtube', ratio: '16/9' })
  },
  button: {
    type: 'button', label: 'زر', description: 'زر قابل للنقر',
    category: 'content', icon: 'i-lucide-mouse-pointer-click', acceptsChildren: false,
    defaultProps: () => ({ text: 'اضغط هنا', href: '#', variant: 'primary', size: 'md', align: 'right' })
  },
  icon: {
    type: 'icon', label: 'أيقونة', description: 'أيقونة من Lucide',
    category: 'content', icon: 'i-lucide-star', acceptsChildren: false,
    defaultProps: () => ({ name: 'i-lucide-star', size: 'lg' })
  },

  /* ===== Composed ===== */
  hero: {
    type: 'hero', label: 'Hero', description: 'قسم رئيسي بصورة وعنوان',
    category: 'composed', icon: 'i-lucide-mountain-snow', acceptsChildren: false,
    defaultProps: () => ({
      eyebrow: '', title: 'عنوان رئيسي', subtitle: 'وصف فرعي',
      primaryButton: { text: 'اضغط', href: '#' },
      secondaryButton: { text: '', href: '' },
      layout: 'centered', background: 'light', align: 'center', paddingY: 'xl'
    })
  },
  'feature-grid': {
    type: 'feature-grid', label: 'ميزات', description: 'شبكة ميزات بأيقونات',
    category: 'composed', icon: 'i-lucide-layout-grid', acceptsChildren: false,
    defaultProps: () => ({
      title: 'لماذا تختارنا؟', subtitle: '', columns: 3, paddingY: 'lg',
      features: [
        { icon: 'i-lucide-zap', title: 'سريع', desc: 'وصف الميزة' },
        { icon: 'i-lucide-shield', title: 'آمن', desc: 'وصف الميزة' },
        { icon: 'i-lucide-heart', title: 'سهل', desc: 'وصف الميزة' }
      ]
    })
  },
  'pricing-table': {
    type: 'pricing-table', label: 'تسعير', description: 'جدول خطط تسعير',
    category: 'composed', icon: 'i-lucide-credit-card', acceptsChildren: false,
    defaultProps: () => ({
      title: 'الخطط', columns: 3, paddingY: 'lg',
      plans: [
        { name: 'أساسي', price: '99', currency: 'ج.م', features: ['ميزة 1', 'ميزة 2'], ctaText: 'اشترك', ctaHref: '#', featured: false },
        { name: 'احترافي', price: '199', currency: 'ج.م', features: ['ميزة 1', 'ميزة 2', 'ميزة 3'], ctaText: 'اشترك', ctaHref: '#', featured: true },
        { name: 'فرق', price: '399', currency: 'ج.م', features: ['ميزة 1', 'ميزة 2'], ctaText: 'اشترك', ctaHref: '#', featured: false }
      ]
    })
  },
  'testimonial-grid': {
    type: 'testimonial-grid', label: 'آراء', description: 'شبكة آراء عملاء',
    category: 'composed', icon: 'i-lucide-quote', acceptsChildren: false,
    defaultProps: () => ({
      title: 'آراء عملائنا', columns: 2, paddingY: 'lg',
      testimonials: [
        { quote: 'تجربة رائعة!', name: 'عميل', role: 'مسمى', rating: 5 }
      ]
    })
  },
  faq: {
    type: 'faq', label: 'أسئلة', description: 'أسئلة شائعة',
    category: 'composed', icon: 'i-lucide-help-circle', acceptsChildren: false,
    defaultProps: () => ({
      title: 'الأسئلة الشائعة', paddingY: 'lg',
      items: [
        { q: 'سؤال؟', a: 'إجابة.' }
      ]
    })
  },
  stats: {
    type: 'stats', label: 'إحصائيات', description: 'أرقام بارزة',
    category: 'composed', icon: 'i-lucide-bar-chart-3', acceptsChildren: false,
    defaultProps: () => ({
      paddingY: 'md',
      items: [
        { value: '100+', label: 'عميل' },
        { value: '4.9', label: 'تقييم' }
      ]
    })
  },
  'enrollment-cta': {
    type: 'enrollment-cta', label: 'CTA', description: 'دعوة للتسجيل',
    category: 'composed', icon: 'i-lucide-megaphone', acceptsChildren: false,
    defaultProps: () => ({
      title: 'جاهز للبدء؟', subtitle: 'انضم الآن', buttonText: 'سجّل', buttonHref: '#', background: 'accent', paddingY: 'lg'
    })
  },
  'page-header': {
    type: 'page-header', label: 'هيدر صفحة', description: 'عنوان صفحة بسيط',
    category: 'composed', icon: 'i-lucide-panel-top', acceptsChildren: false,
    defaultProps: () => ({ title: 'عنوان الصفحة', subtitle: '', paddingY: 'lg' })
  },

  /* ===== Education-specific ===== */
  'course-grid': {
    type: 'course-grid', label: 'شبكة كورسات', description: 'عرض كورسات',
    category: 'education', icon: 'i-lucide-graduation-cap', acceptsChildren: false,
    defaultProps: () => ({ title: 'كورساتنا', columns: 3, showCategoryFilter: false, paddingY: 'lg' })
  },
  'course-card': {
    type: 'course-card', label: 'بطاقة كورس', description: 'بطاقة كورس واحدة',
    category: 'education', icon: 'i-lucide-book-open', acceptsChildren: false,
    defaultProps: () => ({
      title: 'عنوان الكورس', instructor: 'اسم المدرّس', price: '299', currency: 'ج.م',
      image: '', rating: 4.8, students: 1200, duration: '6h', href: '#'
    })
  },
  'curriculum-list': {
    type: 'curriculum-list', label: 'منهج', description: 'قائمة دروس الكورس',
    category: 'education', icon: 'i-lucide-list-checks', acceptsChildren: false,
    defaultProps: () => ({
      title: 'محتوى الكورس', paddingY: 'lg',
      sections: [
        { title: 'الأساسيات', lessons: [{ title: 'درس 1', duration: '10:00' }] }
      ]
    })
  },
  'instructor-bio': {
    type: 'instructor-bio', label: 'نبذة مدرّس', description: 'بطاقة مدرّس',
    category: 'education', icon: 'i-lucide-user', acceptsChildren: false,
    defaultProps: () => ({
      name: 'اسم المدرّس', title: 'مسمى', bio: 'نبذة قصيرة', image: '', paddingY: 'lg'
    })
  },
  'instructor-grid': {
    type: 'instructor-grid', label: 'شبكة مدرّبين', description: 'عرض مجموعة مدرّبين',
    category: 'education', icon: 'i-lucide-users', acceptsChildren: false,
    defaultProps: () => ({ title: 'مدرّبونا', columns: 3, paddingY: 'lg' })
  },

  /* ===== Advanced ===== */
  'custom-code': {
    type: 'custom-code', label: 'كود مخصص', description: 'HTML/CSS/JS في sandbox',
    category: 'advanced', icon: 'i-lucide-code-2', acceptsChildren: false,
    defaultProps: () => ({ html: '<div style="padding:1rem">كودك هنا</div>', height: 200 })
  }
}

export const blockDefinitions = defs

export const blocksByCategory = () => {
  const cats: Record<string, BlockDefinition[]> = {
    layout: [], content: [], composed: [], education: [], advanced: []
  }
  for (const d of Object.values(defs)) cats[d.category].push(d)
  return cats
}

export const getBlockDef = (type: BlockType): BlockDefinition => defs[type]
