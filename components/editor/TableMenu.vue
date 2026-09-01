<script setup lang="ts">
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import {
  Trash2, Plus, Minus,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown
} from 'lucide-vue-next'

const props = defineProps<{ editor: any }>()
const editor = computed(() => props.editor as Editor | null)

const btn = (fn: () => void) => () => {
  if (editor.value) {
    fn()
    editor.value.chain().focus().run()
  }
}

const cmds = {
  addColBefore: () => btn(() => editor.value?.chain().addColumnBefore().run()),
  addColAfter: () => btn(() => editor.value?.chain().addColumnAfter().run()),
  delCol: () => btn(() => editor.value?.chain().deleteColumn().run()),
  addRowBefore: () => btn(() => editor.value?.chain().addRowBefore().run()),
  addRowAfter: () => btn(() => editor.value?.chain().addRowAfter().run()),
  delRow: () => btn(() => editor.value?.chain().deleteRow().run()),
  delTable: () => btn(() => editor.value?.chain().deleteTable().run()),
  mergeOrSplit: () => btn(() => editor.value?.chain().mergeOrSplit().run()),
  toggleHeaderRow: () => btn(() => editor.value?.chain().toggleHeaderRow().run()),
  goPrevCell: () => btn(() => editor.value?.chain().focus().goToPreviousCell().run()),
  goNextCell: () => btn(() => editor.value?.chain().focus().goToNextCell().run())
}
</script>

<template>
  <div v-if="editor?.isActive('table')" class="table-bubble">
    <button class="b-btn" @click="cmds.addColBefore()" title="إضافة عمود قبل"><Plus :size="14" />عمود قبل</button>
    <button class="b-btn" @click="cmds.addColAfter()" title="إضافة عمود بعد"><Plus :size="14" />عمود بعد</button>
    <button class="b-btn" @click="cmds.delCol()" title="حذف العمود"><Minus :size="14" /></button>
    <span class="b-sep" />
    <button class="b-btn" @click="cmds.addRowBefore()" title="إضافة صف قبل"><ArrowUp :size="14" /></button>
    <button class="b-btn" @click="cmds.addRowAfter()" title="إضافة صف بعد"><ArrowDown :size="14" /></button>
    <button class="b-btn" @click="cmds.delRow()" title="حذف الصف"><Minus :size="14" /></button>
    <span class="b-sep" />
    <button class="b-btn" @click="cmds.mergeOrSplit()" title="دمج/فصل الخلايا">دمج</button>
    <button class="b-btn" @click="cmds.toggleHeaderRow()" title="تبديل رأس الجدول">رأس</button>
    <span class="b-sep" />
    <button class="b-btn" @click="cmds.goPrevCell()" title="الخلية السابقة"><ArrowRight :size="14" /></button>
    <button class="b-btn" @click="cmds.goNextCell()" title="الخلية التالية"><ArrowLeft :size="14" /></button>
    <span class="b-sep" />
    <button class="b-btn danger" @click="cmds.delTable()" title="حذف الجدول"><Trash2 :size="14" />حذف الجدول</button>
  </div>
</template>

<style scoped>
.table-bubble {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 8px 24px -6px rgba(0,0,0,0.18);
  margin-bottom: 12px;
  font-size: 12px;
}
.b-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: 0;
  background: transparent;
  color: var(--color-text);
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
}
.b-btn:hover { background: rgba(120,120,130,0.1); }
.b-btn.danger { color: #dc2626; }
.b-btn.danger:hover { background: rgba(220,38,38,0.1); }
.b-sep { width: 1px; height: 16px; background: var(--color-border); margin: 0 2px; }
</style>
