# Nuxt Word Editor — محرر نصوص عصري

محرر نصوص مبني على **Nuxt 3 + TipTap + Vue 3**، مبني على فكرة Word من Microsoft لكن بشكل عصري، أنيق، ومتجاوب مع كل الشاشات.

## المميزات

### تنسيق النص
- ✅ عريض / مائل / تحته خط / مشطوب
- ✅ منخفض (Subscript) و مرتفع (Superscript)
- ✅ 4 مستويات للعناوين (H1 → H4)
- ✅ تغيير نوع الخط (Cairo, Tajawal, Amiri, Inter, Georgia, Monospace)
- ✅ تغيير حجم الخط (10 أحجام مختلفة)
- ✅ لون النص (20 لون جاهز)
- ✅ تظليل (Highlight) بعدة ألوان

### الجداول والقوائم
- ✅ قوائم نقطية و رقمية
- ✅ قوائم مهام (Task lists) بـ checkboxes
- ✅ جداول كاملة (إضافة/حذف صفوف وأعمدة، دمج خلايا، ترويسة)
- ✅ محاذاة النص (يمين، وسط، يسار، ضبط)

### الإدراج
- ✅ روابط (Links) بـ modal بسيط
- ✅ صور (URL أو رفع من الجهاز)
- ✅ اقتباسات (Blockquotes)
- ✅ كود inline و code blocks
- ✅ خطوط فاصلة أفقية

### الـ UX
- ✅ **Dark mode** بضغطة زر (محفوظ تلقائياً)
- ✅ **وضع القراءة** (يخفي الـ toolbar)
- ✅ **ملء الشاشة** (Fullscreen)
- ✅ **حفظ تلقائي** في localStorage
- ✅ عداد الكلمات والحروف (في الـ status bar)
- ✅ Undo / Redo
- ✅ اختصارات لوحة المفاتيح (Ctrl+S للحفظ، Ctrl+Shift+D للداكن)

### التصدير
- ✅ تصدير HTML كامل بستايل
- ✅ تصدير Markdown
- ✅ تصدير Text
- ✅ طباعة (Print)

### التجاوب (Responsive)
- ✅ موبايل: الـ toolbar بيلف ويستخدم wrap
- ✅ تابلت: عرض متوسط
- ✅ لابتوب/ديسكتوب: عرض كامل
- ✅ RTL بالكامل للعربية

## التقنيات المستخدمة

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| Nuxt 3 | 3.13+ | إطار العمل |
| Vue 3 | 3.5+ | UI |
| TipTap | 2.10+ | المحرر |
| Tailwind CSS | 6.12+ | الستايل |
| Lucide Icons | 0.456+ | الأيقونات |

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

## بنية المشروع

```
test-1/
├── assets/
│   └── css/
│       └── main.css          # الستايلات العامة + ستايل الـ TipTap
├── components/
│   └── editor/
│       ├── EditorContent.vue  # المحرر نفسه (الـ TipTap instance)
│       ├── EditorToolbar.vue  # الـ toolbar بكل الأزرار
│       ├── TableMenu.vue      # قائمة تعديل الجداول
│       └── EditorStatusbar.vue # الشريط السفلي
├── pages/
│   └── index.vue              # الصفحة الرئيسية
├── utils/
│   └── font-size-extension.ts # إضافة حجم الخط لـ TipTap
├── public/
│   └── favicon.svg
├── app.vue
├── app.html
├── nuxt.config.ts
├── tailwind.config.ts
└── package.json
```

## المساهمة

المشروع ده تجريبي للتجربة بين فريق الـ development.

## الترخيص

MIT
