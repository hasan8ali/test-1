<script setup lang="ts">
import { computed, watch } from 'vue'
import { useBuilderStore } from '~/stores/builder'
import { getBlockDefinition } from '~/utils/blocks'

const store = useBuilderStore()

const selected = computed(() => store.selectedBlock)
const def = computed(() => selected.value ? getBlockDefinition(selected.value.type) : null)

const update = (key: string, value: any) => {
  if (selected.value) {
    store.updateBlockProps(selected.value.id, { [key]: value })
  }
}

const duplicate = () => {
  if (selected.value) store.duplicateBlock(selected.value.id)
}

const remove = () => {
  if (selected.value) store.removeBlock(selected.value.id)
}

/* ---------- Asset picker ---------- */
const assetPickerOpen = ref(false)
const assets = ref<any[]>([])

const loadAssets = async () => {
  try {
    assets.value = await $fetch('/api/assets')
  } catch (e) {
    console.error('Failed to load assets', e)
  }
}

const openAssetPicker = async () => {
  await loadAssets()
  assetPickerOpen.value = true
}

const pickAsset = (asset: any) => {
  update('src', asset.url)
  update('image', asset.url)
  assetPickerOpen.value = false
}

const onFileUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  const formData = new FormData()
  formData.append('file', input.files[0])
  try {
    const result = await $fetch('/api/assets', { method: 'POST', body: formData })
    update('src', result.url)
    update('image', result.url)
  } catch (e) {
    console.error('Upload failed', e)
  }
}
</script>

<template>
  <div class="h-full flex flex-col bg-[var(--ui-bg)]">
    <div class="px-4 py-3 border-b border-[var(--ui-border)] flex items-center justify-between">
      <h3 class="font-bold text-sm flex items-center gap-2">
        <UIcon name="i-lucide-settings" />
        الخصائص
      </h3>
      <div v-if="selected" class="flex items-center gap-1">
        <UButton
          icon="i-lucide-copy"
          color="neutral"
          variant="ghost"
          size="xs"
          @click="duplicate"
          title="تكرار"
        />
        <UButton
          icon="i-lucide-trash-2"
          color="error"
          variant="ghost"
          size="xs"
          @click="remove"
          title="حذف"
        />
      </div>
    </div>

    <div v-if="!selected" class="flex-1 flex items-center justify-center text-center p-6">
      <div>
        <UIcon name="i-lucide-mouse-pointer-2" class="text-4xl text-[var(--ui-text-muted)] mb-3" />
        <p class="text-sm text-[var(--ui-text-muted)]">
          اختر عنصراً من الصفحة لتعديل خصائصه
        </p>
      </div>
    </div>

    <div v-else class="flex-1 overflow-y-auto p-4 space-y-4">
      <!-- Block header -->
      <div class="text-xs text-[var(--ui-text-muted)] flex items-center gap-2 pb-2 border-b border-[var(--ui-border)]">
        <UIcon :name="def?.icon" />
        <span>{{ def?.label }}</span>
      </div>

      <!-- === Heading === -->
      <template v-if="selected.type === 'heading'">
        <UFormField label="مستوى العنوان">
          <USelect
            v-model="selected.props.level"
            :items="[{ label: 'H1 — كبير جداً', value: 1 }, { label: 'H2 — كبير', value: 2 }, { label: 'H3 — متوسط', value: 3 }, { label: 'H4 — صغير', value: 4 }]"
            @update:model-value="(v) => update('level', v)"
          />
        </UFormField>
        <UFormField label="النص">
          <UTextarea v-model="selected.props.text" @update:model-value="(v) => update('text', v)" :rows="2" />
        </UFormField>
        <UFormField label="اللون">
          <USelect v-model="selected.props.color" :items="['text', 'textMuted', 'primary', 'secondary', 'accent']" @update:model-value="(v) => update('color', v)" />
        </UFormField>
        <UFormField label="المحاذاة">
          <UButtonGroup class="w-full">
            <UButton icon="i-lucide-align-right" :variant="selected.props.align === 'right' ? 'solid' : 'outline'" @click="update('align', 'right')" class="flex-1" />
            <UButton icon="i-lucide-align-center" :variant="selected.props.align === 'center' ? 'solid' : 'outline'" @click="update('align', 'center')" class="flex-1" />
            <UButton icon="i-lucide-align-left" :variant="selected.props.align === 'left' ? 'solid' : 'outline'" @click="update('align', 'left')" class="flex-1" />
            <UButton icon="i-lucide-align-justify" :variant="selected.props.align === 'justify' ? 'solid' : 'outline'" @click="update('align', 'justify')" class="flex-1" />
          </UButtonGroup>
        </UFormField>
      </template>

      <!-- === Text === -->
      <template v-else-if="selected.type === 'text'">
        <UFormField label="النص">
          <UTextarea v-model="selected.props.text" @update:model-value="(v) => update('text', v)" :rows="5" />
        </UFormField>
        <UFormField label="الحجم">
          <USelect v-model="selected.props.size" :items="['sm', 'base', 'lg', 'xl']" @update:model-value="(v) => update('size', v)" />
        </UFormField>
        <UFormField label="الوزن">
          <USelect v-model="selected.props.weight" :items="['thin', 'normal', 'medium', 'semibold', 'bold']" @update:model-value="(v) => update('weight', v)" />
        </UFormField>
        <UFormField label="اللون">
          <USelect v-model="selected.props.color" :items="['text', 'textMuted', 'primary', 'secondary', 'accent']" @update:model-value="(v) => update('color', v)" />
        </UFormField>
        <UFormField label="المحاذاة">
          <UButtonGroup class="w-full">
            <UButton icon="i-lucide-align-right" :variant="selected.props.align === 'right' ? 'solid' : 'outline'" @click="update('align', 'right')" class="flex-1" />
            <UButton icon="i-lucide-align-center" :variant="selected.props.align === 'center' ? 'solid' : 'outline'" @click="update('align', 'center')" class="flex-1" />
            <UButton icon="i-lucide-align-left" :variant="selected.props.align === 'left' ? 'solid' : 'outline'" @click="update('align', 'left')" class="flex-1" />
          </UButtonGroup>
        </UFormField>
      </template>

      <!-- === Rich text === -->
      <template v-else-if="selected.type === 'richtext'">
        <UFormField label="المحتوى (HTML)">
          <UTextarea v-model="selected.props.html" @update:model-value="(v) => update('html', v)" :rows="10" class="font-mono text-xs" />
        </UFormField>
        <UFormField label="الحجم">
          <USelect v-model="selected.props.size" :items="['sm', 'base', 'lg', 'xl']" @update:model-value="(v) => update('size', v)" />
        </UFormField>
        <UFormField label="المحاذاة">
          <UButtonGroup class="w-full">
            <UButton icon="i-lucide-align-right" :variant="selected.props.align === 'right' ? 'solid' : 'outline'" @click="update('align', 'right')" class="flex-1" />
            <UButton icon="i-lucide-align-center" :variant="selected.props.align === 'center' ? 'solid' : 'outline'" @click="update('align', 'center')" class="flex-1" />
            <UButton icon="i-lucide-align-left" :variant="selected.props.align === 'left' ? 'solid' : 'outline'" @click="update('align', 'left')" class="flex-1" />
          </UButtonGroup>
        </UFormField>
      </template>

      <!-- === Image === -->
      <template v-else-if="selected.type === 'image'">
        <UFormField label="رابط الصورة">
          <UInput v-model="selected.props.src" @update:model-value="(v) => update('src', v)" placeholder="https://..." />
        </UFormField>
        <UFormField label="أو اختر من المكتبة / ارفع">
          <div class="flex gap-2">
            <UButton icon="i-lucide-folder-open" variant="outline" size="sm" @click="openAssetPicker" class="flex-1">مكتبة</UButton>
            <UButton icon="i-lucide-upload" variant="outline" size="sm" class="flex-1">
              <label class="cursor-pointer">
                رفع
                <input type="file" accept="image/*" class="hidden" @change="onFileUpload">
              </label>
            </UButton>
          </div>
        </UFormField>
        <UFormField label="النص البديل (alt)">
          <UInput v-model="selected.props.alt" @update:model-value="(v) => update('alt', v)" />
        </UFormField>
        <UFormField label="العرض">
          <USelect v-model="selected.props.width" :items="['auto', '100%', '50%', '320px', '640px', '1024px']" @update:model-value="(v) => update('width', v)" />
        </UFormField>
        <UFormField label="الاستدارة">
          <USelect v-model="selected.props.radius" :items="['none', 'sm', 'md', 'lg', 'xl', 'full']" @update:model-value="(v) => update('radius', v)" />
        </UFormField>
        <UFormField label="الظل">
          <USelect v-model="selected.props.shadow" :items="['none', 'sm', 'md', 'lg', 'xl']" @update:model-value="(v) => update('shadow', v)" />
        </UFormField>
        <UFormField label="المحاذاة">
          <UButtonGroup class="w-full">
            <UButton icon="i-lucide-align-right" :variant="selected.props.align === 'right' ? 'solid' : 'outline'" @click="update('align', 'right')" class="flex-1" />
            <UButton icon="i-lucide-align-center" :variant="selected.props.align === 'center' ? 'solid' : 'outline'" @click="update('align', 'center')" class="flex-1" />
            <UButton icon="i-lucide-align-left" :variant="selected.props.align === 'left' ? 'solid' : 'outline'" @click="update('align', 'left')" class="flex-1" />
          </UButtonGroup>
        </UFormField>
      </template>

      <!-- === Button === -->
      <template v-else-if="selected.type === 'button'">
        <UFormField label="النص">
          <UInput v-model="selected.props.text" @update:model-value="(v) => update('text', v)" />
        </UFormField>
        <UFormField label="الرابط">
          <UInput v-model="selected.props.href" @update:model-value="(v) => update('href', v)" placeholder="https://..." />
        </UFormField>
        <UFormField label="النمط">
          <USelect v-model="selected.props.variant" :items="['primary', 'secondary', 'accent', 'outline', 'ghost', 'link']" @update:model-value="(v) => update('variant', v)" />
        </UFormField>
        <UFormField label="الحجم">
          <USelect v-model="selected.props.size" :items="['sm', 'md', 'lg', 'xl']" @update:model-value="(v) => update('size', v)" />
        </UFormField>
        <UFormField label="أيقونة (اختياري)">
          <UInput v-model="selected.props.icon" @update:model-value="(v) => update('icon', v)" placeholder="i-lucide-arrow-left" />
        </UFormField>
        <UFormField label="يفتح في">
          <USelect v-model="selected.props.target" :items="[{ label: 'نفس النافذة', value: 'self' }, { label: 'نافذة جديدة', value: 'blank' }]" @update:model-value="(v) => update('target', v)" />
        </UFormField>
        <UFormField label="المحاذاة">
          <UButtonGroup class="w-full">
            <UButton icon="i-lucide-align-right" :variant="selected.props.align === 'right' ? 'solid' : 'outline'" @click="update('align', 'right')" class="flex-1" />
            <UButton icon="i-lucide-align-center" :variant="selected.props.align === 'center' ? 'solid' : 'outline'" @click="update('align', 'center')" class="flex-1" />
            <UButton icon="i-lucide-align-left" :variant="selected.props.align === 'left' ? 'solid' : 'outline'" @click="update('align', 'left')" class="flex-1" />
          </UButtonGroup>
        </UFormField>
      </template>

      <!-- === Video === -->
      <template v-else-if="selected.type === 'video'">
        <UFormField label="رابط الفيديو">
          <UInput v-model="selected.props.src" @update:model-value="(v) => update('src', v)" placeholder="https://youtube.com/..." />
        </UFormField>
        <UFormField label="المزود">
          <USelect v-model="selected.props.provider" :items="['youtube', 'vimeo', 'direct']" @update:model-value="(v) => update('provider', v)" />
        </UFormField>
        <UFormField label="نسبة العرض">
          <USelect v-model="selected.props.aspectRatio" :items="['16/9', '4/3', '1/1', '21/9']" @update:model-value="(v) => update('aspectRatio', v)" />
        </UFormField>
        <UFormField label="الاستدارة">
          <USelect v-model="selected.props.radius" :items="['none', 'sm', 'md', 'lg', 'xl']" @update:model-value="(v) => update('radius', v)" />
        </UFormField>
      </template>

      <!-- === Icon === -->
      <template v-else-if="selected.type === 'icon'">
        <UFormField label="اسم الأيقونة">
          <UInput v-model="selected.props.name" @update:model-value="(v) => update('name', v)" placeholder="i-lucide-star" />
        </UFormField>
        <UFormField label="الحجم">
          <USelect v-model="selected.props.size" :items="['sm', 'md', 'lg', 'xl', '2xl']" @update:model-value="(v) => update('size', v)" />
        </UFormField>
        <UFormField label="اللون">
          <USelect v-model="selected.props.color" :items="['text', 'textMuted', 'primary', 'secondary', 'accent']" @update:model-value="(v) => update('color', v)" />
        </UFormField>
      </template>

      <!-- === Hero === -->
      <template v-else-if="selected.type === 'hero'">
        <UFormField label="نص فوق العنوان">
          <UInput v-model="selected.props.eyebrow" @update:model-value="(v) => update('eyebrow', v)" />
        </UFormField>
        <UFormField label="العنوان">
          <UTextarea v-model="selected.props.title" @update:model-value="(v) => update('title', v)" :rows="2" />
        </UFormField>
        <UFormField label="العنوان الفرعي">
          <UTextarea v-model="selected.props.subtitle" @update:model-value="(v) => update('subtitle', v)" :rows="3" />
        </UFormField>
        <UFormField label="الزر الأساسي — النص">
          <UInput v-model="selected.props.primaryButton.text" @update:model-value="(v) => update('primaryButton', { ...selected.props.primaryButton, text: v })" />
        </UFormField>
        <UFormField label="الزر الأساسي — الرابط">
          <UInput v-model="selected.props.primaryButton.href" @update:model-value="(v) => update('primaryButton', { ...selected.props.primaryButton, href: v })" />
        </UFormField>
        <UFormField label="الزر الثانوي — النص">
          <UInput v-model="selected.props.secondaryButton.text" @update:model-value="(v) => update('secondaryButton', { ...selected.props.secondaryButton, text: v })" />
        </UFormField>
        <UFormField label="الزر الثانوي — الرابط">
          <UInput v-model="selected.props.secondaryButton.href" @update:model-value="(v) => update('secondaryButton', { ...selected.props.secondaryButton, href: v })" />
        </UFormField>
        <UFormField label="صورة الخلفية (اختياري)">
          <UInput v-model="selected.props.image" @update:model-value="(v) => update('image', v)" placeholder="https://..." />
        </UFormField>
        <UFormField label="التخطيط">
          <USelect v-model="selected.props.layout" :items="['split-right', 'split-left', 'centered', 'full-bg']" @update:model-value="(v) => update('layout', v)" />
        </UFormField>
        <UFormField label="الخلفية">
          <USelect v-model="selected.props.background" :items="['gradient', 'solid', 'image', 'transparent']" @update:model-value="(v) => update('background', v)" />
        </UFormField>
      </template>

      <!-- === Feature Grid === -->
      <template v-else-if="selected.type === 'feature-grid'">
        <UFormField label="العنوان">
          <UInput v-model="selected.props.title" @update:model-value="(v) => update('title', v)" />
        </UFormField>
        <UFormField label="العنوان الفرعي">
          <UInput v-model="selected.props.subtitle" @update:model-value="(v) => update('subtitle', v)" />
        </UFormField>
        <UFormField label="عدد الأعمدة">
          <UInput v-model="selected.props.columns" type="number" min="1" max="4" @update:model-value="(v) => update('columns', Number(v))" />
        </UFormField>
        <UFormField label="الميزات">
          <div v-for="(f, i) in selected.props.features" :key="i" class="border border-[var(--ui-border)] rounded-lg p-3 mb-2 space-y-2">
            <UInput v-model="f.icon" placeholder="i-lucide-..." @update:model-value="(v) => update('features', [...selected.props.features])" />
            <UInput v-model="f.title" placeholder="العنوان" @update:model-value="(v) => update('features', [...selected.props.features])" />
            <UTextarea v-model="f.description" placeholder="الوصف" :rows="2" @update:model-value="(v) => update('features', [...selected.props.features])" />
            <UButton icon="i-lucide-trash" color="error" variant="ghost" size="xs" @click="selected.props.features.splice(i, 1); update('features', [...selected.props.features])">حذف</UButton>
          </div>
          <UButton icon="i-lucide-plus" variant="outline" size="xs" @click="selected.props.features.push({ icon: 'i-lucide-star', title: 'ميزة', description: 'وصف' }); update('features', [...selected.props.features])">إضافة ميزة</UButton>
        </UFormField>
      </template>

      <!-- === Pricing Card === -->
      <template v-else-if="selected.type === 'pricing-card'">
        <UFormField label="اسم الباقة">
          <UInput v-model="selected.props.name" @update:model-value="(v) => update('name', v)" />
        </UFormField>
        <UFormField label="السعر">
          <UInput v-model="selected.props.price" @update:model-value="(v) => update('price', v)" />
        </UFormField>
        <UFormField label="العملة">
          <UInput v-model="selected.props.currency" @update:model-value="(v) => update('currency', v)" />
        </UFormField>
        <UFormField label="المدة">
          <UInput v-model="selected.props.period" @update:model-value="(v) => update('period', v)" />
        </UFormField>
        <UFormField label="الوصف">
          <UInput v-model="selected.props.description" @update:model-value="(v) => update('description', v)" />
        </UFormField>
        <UFormField label="المميزات (كل سطر)">
          <UTextarea
            :model-value="selected.props.features.join('\n')"
            @update:model-value="(v) => update('features', v.split('\n').filter(Boolean))"
            :rows="5"
          />
        </UFormField>
        <UFormField label="نص الزر">
          <UInput v-model="selected.props.ctaText" @update:model-value="(v) => update('ctaText', v)" />
        </UFormField>
        <UFormField label="رابط الزر">
          <UInput v-model="selected.props.ctaHref" @update:model-value="(v) => update('ctaHref', v)" />
        </UFormField>
        <USwitch v-model="selected.props.featured" @update:model-value="(v) => update('featured', v)" label="مميّزة (الأكثر شعبية)" />
      </template>

      <!-- === Testimonial === -->
      <template v-else-if="selected.type === 'testimonial'">
        <UFormField label="الاقتباس">
          <UTextarea v-model="selected.props.quote" @update:model-value="(v) => update('quote', v)" :rows="4" />
        </UFormField>
        <UFormField label="الاسم">
          <UInput v-model="selected.props.authorName" @update:model-value="(v) => update('authorName', v)" />
        </UFormField>
        <UFormField label="المسمى">
          <UInput v-model="selected.props.authorTitle" @update:model-value="(v) => update('authorTitle', v)" />
        </UFormField>
        <UFormField label="رابط الصورة">
          <UInput v-model="selected.props.authorImage" @update:model-value="(v) => update('authorImage', v)" />
        </UFormField>
        <UFormField label="التقييم">
          <UInput v-model="selected.props.rating" type="number" min="0" max="5" step="0.1" @update:model-value="(v) => update('rating', Number(v))" />
        </UFormField>
      </template>

      <!-- === FAQ === -->
      <template v-else-if="selected.type === 'faq'">
        <UFormField label="العنوان">
          <UInput v-model="selected.props.title" @update:model-value="(v) => update('title', v)" />
        </UFormField>
        <UFormField label="الأسئلة">
          <div v-for="(item, i) in selected.props.items" :key="i" class="border border-[var(--ui-border)] rounded-lg p-3 mb-2 space-y-2">
            <UInput v-model="item.question" placeholder="السؤال" @update:model-value="(v) => update('items', [...selected.props.items])" />
            <UTextarea v-model="item.answer" placeholder="الإجابة" :rows="2" @update:model-value="(v) => update('items', [...selected.props.items])" />
            <UButton icon="i-lucide-trash" color="error" variant="ghost" size="xs" @click="selected.props.items.splice(i, 1); update('items', [...selected.props.items])">حذف</UButton>
          </div>
          <UButton icon="i-lucide-plus" variant="outline" size="xs" @click="selected.props.items.push({ question: 'سؤال؟', answer: 'إجابة.' }); update('items', [...selected.props.items])">إضافة سؤال</UButton>
        </UFormField>
      </template>

      <!-- === CTA === -->
      <template v-else-if="selected.type === 'cta'">
        <UFormField label="العنوان">
          <UInput v-model="selected.props.title" @update:model-value="(v) => update('title', v)" />
        </UFormField>
        <UFormField label="العنوان الفرعي">
          <UInput v-model="selected.props.subtitle" @update:model-value="(v) => update('subtitle', v)" />
        </UFormField>
        <UFormField label="نص الزر">
          <UInput v-model="selected.props.buttonText" @update:model-value="(v) => update('buttonText', v)" />
        </UFormField>
        <UFormField label="رابط الزر">
          <UInput v-model="selected.props.buttonHref" @update:model-value="(v) => update('buttonHref', v)" />
        </UFormField>
        <UFormField label="الخلفية">
          <USelect v-model="selected.props.background" :items="['gradient', 'solid', 'image']" @update:model-value="(v) => update('background', v)" />
        </UFormField>
      </template>

      <!-- === Stats === -->
      <template v-else-if="selected.type === 'stats'">
        <UFormField label="الإحصائيات">
          <div v-for="(item, i) in selected.props.items" :key="i" class="border border-[var(--ui-border)] rounded-lg p-3 mb-2 space-y-2">
            <UInput v-model="item.value" placeholder="القيمة" @update:model-value="(v) => update('items', [...selected.props.items])" />
            <UInput v-model="item.label" placeholder="التسمية" @update:model-value="(v) => update('items', [...selected.props.items])" />
            <UButton icon="i-lucide-trash" color="error" variant="ghost" size="xs" @click="selected.props.items.splice(i, 1); update('items', [...selected.props.items])">حذف</UButton>
          </div>
          <UButton icon="i-lucide-plus" variant="outline" size="xs" @click="selected.props.items.push({ value: '0+', label: 'تسمية' }); update('items', [...selected.props.items])">إضافة</UButton>
        </UFormField>
      </template>

      <!-- === Course Card === -->
      <template v-else-if="selected.type === 'course-card'">
        <UFormField label="العنوان">
          <UInput v-model="selected.props.title" @update:model-value="(v) => update('title', v)" />
        </UFormField>
        <UFormField label="المدرّس">
          <UInput v-model="selected.props.instructor" @update:model-value="(v) => update('instructor', v)" />
        </UFormField>
        <UFormField label="السعر">
          <UInput v-model="selected.props.price" @update:model-value="(v) => update('price', v)" />
        </UFormField>
        <UFormField label="العملة">
          <UInput v-model="selected.props.currency" @update:model-value="(v) => update('currency', v)" />
        </UFormField>
        <UFormField label="الرابط">
          <UInput v-model="selected.props.href" @update:model-value="(v) => update('href', v)" />
        </UFormField>
        <UFormField label="التقييم">
          <UInput v-model="selected.props.rating" type="number" min="0" max="5" step="0.1" @update:model-value="(v) => update('rating', Number(v))" />
        </UFormField>
        <UFormField label="عدد الطلاب">
          <UInput v-model="selected.props.students" type="number" @update:model-value="(v) => update('students', Number(v))" />
        </UFormField>
        <UFormField label="المدة">
          <UInput v-model="selected.props.duration" @update:model-value="(v) => update('duration', v)" />
        </UFormField>
        <UFormField label="صورة">
          <UInput v-model="selected.props.image" @update:model-value="(v) => update('image', v)" />
        </UFormField>
      </template>

      <!-- === Course Grid === -->
      <template v-else-if="selected.type === 'course-grid'">
        <UFormField label="العنوان">
          <UInput v-model="selected.props.title" @update:model-value="(v) => update('title', v)" />
        </UFormField>
        <UFormField label="عدد الكورسات">
          <UInput v-model="selected.props.limit" type="number" min="1" max="24" @update:model-value="(v) => update('limit', Number(v))" />
        </UFormField>
        <UFormField label="API endpoint">
          <UInput v-model="selected.props.apiUrl" @update:model-value="(v) => update('apiUrl', v)" />
        </UFormField>
      </template>

      <!-- === Instructor Card === -->
      <template v-else-if="selected.type === 'instructor-card'">
        <UFormField label="الاسم">
          <UInput v-model="selected.props.name" @update:model-value="(v) => update('name', v)" />
        </UFormField>
        <UFormField label="المسمى">
          <UInput v-model="selected.props.title" @update:model-value="(v) => update('title', v)" />
        </UFormField>
        <UFormField label="السيرة">
          <UTextarea v-model="selected.props.bio" @update:model-value="(v) => update('bio', v)" :rows="3" />
        </UFormField>
        <UFormField label="الصورة">
          <UInput v-model="selected.props.image" @update:model-value="(v) => update('image', v)" />
        </UFormField>
      </template>

      <!-- === Signup Form === -->
      <template v-else-if="selected.type === 'signup-form'">
        <UFormField label="العنوان">
          <UInput v-model="selected.props.title" @update:model-value="(v) => update('title', v)" />
        </UFormField>
        <UFormField label="العنوان الفرعي">
          <UInput v-model="selected.props.subtitle" @update:model-value="(v) => update('subtitle', v)" />
        </UFormField>
        <UFormField label="نص الزر">
          <UInput v-model="selected.props.buttonText" @update:model-value="(v) => update('buttonText', v)" />
        </UFormField>
        <UFormField label="API endpoint">
          <UInput v-model="selected.props.apiEndpoint" @update:model-value="(v) => update('apiEndpoint', v)" />
        </UFormField>
      </template>

      <!-- === Container === -->
      <template v-else-if="selected.type === 'container'">
        <UFormField label="العرض الأقصى">
          <USelect v-model="selected.props.maxWidth" :items="['sm', 'md', 'lg', 'xl', 'full']" @update:model-value="(v) => update('maxWidth', v)" />
        </UFormField>
        <UFormField label="مسافة أفقية">
          <USelect v-model="selected.props.paddingX" :items="['none', 'sm', 'md', 'lg', 'xl', '2xl']" @update:model-value="(v) => update('paddingX', v)" />
        </UFormField>
        <UFormField label="مسافة عمودية">
          <USelect v-model="selected.props.paddingY" :items="['none', 'sm', 'md', 'lg', 'xl', '2xl']" @update:model-value="(v) => update('paddingY', v)" />
        </UFormField>
        <UFormField label="الخلفية">
          <USelect v-model="selected.props.background" :items="['transparent', 'surface', 'surface-elevated', 'primary', 'secondary']" @update:model-value="(v) => update('background', v)" />
        </UFormField>
        <UFormField label="المسافة بين العناصر">
          <USelect v-model="selected.props.gap" :items="['none', 'sm', 'md', 'lg', 'xl', '2xl']" @update:model-value="(v) => update('gap', v)" />
        </UFormField>
      </template>

      <!-- === Grid === -->
      <template v-else-if="selected.type === 'grid'">
        <UFormField label="أعمدة (ديسكتوب)">
          <UInput v-model="selected.props.columns" type="number" min="1" max="6" @update:model-value="(v) => update('columns', Number(v))" />
        </UFormField>
        <UFormField label="أعمدة (تابلت)">
          <UInput v-model="selected.props.columnsTablet" type="number" min="1" max="4" @update:model-value="(v) => update('columnsTablet', Number(v))" />
        </UFormField>
        <UFormField label="أعمدة (موبايل)">
          <UInput v-model="selected.props.columnsMobile" type="number" min="1" max="2" @update:model-value="(v) => update('columnsMobile', Number(v))" />
        </UFormField>
        <UFormField label="المسافة">
          <USelect v-model="selected.props.gap" :items="['none', 'sm', 'md', 'lg', 'xl', '2xl']" @update:model-value="(v) => update('gap', v)" />
        </UFormField>
      </template>

      <!-- === Columns === -->
      <template v-else-if="selected.type === 'columns'">
        <UFormField label="التخطيط">
          <USelect v-model="selected.props.layout" :items="['1-1', '1-2', '2-1', '1-3', '3-1', '1-1-1']" @update:model-value="(v) => update('layout', v)" />
        </UFormField>
        <UFormField label="المسافة">
          <USelect v-model="selected.props.gap" :items="['none', 'sm', 'md', 'lg', 'xl', '2xl']" @update:model-value="(v) => update('gap', v)" />
        </UFormField>
        <USwitch v-model="selected.props.stackOnMobile" @update:model-value="(v) => update('stackOnMobile', v)" label="تكديس على الموبايل" />
      </template>

      <!-- === Divider === -->
      <template v-else-if="selected.type === 'divider'">
        <UFormField label="النمط">
          <USelect v-model="selected.props.style" :items="['solid', 'dashed', 'dotted', 'gradient']" @update:model-value="(v) => update('style', v)" />
        </UFormField>
        <UFormField label="اللون">
          <USelect v-model="selected.props.color" :items="['border', 'primary', 'secondary']" @update:model-value="(v) => update('color', v)" />
        </UFormField>
        <UFormField label="السماكة">
          <USelect v-model="selected.props.width" :items="['sm', 'md', 'lg']" @update:model-value="(v) => update('width', v)" />
        </UFormField>
      </template>

      <!-- === Spacer === -->
      <template v-else-if="selected.type === 'spacer'">
        <UFormField label="الحجم">
          <USelect v-model="selected.props.size" :items="['sm', 'md', 'lg', 'xl', '2xl', '3xl']" @update:model-value="(v) => update('size', v)" />
        </UFormField>
      </template>

      <!-- === Custom HTML === -->
      <template v-else-if="selected.type === 'custom-html'">
        <UFormField label="كود HTML">
          <UTextarea v-model="selected.props.html" @update:model-value="(v) => update('html', v)" :rows="12" class="font-mono text-xs" dir="ltr" />
        </UFormField>
        <UFormField label="الارتفاع (px)">
          <UInput v-model="selected.props.height" type="number" min="50" max="2000" @update:model-value="(v) => update('height', Number(v))" />
        </UFormField>
        <UAlert
          icon="i-lucide-shield-alert"
          color="warning"
          variant="subtle"
          title="يعمل في sandbox معزول"
          description="الكود ده بيشتغل في iframe معزول تماماً — لا وصول للكوكيز، لا للـ storage، لا للصفحة المضيفة."
        />
      </template>

      <!-- === Code Block === -->
      <template v-else-if="selected.type === 'code-block'">
        <UFormField label="الكود">
          <UTextarea v-model="selected.props.code" @update:model-value="(v) => update('code', v)" :rows="8" class="font-mono text-xs" dir="ltr" />
        </UFormField>
        <UFormField label="اللغة">
          <UInput v-model="selected.props.language" @update:model-value="(v) => update('language', v)" placeholder="javascript" />
        </UFormField>
        <USwitch v-model="selected.props.showLineNumbers" @update:model-value="(v) => update('showLineNumbers', v)" label="إظهار أرقام الأسطر" />
      </template>

      <!-- === Common: Responsive + Advanced === -->
      <USeparator label="إعدادات متقدمة" />
      <UFormField label="إظهار على">
        <div class="flex gap-2">
          <UButton
            :variant="selected.visibility.mobile ? 'solid' : 'outline'"
            color="neutral"
            size="xs"
            @click="store.setBlockVisibility(selected.id, { mobile: !selected.visibility.mobile })"
            class="flex-1"
            icon="i-lucide-smartphone"
          >موبايل</UButton>
          <UButton
            :variant="selected.visibility.tablet ? 'solid' : 'outline'"
            color="neutral"
            size="xs"
            @click="store.setBlockVisibility(selected.id, { tablet: !selected.visibility.tablet })"
            class="flex-1"
            icon="i-lucide-tablet"
          >تابلت</UButton>
          <UButton
            :variant="selected.visibility.desktop ? 'solid' : 'outline'"
            color="neutral"
            size="xs"
            @click="store.setBlockVisibility(selected.id, { desktop: !selected.visibility.desktop })"
            class="flex-1"
            icon="i-lucide-monitor"
          >ديسكتوب</UButton>
        </div>
      </UFormField>
      <UFormField label="CSS class مخصص">
        <UInput
          :model-value="selected.advanced?.customClass || ''"
          @update:model-value="(v) => store.setBlockAdvanced(selected.id, { customClass: v })"
          placeholder="my-class"
        />
      </UFormField>
      <UFormField label="CSS style مخصص">
        <UInput
          :model-value="selected.advanced?.customStyle || ''"
          @update:model-value="(v) => store.setBlockAdvanced(selected.id, { customStyle: v })"
          placeholder="margin-top: 10px"
        />
      </UFormField>
      <UFormField label="HTML ID مخصص">
        <UInput
          :model-value="selected.advanced?.customId || ''"
          @update:model-value="(v) => store.setBlockAdvanced(selected.id, { customId: v })"
          placeholder="my-section"
        />
      </UFormField>
    </div>

    <!-- Asset picker modal -->
    <UModal v-model:open="assetPickerOpen">
      <template #content>
        <div class="p-4">
          <h3 class="font-bold mb-3">مكتبة الوسائط</h3>
          <div v-if="!assets.length" class="text-center text-[var(--ui-text-muted)] py-8">
            لا توجد صور بعد. ارفع بعض الصور.
          </div>
          <div v-else class="grid grid-cols-3 gap-2">
            <button
              v-for="a in assets"
              :key="a.id"
              @click="pickAsset(a)"
              class="aspect-square rounded-lg overflow-hidden border border-[var(--ui-border)] hover:border-[var(--t-color-primary)]"
            >
              <img :src="a.url" :alt="a.name" class="w-full h-full object-cover">
            </button>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
