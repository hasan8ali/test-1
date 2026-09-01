<script setup lang="ts">
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import {
  FileText, FileCode2, Printer, Sun, Moon, Maximize2, Minimize2,
  AlignJustify, Eye, EyeOff
} from 'lucide-vue-next'

const props = defineProps<{
  editor: any
  dark: boolean
  fullscreen: boolean
  reading: boolean
}>()

const emit = defineEmits<{
  'toggle-dark': []
  'toggle-fullscreen': []
  'toggle-reading': []
  'export-html': []
  'export-markdown': []
  'export-text': []
  'print': []
}>()

const editor = computed(() => props.editor as Editor | null)
const chars = computed(() => editor.value?.storage.characterCount?.characters ?? 0)
const words = computed(() => editor.value?.storage.characterCount?.words ?? 0)
</script>

<template>
  <div class="statusbar">
    <div class="left">
      <button class="sb-btn" :class="{ active: dark }" @click="emit('toggle-dark')" :title="dark ? 'الوضع الفاتح' : 'الوضع الداكن'">
        <component :is="dark ? Sun : Moon" :size="16" />
        <span class="hidden sm:inline">{{ dark ? 'فاتح' : 'داكن' }}</span>
      </button>
      <button class="sb-btn" @click="emit('toggle-reading')" :class="{ active: reading }" title="وضع القراءة">
        <component :is="reading ? EyeOff : Eye" :size="16" />
        <span class="hidden sm:inline">{{ reading ? 'تحرير' : 'قراءة' }}</span>
      </button>
      <button class="sb-btn" @click="emit('toggle-fullscreen')" :title="fullscreen ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'">
        <component :is="fullscreen ? Minimize2 : Maximize2" :size="16" />
        <span class="hidden sm:inline">{{ fullscreen ? 'إنهاء' : 'ملء الشاشة' }}</span>
      </button>
    </div>

    <div class="right">
      <span class="counter">
        <span class="hidden sm:inline">كلمة</span>
        {{ words.toLocaleString('ar-EG') }}
      </span>
      <span class="counter">
        <span class="hidden sm:inline">حرف</span>
        {{ chars.toLocaleString('ar-EG') }}
      </span>
      <span class="sep" />
      <button class="sb-btn" @click="emit('export-html')" title="تصدير HTML">
        <FileText :size="16" />
        <span class="hidden md:inline">HTML</span>
      </button>
      <button class="sb-btn" @click="emit('export-markdown')" title="تصدير Markdown">
        <FileCode2 :size="16" />
        <span class="hidden md:inline">MD</span>
      </button>
      <button class="sb-btn" @click="emit('export-text')" title="تصدير نص">
        <AlignJustify :size="16" />
        <span class="hidden md:inline">TXT</span>
      </button>
      <button class="sb-btn" @click="emit('print')" title="طباعة">
        <Printer :size="16" />
        <span class="hidden md:inline">طباعة</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 14px;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  font-size: 13px;
  flex-wrap: wrap;
}
.left, .right {
  display: flex;
  align-items: center;
  gap: 4px;
}
.sb-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 0;
  background: transparent;
  color: var(--color-muted);
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
}
.sb-btn:hover { background: rgba(120,120,130,0.1); color: var(--color-text); }
.sb-btn.active { color: var(--color-brand); background: var(--color-brand-soft); }
.counter {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(120,120,130,0.08);
  border-radius: 8px;
  color: var(--color-muted);
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}
.sep { width: 1px; height: 18px; background: var(--color-border); margin: 0 4px; }
</style>
