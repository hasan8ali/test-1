/**
 * 3 complete templates with DIFFERENT layouts (not just color swaps).
 * Each template = a full site with multiple pages.
 *
 * 1. Solo Course — single-page focus on one flagship course (centered, minimal)
 * 2. Academy — multi-course academy (grid-heavy, multi-page)
 * 3. Mentor — personal brand (asymmetric, editorial)
 */

import type { Block } from '../../app/types/builder'

function uid(): string {
  return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)
}

/* ---------- Block factory helpers ---------- */
function blk(type: string, props: Record<string, any>, children?: Block[]): Block {
  return {
    id: uid(),
    type: type as any,
    props,
    visibility: { mobile: true, tablet: true, desktop: true },
    children: children ?? (type === 'container' || type === 'columns' ? [] : undefined)
  }
}

/* ===== Template 1: Solo Course ===== */
const soloCourseHome: Block[] = [
  blk('hero', {
    eyebrow: 'كورس أونلاين',
    title: 'أتقن [الموضوع] من الصفر للاحتراف',
    subtitle: 'كورس شامل بأكثر من 40 درسًا عمليًا. تعلّم بخبرة 10 سنوات مضغوطة في 6 ساعات.',
    primaryButton: { text: 'اشترك الآن — 299 ج.م', href: '#enroll' },
    secondaryButton: { text: 'شاهد المعاينة', href: '#preview' },
    layout: 'centered',
    background: 'dark',
    align: 'center',
    paddingY: 'xl'
  }),
  blk('stats', {
    items: [
      { value: '40+', label: 'درس عملي' },
      { value: '6h', label: 'محتوى مرئي' },
      { value: '4.9', label: 'تقييم الطلاب' },
      { value: '1,200+', label: 'طالب نشط' }
    ],
    paddingY: 'lg'
  }),
  blk('curriculum-list', {
    title: 'محتوى الكورس',
    sections: [
      {
        title: 'الأساسيات',
        lessons: [
          { title: 'مقدمة وتجهيز البيئة', duration: '12:00' },
          { title: 'المفاهيم الأساسية', duration: '18:30' },
          { title: 'أول مشروع عملي', duration: '25:00' }
        ]
      },
      {
        title: 'المتوسط',
        lessons: [
          { title: 'الأنماط المتقدمة', duration: '22:00' },
          { title: 'أفضل الممارسات', duration: '15:00' },
          { title: 'تحسين الأداء', duration: '20:00' }
        ]
      },
      {
        title: 'المتقدم',
        lessons: [
          { title: 'المشاريع الكاملة', duration: '45:00' },
          { title: 'النشر والإطلاق', duration: '18:00' }
        ]
      }
    ],
    paddingY: 'lg'
  }),
  blk('instructor-bio', {
    name: 'اسم المدرّس',
    title: 'خبير في المجال منذ 10+ سنوات',
    bio: 'درّبت أكثر من 5000 طالب عبر السنوات. شغوف بنقل المعرفة بشكل بسيط وعملي.',
    image: '',
    paddingY: 'lg'
  }),
  blk('pricing-table', {
    title: 'استثمر في تعلّمك',
    plans: [
      {
        name: 'أساسي',
        price: '199',
        currency: 'ج.م',
        features: ['وصول للكورس 6 أشهر', 'شهادة إتمام', 'دعم عبر البريد'],
        ctaText: 'اشترك',
        ctaHref: '#',
        featured: false
      },
      {
        name: 'احترافي',
        price: '299',
        currency: 'ج.م',
        features: ['وصول مدى الحياة', 'شهادة معتمدة', 'دعم priority', 'تحديثات مجانية', 'مجموعة طلابية'],
        ctaText: 'الأكثر شعبية',
        ctaHref: '#',
        featured: true
      },
      {
        name: 'فرق',
        price: '899',
        currency: 'ج.م',
        features: ['كل مميزات الاحترافي', 'حتى 5 أعضاء', 'جلسات استشارية'],
        ctaText: 'اشترك',
        ctaHref: '#',
        featured: false
      }
    ],
    paddingY: 'lg'
  }),
  blk('faq', {
    title: 'أسئلة شائعة',
    items: [
      { q: 'هل أحتاج خبرة سابقة؟', a: 'لا، الكورس يبدأ من الصفر تمامًا.' },
      { q: 'كم يستغرق إتمام الكورس؟', a: 'بين 2 إلى 4 أسابيع حسب وتيرتك.' },
      { q: 'هل توجد شهادة؟', a: 'نعم، شهادة إتمام معتمدة بعد إكمال所有 الدروس.' },
      { q: 'هل يوجد استرجاع؟', a: 'خلال 14 يوم إذا لم تبدأ بعد.' }
    ],
    paddingY: 'lg'
  }),
  blk('enrollment-cta', {
    title: 'جاهز للبدء؟',
    subtitle: 'انضم لـ 1,200+ طالب غيّروا مسيرتهم',
    buttonText: 'سجّل الآن',
    buttonHref: '#enroll',
    background: 'accent'
  })
]

/* ===== Template 2: Academy (multi-page) ===== */
const academyHome: Block[] = [
  blk('hero', {
    eyebrow: 'أكاديمية [الاسم]',
    title: 'تعلّم من نخبة المدرّبين',
    subtitle: 'منصة تعليمية متخصصة. أكثر من 50 كورس في مختلف المجالات، كلها بمعايير عالية.',
    primaryButton: { text: 'تصفّح الكورسات', href: '/courses' },
    secondaryButton: { text: 'من نحن', href: '/about' },
    layout: 'split-right',
    background: 'light',
    align: 'right',
    paddingY: 'xl'
  }),
  blk('stats', {
    items: [
      { value: '50+', label: 'كورس' },
      { value: '15K+', label: 'طالب' },
      { value: '20+', label: 'مدرّب' },
      { value: '4.8', label: 'متوسط التقييم' }
    ],
    paddingY: 'md'
  }),
  blk('course-grid', {
    title: 'الكورسات الأكثر شعبية',
    columns: 3,
    showCategoryFilter: true,
    paddingY: 'lg'
  }),
  blk('feature-grid', {
    title: 'لماذا أكاديميتنا؟',
    subtitle: 'معايير تعليمية لا نساوم عليها',
    columns: 3,
    features: [
      { icon: 'i-lucide-award', title: 'مدرّبون معتمدون', desc: 'كل مدرّب يمر بعملية تأهيل صارمة' },
      { icon: 'i-lucide-infinity', title: 'وصول مدى الحياة', desc: 'ادفع مرة، تعلّم للأبد' },
      { icon: 'i-lucide-users', title: 'مجتمع نشط', desc: 'آلاف الطلاب يتبادلون الخبرات' }
    ],
    paddingY: 'lg'
  }),
  blk('testimonial-grid', {
    title: 'قصص نجاح طلابنا',
    columns: 2,
    testimonials: [
      { quote: 'غيّرت حياتي المهنية تمامًا.', name: 'أحمد م.', role: 'مطور', rating: 5 },
      { quote: 'أفضل منصة تعلمت منها.', name: 'سارة ع.', role: 'مصممة', rating: 5 },
      { quote: 'المحتوى عملي والمدرّبون محترفون.', name: 'خالد ر.', role: 'رائد أعمال', rating: 5 },
      { quote: 'استثمار يستحق كل جنيه.', name: 'منى س.', role: 'محللة بيانات', rating: 5 }
    ],
    paddingY: 'lg'
  }),
  blk('enrollment-cta', {
    title: 'ابدأ رحلتك التعليمية اليوم',
    subtitle: 'اشترك في النشرة واحصل على خصم 20% على أول كورس',
    buttonText: 'سجّل مجانًا',
    buttonHref: '#',
    background: 'accent'
  })
]

const academyCourses: Block[] = [
  blk('page-header', {
    title: 'كل الكورسات',
    subtitle: 'تصفّح أكثر من 50 كورس في مختلف المجالات',
    paddingY: 'lg'
  }),
  blk('course-grid', {
    title: '',
    columns: 3,
    showCategoryFilter: true,
    paddingY: 'lg'
  })
]

const academyAbout: Block[] = [
  blk('page-header', {
    title: 'من نحن',
    subtitle: 'قصة الأكاديمية',
    paddingY: 'lg'
  }),
  blk('text', {
    content: 'تأسست الأكاديمية عام 2020 بهدف واضح: تقديم تعليم عالي الجودة في متناول الجميع. نؤمن أن التعليم الجيد لا يجب أن يكون مكلفًا أو معقدًا.',
    size: 'lg',
    align: 'right',
    maxWidth: 'prose',
    paddingY: 'md'
  }),
  blk('stats', {
    items: [
      { value: '2020', label: 'سنة التأسيس' },
      { value: '15K+', label: 'خريج' },
      { value: '50+', label: 'كورس' }
    ],
    paddingY: 'md'
  }),
  blk('instructor-grid', {
    title: 'مدرّبونا',
    columns: 3,
    paddingY: 'lg'
  })
]

/* ===== Template 3: Mentor (personal brand) ===== */
const mentorHome: Block[] = [
  blk('hero', {
    eyebrow: 'مرحباً، أنا',
    title: '[اسم المدرّب]',
    subtitle: 'أساعد الناس على [المجال]. شاركت خبرتي مع آلاف الطلاب عبر السنوات. هنا تلقى كل ما أعرفه.',
    primaryButton: { text: 'احجز جلسة', href: '#booking' },
    secondaryButton: { text: 'تعلّم معي', href: '#courses' },
    layout: 'split-left',
    background: 'dark',
    align: 'right',
    paddingY: 'xl'
  }),
  blk('text', {
    content: 'فلسفتي في التعليم بسيطة: المعلومة المفيدة لا تحتاج تعقيد. كل درس أقدمه مصمم ليكون عمليًا، مباشرًا، وقابلًا للتطبيق فورًا.',
    size: 'xl',
    align: 'center',
    maxWidth: 'prose',
    paddingY: 'xl'
  }),
  blk('feature-grid', {
    title: 'كيف أساعدك',
    columns: 3,
    features: [
      { icon: 'i-lucide-video', title: 'كورسات أونلاين', desc: 'تعلّم بوتيرتك من محتوى منظم' },
      { icon: 'i-lucide-calendar', title: 'جلسات 1-on-1', desc: 'استشارات شخصية لحالتك الخاصة' },
      { icon: 'i-lucide-book-open', title: 'محتوى مجاني', desc: 'مقالات ونصائح أسبوعية' }
    ],
    paddingY: 'lg'
  }),
  blk('course-grid', {
    title: 'كورساتي',
    columns: 2,
    showCategoryFilter: false,
    paddingY: 'lg'
  }),
  blk('testimonial-grid', {
    title: 'ماذا قالوا',
    columns: 1,
    testimonials: [
      { quote: 'لم أتعلم من أحد بهذا الوضوح من قبل. كل نقطة لها هدف.', name: 'محمد ع.', role: 'طالب', rating: 5 }
    ],
    paddingY: 'lg'
  }),
  blk('enrollment-cta', {
    title: 'لنبدأ',
    subtitle: 'احجز أول جلسة استشارية مجانًا',
    buttonText: 'احجز الآن',
    buttonHref: '#booking',
    background: 'accent'
  })
]

/* ===== Export seeder ===== */
export function seedTemplates(sqlite: any, now: number, defaultThemeId: string) {
  const templates = [
    {
      id: 'tpl-solo-course',
      name: 'Solo Course',
      description: 'صفحة واحدة بتركيز كامل على كورس واحد مميز — مثالي للمدرّبين بكورس رئيسي واحد',
      category: 'solo-course',
      pages: JSON.stringify([
        { slug: '', title: 'الرئيسية', isHome: true, blocks: soloCourseHome }
      ]),
      thumbnail: 'solo'
    },
    {
      id: 'tpl-academy',
      name: 'Academy',
      description: 'أكاديمية متعددة الكورسات بصفحات منفصلة — للمراكز التعليمية والمدرّبين بمحتوى واسع',
      category: 'academy',
      pages: JSON.stringify([
        { slug: '', title: 'الرئيسية', isHome: true, blocks: academyHome },
        { slug: 'courses', title: 'الكورسات', isHome: false, blocks: academyCourses },
        { slug: 'about', title: 'من نحن', isHome: false, blocks: academyAbout }
      ]),
      thumbnail: 'academy'
    },
    {
      id: 'tpl-mentor',
      name: 'Mentor',
      description: 'موقع شخصي لعلامة المدرّس — للخبراء الذين يبنون حضورًا شخصيًا',
      category: 'mentor',
      pages: JSON.stringify([
        { slug: '', title: 'الرئيسية', isHome: true, blocks: mentorHome }
      ]),
      thumbnail: 'mentor'
    }
  ]

  const stmt = sqlite.prepare(`
    INSERT INTO templates (id, tenant_id, name, description, category, pages, default_theme_id, is_built_in, created_at)
    VALUES (@id, NULL, @name, @description, @category, @pages, @defaultThemeId, 1, @now)
  `)

  for (const t of templates) {
    stmt.run({ ...t, defaultThemeId, now })
  }
}
