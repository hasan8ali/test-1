<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Subscript, Superscript,
  Heading1, Heading2, Heading3, Heading4,
  List, ListOrdered, ListChecks, AlignRight, AlignCenter, AlignLeft, AlignJustify,
  Quote, Code, Code2, Minus, Link as LinkIcon, Image as ImageIcon, Table as TableIcon,
  Palette, Highlighter, Type, Baseline,
  Undo2, Redo2, Eraser,
  ChevronDown, Check
} from 'lucide-vue-next'

const props = defineProps<{ editor: any; dark: boolean }>()
const emit = defineEmits<{
  'toggle-dark': []
}>()

const editor = computed(() => props.editor as Editor | null)

/* ---------- Helpers ---------- */
const active = (name: string, attrs?: Record<string, any>) => {
  if (!editor.value) return false
  return attrs ? editor.value.isActive(name, attrs) : editor.value.isActive(name)
}

const run = (fn: () => void) => () => {
  if (editor.value) {
    fn()
    editor.value.chain().focus().run()
  }
}

/* ---------- Dropdowns state ---------- */
const openDropdown = ref<string | null>(null)
const toggleDropdown = (name: string) => {
  openDropdown.value = openDropdown.value === name ? null : name
}
watch(
  () => editor.value,
  () => { openDropdown.value = null },
  { deep: true }
)

/* ---------- Heading options ---------- */
const headingLevels = [
  { level: 0, label: 'نص عادي', icon: Type },
  { level: 1, label: 'عنوان رئيسي H1', icon: Heading1 },
  { level: 2, label: 'عنوان فرعي H2', icon: Heading2 },
  { level: 3, label: 'عنوان صغير H3', icon: Heading3 },
  { level: 4, label: 'عنوان دقيق H4', icon: Heading4 }
]
const setHeading = (level: number) =>
  run(() => {
    if (level === 0) editor.value?.chain().setParagraph().run()
    else editor.value?.chain().setHeading({ level: level as any }).run()
  })()
const currentHeadingLabel = computed(() => {
  if (!editor.value) return 'نص عادي'
  for (const h of headingLevels.slice(1)) {
    if (editor.value.isActive('heading', { level: h.level })) return h.label
  }
  return 'نص عادي'
})

/* ---------- Font family ---------- */
const fontFamilies = [
  { value: 'Cairo', label: 'Cairo (عصري)' },
  { value: 'Tajawal', label: 'Tajawal (بسيط)' },
  { value: 'Amiri', label: 'Amiri (كلاسيكي)' },
  { value: 'Inter', label: 'Inter (لاتيني)' },
  { value: 'Georgia, serif', label: 'Georgia (سيريف)' },
  { value: 'ui-monospace, monospace', label: 'Monospace (أكواد)' },
  { value: 'system-ui, sans-serif', label: 'System (افتراضي)' }
]
const setFont = (val: string) =>
  run(() => editor.value?.chain().setMark('textStyle', { fontFamily: val }).run())()

/* ---------- Font size ---------- */
const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '40px', '48px']
const setFontSize = (size: string) =>
  run(() => editor.value?.chain().setMark('textStyle', { fontSize: size }).run())()

/* ---------- Text color ---------- */
const colorPalette = [
  '#1f2937', '#374151', '#6b7280', '#9ca3af',
  '#dc2626', '#ea580c', '#d97706', '#ca8a04',
  '#16a34a', '#15803d', '#0891b2', '#0e7490',
  '#2563eb', '#1d4ed8', '#7c3aed', '#9333ea',
  '#db2777', '#be185d', '#ffffff', '#000000'
]
const setTextColor = (color: string) =>
  run(() => editor.value?.chain().setColor(color).run())()

/* ---------- Highlight ---------- */
const highlightColors = [
  '#fef08a', '#fde68a', '#fbcfe8', '#fbcfe8',
  '#bbf7d0', '#bfdbfe', '#ddd6fe', '#fed7aa',
  '#fecaca', '#e0e7ff', '#d1fae5', '#fef3c7'
]
const setHighlight = (color: string) =>
  run(() => editor.value?.chain().setHighlight({ color }).run())()
const unsetHighlight = () =>
  run(() => editor.value?.chain().unsetHighlight().run())()

/* ---------- Link ---------- */
const linkModalOpen = ref(false)
const linkUrl = ref('')
const openLinkModal = () => {
  if (!editor.value) return
  const prev = editor.value.getAttributes('link').href
  linkUrl.value = prev || 'https://'
  linkModalOpen.value = true
}
const applyLink = () => {
  if (!editor.value) return
  const url = linkUrl.value.trim()
  if (!url) {
    editor.value.chain().extendMarkRange('link').unsetLink().focus().run()
  } else {
    editor.value.chain().extendMarkRange('link').setLink({ href: url }).focus().run()
  }
  linkModalOpen.value = false
}
const unlink = () => run(() => editor.value?.chain().unsetLink().run())()

/* ---------- Image ---------- */
const imageModalOpen = ref(false)
const imageUrl = ref('')
const openImageModal = () => {
  imageUrl.value = ''
  imageModalOpen.value = true
}
const applyImage = () => {
  if (!editor.value || !imageUrl.value.trim()) {
    imageModalOpen.value = false
    return
  }
  editor.value.chain().focus().setImage({ src: imageUrl.value.trim() }).run()
  imageModalOpen.value = false
}
const onImageFile = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || !editor.value) return
  const reader = new FileReader()
  reader.onload = () => {
    editor.value?.chain().focus().setImage({ src: reader.result as string }).run()
  }
  reader.readAsDataURL(file)
}

/* ---------- Table ---------- */
const insertTable = () =>
  run(() =>
    editor.value?.chain()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run()
  )()

/* ---------- Eraser ---------- */
const clearFormat = () =>
  run(() =>
    editor.value?.chain().clearNodes().unsetAllMarks().run()
  )()
</script>

<template>
  <div class="toolbar-wrapper">
    <!-- Main toolbar -->
    <div class="toolbar">
      <!-- History group -->
      <div class="group">
        <button class="tb-btn" :disabled="!editor?.can().undo()" @click="run(() => editor?.chain().undo().run())" title="تراجع (Ctrl+Z)">
          <Undo2 :size="18" />
        </button>
        <button class="tb-btn" :disabled="!editor?.can().redo()" @click="run(() => editor?.chain().redo().run())" title="إعادة (Ctrl+Y)">
          <Redo2 :size="18" />
        </button>
      </div>

      <div class="sep" />

      <!-- Heading dropdown -->
      <div class="dropdown">
        <button class="tb-btn wide" @click="toggleDropdown('heading')">
          <span class="text-sm truncate" style="max-width: 130px;">{{ currentHeadingLabel }}</span>
          <ChevronDown :size="14" />
        </button>
        <div v-if="openDropdown === 'heading'" class="dropdown-menu wide">
          <button v-for="h in headingLevels" :key="h.level" class="menu-item" @click="setHeading(h.level)">
            <component :is="h.icon" :size="18" />
            <span>{{ h.label }}</span>
            <Check v-if="h.level === 0 ? !active('heading') : active('heading', { level: h.level })" :size="16" class="ms-auto" />
          </button>
        </div>
      </div>

      <!-- Font family dropdown -->
      <div class="dropdown">
        <button class="tb-btn wide" @click="toggleDropdown('font')" title="نوع الخط">
          <Type :size="16" />
          <span class="text-sm truncate" style="max-width: 110px;">خط</span>
          <ChevronDown :size="14" />
        </button>
        <div v-if="openDropdown === 'font'" class="dropdown-menu wide">
          <button v-for="f in fontFamilies" :key="f.value" class="menu-item" @click="setFont(f.value)">
            <span :style="{ fontFamily: f.value }" class="text-sm">Aa أبجد</span>
            <span class="text-sm">{{ f.label }}</span>
          </button>
        </div>
      </div>

      <!-- Font size dropdown -->
      <div class="dropdown">
        <button class="tb-btn" @click="toggleDropdown('size')" title="حجم الخط">
          <Baseline :size="16" />
          <ChevronDown :size="14" />
        </button>
        <div v-if="openDropdown === 'size'" class="dropdown-menu">
          <button v-for="s in fontSizes" :key="s" class="menu-item justify-center" @click="setFontSize(s)">
            <span :style="{ fontSize: s }">{{ s }}</span>
          </button>
        </div>
      </div>

      <div class="sep" />

      <!-- Inline formatting -->
      <div class="group">
        <button class="tb-btn" :class="{ active: active('bold') }" @click="run(() => editor?.chain().toggleBold().run())" title="عريض (Ctrl+B)">
          <Bold :size="18" />
        </button>
        <button class="tb-btn" :class="{ active: active('italic') }" @click="run(() => editor?.chain().toggleItalic().run())" title="مائل (Ctrl+I)">
          <Italic :size="18" />
        </button>
        <button class="tb-btn" :class="{ active: active('underline') }" @click="run(() => editor?.chain().toggleUnderline().run())" title="تسطير (Ctrl+U)">
          <UnderlineIcon :size="18" />
        </button>
        <button class="tb-btn" :class="{ active: active('strike') }" @click="run(() => editor?.chain().toggleStrike().run())" title="خط في النص">
          <Strikethrough :size="18" />
        </button>
        <button class="tb-btn" :class="{ active: active('subscript') }" @click="run(() => editor?.chain().toggleSubscript().run())" title="منخفض">
          <Subscript :size="18" />
        </button>
        <button class="tb-btn" :class="{ active: active('superscript') }" @click="run(() => editor?.chain().toggleSuperscript().run())" title="مرتفع">
          <Superscript :size="18" />
        </button>
      </div>

      <!-- Color dropdowns -->
      <div class="dropdown">
        <button class="tb-btn" @click="toggleDropdown('color')" title="لون النص">
          <Palette :size="16" />
          <ChevronDown :size="14" />
        </button>
        <div v-if="openDropdown === 'color'" class="dropdown-menu wide">
          <div class="color-grid">
            <button v-for="c in colorPalette" :key="c" class="color-swatch" :style="{ background: c }" @click="setTextColor(c)" />
          </div>
        </div>
      </div>

      <div class="dropdown">
        <button class="tb-btn" @click="toggleDropdown('highlight')" title="تظليل">
          <Highlighter :size="16" />
          <ChevronDown :size="14" />
        </button>
        <div v-if="openDropdown === 'highlight'" class="dropdown-menu wide">
          <div class="color-grid">
            <button v-for="c in highlightColors" :key="c" class="color-swatch" :style="{ background: c }" @click="setHighlight(c)" />
          </div>
          <button class="menu-item mt-2" @click="unsetHighlight">
            <Eraser :size="16" />
            <span>إزالة التظليل</span>
          </button>
        </div>
      </div>

      <div class="sep" />

      <!-- Lists & alignment -->
      <div class="group">
        <button class="tb-btn" :class="{ active: active('bulletList') }" @click="run(() => editor?.chain().toggleBulletList().run())" title="قائمة نقطية">
          <List :size="18" />
        </button>
        <button class="tb-btn" :class="{ active: active('orderedList') }" @click="run(() => editor?.chain().toggleOrderedList().run())" title="قائمة رقمية">
          <ListOrdered :size="18" />
        </button>
        <button class="tb-btn" :class="{ active: active('taskList') }" @click="run(() => editor?.chain().toggleTaskList().run())" title="قائمة مهام">
          <ListChecks :size="18" />
        </button>
      </div>

      <div class="group">
        <button class="tb-btn" :class="{ active: active({ textAlign: 'right' }) }" @click="run(() => editor?.chain().setTextAlign('right').run())" title="محاذاة لليمين">
          <AlignRight :size="18" />
        </button>
        <button class="tb-btn" :class="{ active: active({ textAlign: 'center' }) }" @click="run(() => editor?.chain().setTextAlign('center').run())" title="توسيط">
          <AlignCenter :size="18" />
        </button>
        <button class="tb-btn" :class="{ active: active({ textAlign: 'left' }) }" @click="run(() => editor?.chain().setTextAlign('left').run())" title="محاذاة لليسار">
          <AlignLeft :size="18" />
        </button>
        <button class="tb-btn" :class="{ active: active({ textAlign: 'justify' }) }" @click="run(() => editor?.chain().setTextAlign('justify').run())" title="ضبط">
          <AlignJustify :size="18" />
        </button>
      </div>

      <div class="sep" />

      <!-- Insert group -->
      <div class="group">
        <button class="tb-btn" :class="{ active: active('blockquote') }" @click="run(() => editor?.chain().toggleBlockquote().run())" title="اقتباس">
          <Quote :size="18" />
        </button>
        <button class="tb-btn" :class="{ active: active('code') }" @click="run(() => editor?.chain().toggleCode().run())" title="كود">
          <Code :size="18" />
        </button>
        <button class="tb-btn" :class="{ active: active('codeBlock') }" @click="run(() => editor?.chain().toggleCodeBlock().run())" title="بلوك كود">
          <Code2 :size="18" />
        </button>
        <button class="tb-btn" @click="run(() => editor?.chain().setHorizontalRule().run())" title="خط فاصل">
          <Minus :size="18" />
        </button>
        <button class="tb-btn" @click="openLinkModal" :class="{ active: active('link') }" title="رابط">
          <LinkIcon :size="18" />
        </button>
        <button class="tb-btn" @click="openImageModal" title="صورة">
          <ImageIcon :size="18" />
        </button>
        <button class="tb-btn" @click="insertTable" title="جدول">
          <TableIcon :size="18" />
        </button>
      </div>

      <div class="sep" />

      <!-- Clear -->
      <button class="tb-btn" @click="clearFormat" title="مسح التنسيق">
        <Eraser :size="18" />
      </button>
    </div>

    <!-- ===== Modals ===== -->
    <Teleport to="body">
      <!-- Link modal -->
      <div v-if="linkModalOpen" class="modal-backdrop" @click.self="linkModalOpen = false">
        <div class="modal">
          <h3 class="text-lg font-bold mb-3">إدراج / تعديل رابط</h3>
          <input
            v-model="linkUrl"
            type="url"
            class="input"
            placeholder="https://example.com"
            @keyup.enter="applyLink"
            autofocus
          />
          <div class="modal-actions">
            <button v-if="active('link')" class="btn-secondary" @click="unlink(); linkModalOpen = false">إزالة الرابط</button>
            <button class="btn-primary" @click="applyLink">حفظ</button>
            <button class="btn-ghost" @click="linkModalOpen = false">إلغاء</button>
          </div>
        </div>
      </div>

      <!-- Image modal -->
      <div v-if="imageModalOpen" class="modal-backdrop" @click.self="imageModalOpen = false">
        <div class="modal">
          <h3 class="text-lg font-bold mb-3">إدراج صورة</h3>
          <input
            v-model="imageUrl"
            type="url"
            class="input"
            placeholder="https://example.com/image.jpg"
            @keyup.enter="applyImage"
            autofocus
          />
          <p class="text-sm text-[var(--color-muted)] my-2">أو رفع صورة من الجهاز:</p>
          <input type="file" accept="image/*" @change="onImageFile" class="input" />
          <div class="modal-actions">
            <button class="btn-primary" @click="applyImage">إدراج</button>
            <button class="btn-ghost" @click="imageModalOpen = false">إلغاء</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.toolbar-wrapper { position: relative; }

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 20;
}

.group { display: flex; gap: 2px; padding: 2px; border-radius: 8px; }
.group:hover { background: rgba(120,120,130,0.06); }

.sep { width: 1px; height: 28px; background: var(--color-border); margin: 0 4px; }

.tb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 36px;
  min-width: 36px;
  padding: 0 8px;
  border: 0;
  background: transparent;
  color: var(--color-text);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}
.tb-btn:hover:not(:disabled) { background: rgba(120,120,130,0.1); }
.tb-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.tb-btn.active {
  background: var(--color-brand-soft);
  color: var(--color-brand);
}
.tb-btn.wide { padding: 0 10px; }

.dropdown { position: relative; }

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 12px 32px -8px rgba(0,0,0,0.18), 0 4px 12px -4px rgba(0,0,0,0.08);
  padding: 6px;
  z-index: 50;
  min-width: 200px;
  max-height: 360px;
  overflow-y: auto;
  animation: pop 0.12s ease;
}
.dropdown-menu.wide { min-width: 240px; }

@keyframes pop {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  width: 100%;
  border: 0;
  background: transparent;
  color: var(--color-text);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  text-align: right;
}
.menu-item:hover { background: rgba(120,120,130,0.08); }

.color-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  padding: 6px;
}

.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid rgba(120,120,130,0.25);
  cursor: pointer;
  transition: transform 0.1s;
}
.color-swatch:hover { transform: scale(1.15); }

/* Modals */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fade 0.15s ease;
}
.modal {
  background: var(--color-surface);
  border-radius: 16px;
  padding: 24px;
  width: 92%;
  max-width: 480px;
  box-shadow: 0 24px 48px -16px rgba(0,0,0,0.3);
  animation: pop 0.18s ease;
}
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }

.input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  border-radius: 10px;
  font-family: inherit;
  font-size: 14px;
  outline: none;
}
.input:focus { border-color: var(--color-brand); }

.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
}
.btn-primary, .btn-secondary, .btn-ghost {
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: 0;
}
.btn-primary { background: var(--color-brand); color: white; }
.btn-primary:hover { filter: brightness(0.95); }
.btn-secondary { background: rgba(120,120,130,0.12); color: var(--color-text); }
.btn-ghost { background: transparent; color: var(--color-muted); }
.btn-ghost:hover { background: rgba(120,120,130,0.08); }

/* Responsive — collapse groups on very small screens */
@media (max-width: 640px) {
  .toolbar { padding: 6px 8px; gap: 2px; }
  .tb-btn { min-width: 32px; height: 32px; padding: 0 6px; }
  .sep { margin: 0 2px; }
  .dropdown-menu { min-width: 180px; }
  .dropdown-menu.wide { min-width: 200px; }
  .color-grid { grid-template-columns: repeat(6, 1fr); }
}
</style>
