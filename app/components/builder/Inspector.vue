<script setup lang="ts">
import { computed } from 'vue'
import { useBuilderStore } from '~/stores/builder'
import { blockDefinitions } from '~/utils/blocks'

const store = useBuilderStore()
const selected = computed(() => store.selectedBlock)
const def = computed(() => selected.value ? blockDefinitions[selected.value.type as keyof typeof blockDefinitions] : null)

const update = (key: string, val: any) => {
  if (selected.value) store.updateBlockProps(selected.value.id, { [key]: val })
}

const onUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  const fd = new FormData()
  fd.append('file', input.files[0])
  try {
    const res = await $fetch('/api/assets', { method: 'POST', body: fd }) as any
    update('src', res.url)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="px-3 py-2 border-b border-[var(--border)] flex items-center justify-between">
      <h3 class="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">الخصائص</h3>
      <div v-if="selected" class="flex gap-0.5">
        <button
          @click="store.duplicateBlock(selected.id)"
          class="p-1 rounded hover:bg-[var(--surface-2)] text-[var(--text-muted)]"
          title="تكرار"
        >
          <UIcon name="i-lucide-copy" class="text-sm" />
        </button>
        <button
          @click="store.removeBlock(selected.id)"
          class="p-1 rounded hover:bg-red-500/10 text-red-400"
          title="حذف"
        >
          <UIcon name="i-lucide-trash-2" class="text-sm" />
        </button>
      </div>
    </div>

    <div v-if="!selected" class="flex-1 flex items-center justify-center text-center p-4">
      <div>
        <UIcon name="i-lucide-mouse-pointer-2" class="text-2xl text-[var(--text-subtle)] mb-2" />
        <p class="text-xs text-[var(--text-muted)]">اختر عنصرًا لتعديل خصائصه</p>
      </div>
    </div>

    <div v-else class="flex-1 overflow-y-auto p-3 space-y-3">
      <div class="text-xs text-[var(--text-subtle)] flex items-center gap-1.5 pb-2 border-b border-[var(--border)]">
        <UIcon :name="def?.icon" />
        <span>{{ def?.label }}</span>
      </div>

      <!-- ===== Text-based fields ===== -->
      <template v-if="selected.props.text !== undefined">
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">النص</label>
          <UTextarea :model-value="selected.props.text" @update:model-value="(v: any) => update('text', v)" :rows="2" class="w-full" />
        </div>
      </template>

      <template v-if="selected.props.content !== undefined">
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">المحتوى</label>
          <UTextarea :model-value="selected.props.content" @update:model-value="(v: any) => update('content', v)" :rows="4" class="w-full" />
        </div>
      </template>

      <template v-if="selected.props.title !== undefined">
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">العنوان</label>
          <UInput :model-value="selected.props.title" @update:model-value="(v: any) => update('title', v)" class="w-full" />
        </div>
      </template>

      <template v-if="selected.props.subtitle !== undefined">
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">العنوان الفرعي</label>
          <UInput :model-value="selected.props.subtitle" @update:model-value="(v: any) => update('subtitle', v)" class="w-full" />
        </div>
      </template>

      <template v-if="selected.props.eyebrow !== undefined">
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">نص فوق العنوان</label>
          <UInput :model-value="selected.props.eyebrow" @update:model-value="(v: any) => update('eyebrow', v)" class="w-full" />
        </div>
      </template>

      <!-- ===== Level (heading) ===== -->
      <template v-if="selected.props.level !== undefined">
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">المستوى</label>
          <USelect :model-value="selected.props.level" @update:model-value="(v: any) => update('level', Number(v))"
            :items="[{label: 'H1', value: 1}, {label: 'H2', value: 2}, {label: 'H3', value: 3}, {label: 'H4', value: 4}]" />
        </div>
      </template>

      <!-- ===== Align ===== -->
      <template v-if="selected.props.align !== undefined">
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">المحاذاة</label>
          <div class="flex gap-1">
            <button v-for="a in ['right', 'center', 'left']" :key="a"
              @click="update('align', a)"
              :class="['flex-1 py-1.5 rounded text-xs border', selected.props.align === a ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]' : 'border-[var(--border)]']">
              <UIcon :name="`i-lucide-align-${a}`" />
            </button>
          </div>
        </div>
      </template>

      <!-- ===== Image ===== -->
      <template v-if="selected.props.src !== undefined">
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">رابط الصورة</label>
          <UInput :model-value="selected.props.src" @update:model-value="(v: any) => update('src', v)" placeholder="https://..." class="w-full" />
        </div>
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">أو ارفع صورة</label>
          <label class="block cursor-pointer">
            <div class="border border-[var(--border)] rounded px-3 py-2 text-xs text-center hover:border-[var(--accent)]">
              <UIcon name="i-lucide-upload" class="ml-1" /> اختر ملف
            </div>
            <input type="file" accept="image/*" class="hidden" @change="onUpload">
          </label>
        </div>
        <div v-if="selected.props.alt !== undefined">
          <label class="block text-xs text-[var(--text-muted)] mb-1">النص البديل</label>
          <UInput :model-value="selected.props.alt" @update:model-value="(v: any) => update('alt', v)" class="w-full" />
        </div>
      </template>

      <!-- ===== Button ===== -->
      <template v-if="selected.props.href !== undefined && selected.type === 'button'">
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">الرابط</label>
          <UInput :model-value="selected.props.href" @update:model-value="(v: any) => update('href', v)" class="w-full" />
        </div>
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">النمط</label>
          <USelect :model-value="selected.props.variant" @update:model-value="(v: any) => update('variant', v)"
            :items="['primary', 'secondary', 'outline', 'ghost']" />
        </div>
      </template>

      <!-- ===== Hero buttons ===== -->
      <template v-if="selected.type === 'hero'">
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">نص الزر الأساسي</label>
          <UInput :model-value="selected.props.primaryButton?.text" @update:model-value="(v: any) => update('primaryButton', { ...selected.props.primaryButton, text: v })" class="w-full" />
        </div>
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">رابط الزر الأساسي</label>
          <UInput :model-value="selected.props.primaryButton?.href" @update:model-value="(v: any) => update('primaryButton', { ...selected.props.primaryButton, href: v })" class="w-full" />
        </div>
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">نص الزر الثانوي</label>
          <UInput :model-value="selected.props.secondaryButton?.text" @update:model-value="(v: any) => update('secondaryButton', { ...selected.props.secondaryButton, text: v })" class="w-full" />
        </div>
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">التخطيط</label>
          <USelect :model-value="selected.props.layout" @update:model-value="(v: any) => update('layout', v)"
            :items="['centered', 'split-right', 'split-left']" />
        </div>
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">الخلفية</label>
          <USelect :model-value="selected.props.background" @update:model-value="(v: any) => update('background', v)"
            :items="['light', 'dark', 'accent']" />
        </div>
      </template>

      <!-- ===== Custom code ===== -->
      <template v-if="selected.type === 'custom-code'">
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">HTML</label>
          <UTextarea :model-value="selected.props.html" @update:model-value="(v: any) => update('html', v)" :rows="8" class="w-full font-mono text-xs" dir="ltr" />
        </div>
        <div class="text-xs text-[var(--text-subtle)] p-2 rounded bg-[var(--surface-2)]">
          <UIcon name="i-lucide-shield" class="ml-1" />
          يعمل في sandbox معزول — لا وصول للصفحة المضيفة
        </div>
      </template>

      <!-- ===== PaddingY (most composed blocks) ===== -->
      <template v-if="selected.props.paddingY !== undefined">
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">المسافة العمودية</label>
          <USelect :model-value="selected.props.paddingY" @update:model-value="(v: any) => update('paddingY', v)"
            :items="['none', 'sm', 'md', 'lg', 'xl', '2xl']" />
        </div>
      </template>

      <!-- ===== Visibility ===== -->
      <div class="pt-3 border-t border-[var(--border)]">
        <label class="block text-xs text-[var(--text-muted)] mb-1.5">إظهار على</label>
        <div class="flex gap-1">
          <button v-for="d in ['mobile', 'tablet', 'desktop']" :key="d"
            @click="store.setVisibility(selected.id, { [d]: !selected.visibility[d as keyof typeof selected.visibility] })"
            :class="['flex-1 py-1.5 rounded text-xs border', selected.visibility[d as keyof typeof selected.visibility] ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-subtle)]']">
            <UIcon :name="`i-lucide-${d === 'mobile' ? 'smartphone' : d === 'tablet' ? 'tablet' : 'monitor'}`" />
          </button>
        </div>
      </div>

      <!-- ===== Advanced ===== -->
      <div v-if="store.advancedMode" class="pt-3 border-t border-[var(--border)] space-y-2">
        <p class="text-xs font-semibold text-[var(--accent)]">متقدم</p>
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">CSS class</label>
          <UInput :model-value="selected.advanced?.customClass || ''"
            @update:model-value="(v: any) => store.setAdvanced(selected.id, { customClass: v })" class="w-full" />
        </div>
        <div>
          <label class="block text-xs text-[var(--text-muted)] mb-1">HTML ID</label>
          <UInput :model-value="selected.advanced?.customId || ''"
            @update:model-value="(v: any) => store.setAdvanced(selected.id, { customId: v })" class="w-full" />
        </div>
      </div>
    </div>
  </div>
</template>
