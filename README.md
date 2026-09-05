# Tolnera Page & Theme Builder

> مشروع مستقل (Microservice) لمحرر صفحات وثيمات — مبني بـ Nuxt 4 + Nuxt UI 4 + SQLite + Drizzle ORM.

هذا المشروع إثبات أن الجيل الحالي من الأدوات قادر على بناء منتجات أعمق وأذكى وأكثر إبداعًا من أي فريق بشري بنى منتجاته بالطرق التقليدية — مع الحفاظ على البساطة للمستخدم العادي والحرية الكاملة للمستخدم المتقدم.

---

## الفلسفة

**Progressive Disclosure of Complexity** — تعقيد متدرّج:

- افتراضيًا: **سحب وإفلات بسيط** للمدرّس العادي بدون أي خبرة تقنية
- عند الحاجة: **وضع متقدم (Advanced)** يفتح صلاحيات كاملة للفريلانسرز والمطورين
- الاتنان بيشتغلوا على نفس النظام بالظبط — مفيش تعارض

---

## المميزات

### 🎨 محرر السحب والإفلات (Drag & Drop Builder)

- **3-Panel Layout**: لوحة عناصر (يسار) + كنفاس (وسط) + خصائص (يمين)
- **Drag & Drop** كامل من اللوحة إلى الكنفاس
- **Layers Panel** لرؤية بنية الصفحة كشجرة هرمية
- **Live Preview** فوري مع كل تعديل
- **Undo/Redo** + **Time Travel** عبر Snapshots

### 📦 23 نوع Block (موزّعة على 5 فئات)

| الفئة | الأنواع |
|------|---------|
| **تخطيط** | Container, Grid, Columns, Divider, Spacer |
| **محتوى** | Heading, Text, RichText, Image, Video, Button, Icon |
| **مركّبة** | Hero, FeatureGrid, PricingCard, Testimonial, FAQ, CTA, Stats |
| **Tolnera** | CourseGrid, CourseCard, InstructorCard, SignupForm |
| **متقدم** | CustomHtml (sandboxed), CodeBlock |

### 🎭 نظام الثيمات (Theme System)

- **Token-First**: الثيمات هي token sets مش ملفات CSS
- **Inheritance**: ثيم يقدر يرث من ثيم تاني
- **6 ثيمات جاهزة**: Aurora, Midnight, Sunset, Forest, Mono, Ocean
- **Live cascade**: تغيير الثيم بينعكس فورًا على كل الـ blocks
- **Custom themes**: المستخدم يقدر يصنع ثيماته الخاصة

### 📱 Responsive كامل

- معاينة **Mobile (375px) / Tablet (768px) / Desktop (full)** لحظيًا
- **قواعد إخفاء لكل Block** (إظهار/إخفاء حسب الجهاز)
- كل الـ blocks متجاوبة بشكل افتراضي

### 🔒 الأمان (Security)

- **HTML Sanitization** عبر DOMPurify لكل محتوى rich-text
- **Sandboxed iframes** للكود المخصص (لا وصول للـ cookies, storage, أو الصفحة المضيفة)
- **Magic-byte validation** للملفات المرفوعة (لا نثق بـ MIME المُعلَن)
- **Parameterized SQL** عبر Drizzle ORM (لا SQL injection)
- **Zod validation** على كل API endpoint
- **5MB upload limit** + نوع الصور فقط في v1

### ⏱️ Time Travel

- كل حفظ بينشئ snapshot تلقائيًا
- أحدث 50 snapshot لكل صفحة (الأقدم يتمسح)
- البنية تدعم مستقبلاً timeline مرئي + نقاط محددة مسمّاة

### 🚀 Publishing & Export

- **Status**: draft / published
- **Public URL**: `/p/{slug}` للصفحات المنشورة
- **Auto-save** كل 30 ثانية لو في تغييرات
- **Manual save** بـ Ctrl+S

---

## التقنيات (كلها أحدث إصدارات مستقرة)

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| Nuxt | 4.5.2 | الإطار العام |
| Vue | 3.5.42 | UI |
| Nuxt UI | 4.11.0 | نظام التصميم (Tailwind v4) |
| Pinia | 4.0.3 | إدارة الحالة |
| VueUse | 14.4.0 | Helpers |
| Drizzle ORM | 0.45.2 | ORM |
| better-sqlite3 | 13.0.3 | SQLite driver |
| Zod | 4.5.4 | Validation |
| DOMPurify | 3.2.0 | HTML sanitization |
| Lucide | (via iconify-json) | الأيقونات |

---

## بنية المشروع

```
test-1/
├── app/                            # Nuxt 4 srcDir
│   ├── app.vue                     # Root component
│   ├── app.html                    # HTML template
│   ├── assets/
│   │   └── css/main.css           # Design tokens + builder styles
│   ├── components/
│   │   ├── BlockRenderer.vue      # Recursive block dispatcher
│   │   ├── blocks/                # Block renderers (23 types)
│   │   │   ├── BlockContainer.vue
│   │   │   ├── BlockGrid.vue
│   │   │   ├── BlockColumns.vue
│   │   │   ├── BlockHeading.vue
│   │   │   ├── BlockText.vue
│   │   │   ├── BlockImage.vue
│   │   │   ├── BlockHero.vue
│   │   │   ├── BlockFeatureGrid.vue
│   │   │   ├── BlockPricingCard.vue
│   │   │   ├── BlockTestimonial.vue
│   │   │   ├── BlockFaq.vue
│   │   │   ├── BlockCta.vue
│   │   │   ├── BlockStats.vue
│   │   │   ├── BlockCourseGrid.vue
│   │   │   ├── BlockCourseCard.vue
│   │   │   ├── BlockInstructorCard.vue
│   │   │   ├── BlockSignupForm.vue
│   │   │   ├── BlockCustomHtml.vue  # Sandboxed iframe
│   │   │   ├── BlockCodeBlock.vue
│   │   │   └── ...
│   │   └── builder/                # Builder UI components
│   │       ├── BlockPalette.vue    # Drag source panel
│   │       ├── LayersPanel.vue     # Block tree
│   │       ├── Canvas.vue          # Drop zone + preview
│   │       └── Inspector.vue       # Block properties editor
│   ├── pages/
│   │   ├── index.vue               # Dashboard
│   │   ├── builder/[id].vue        # The builder interface
│   │   └── p/[slug].vue            # Public page preview
│   ├── stores/
│   │   └── builder.ts              # Pinia store for builder state
│   ├── types/
│   │   └── builder.ts              # All TypeScript types
│   └── utils/
│       └── blocks.ts               # Block registry + factory
├── server/
│   ├── api/
│   │   ├── pages/                  # CRUD for pages
│   │   ├── themes/                 # CRUD for themes
│   │   ├── assets/                 # Upload + serve assets
│   │   └── snapshots/              # Time travel snapshots
│   ├── db/
│   │   └── schema.ts               # Drizzle schema definition
│   └── utils/
│       ├── db.ts                   # SQLite connection + seed
│       └── security.ts             # Sanitization + validation
├── public/favicon.svg
├── nuxt.config.ts
├── package.json
└── tsconfig.json
```

---

## التشغيل

### المتطلبات
- Node.js 18+
- npm

### التطوير
```bash
npm install
npm run dev
```
ثم افتح: http://localhost:3000

### البناء للإنتاج
```bash
npm run build
npm run preview
```

### متغيرات البيئة (اختيارية)
- `TOLNERA_DB_PATH` — مسار ملف SQLite (default: `./data/tolnera.db`)

---

## الـ API

### Pages
- `GET /api/pages` — قائمة كل الصفحات
- `POST /api/pages` — إنشاء صفحة `{ title, themeId, ... }`
- `GET /api/pages/:id` — صفحة واحدة
- `PATCH /api/pages/:id` — تحديث (ينشئ snapshot تلقائيًا)
- `DELETE /api/pages/:id` — حذف (+ snapshots)

### Themes
- `GET /api/themes` — كل الثيمات
- `POST /api/themes` — إنشاء ثيم مخصص
- `GET /api/themes/:id` — ثيم واحد (مع حل inheritance)
- `PATCH /api/themes/:id` — تحديث (لا يمكن تعديل built-in)
- `DELETE /api/themes/:id` — حذف (لا يمكن حذف built-in أو المستخدمة)

### Assets
- `GET /api/assets` — قائمة الوسائط
- `POST /api/assets` — رفع ملف (multipart/form-data, field: `file`)
- `GET /api/assets/:id/raw` — الملف نفسه (cached 1 year)
- `DELETE /api/assets/:id` — حذف

### Snapshots
- `GET /api/snapshots/:pageId` — snapshots لصفحة (مرتبة بالأحدث)
- `POST /api/snapshots` — إنشاء snapshot `{ pageId, blocks, label? }`

---

## الابتكارات اللي بتفرّق المشروع

### 1. Token-First Theming
الثيمات مش ملفات CSS ضخمة، دي token sets صغيرة. تغيير لون واحد بيتعدّل على كل الـ blocks فورًا. الثيمات تقدر تورّث من بعض.

### 2. Sandboxed Advanced Mode
الكود المخصص بيشتغل في iframe معزول تمامًا — `sandbox="allow-scripts"` فقط، بدون `allow-same-origin`. مفيش وصول للـ cookies، الـ storage، أو الـ DOM بتاع الصفحة المضيفة.

### 3. Smart Block System
كل block نوعه عارف هدفه. الـ `CourseGrid` بيسحب من API مستقبلاً، الـ `PricingCard` فاهم بنية تسعير Tolnera، الـ `Hero` ليه 4 layouts جاهزة ذكية.

### 4. Infinite Composition
الـ blocks تقدر تتداخل لعمق غير محدود. Container جواه Grid جواه Columns جوه Cards. كل block ليه visibility rules مستقلة.

### 5. Cohesive Design System
كل عنصر في الـ UI مبني بـ Nuxt UI v4 — أزرار، inputs، modals، selects، badges. لو عدّلت theme token، الباقي كله يتجاوب معاه.

---

## الترخيص
MIT — مشروع تجريبي لمنصة Tolnera.
