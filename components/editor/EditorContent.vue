<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Typography from '@tiptap/extension-typography'
import { FontSize } from '~/utils/font-size-extension'

const props = defineProps<{
  modelValue: string
  dark: boolean
}>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const STORAGE_KEY = 'nuxt-word-editor:content'

const editor = useEditor({
  content: props.modelValue || localStorage.getItem(STORAGE_KEY) || '',
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4] },
      codeBlock: false
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' }
    }),
    Image.configure({ inline: false, allowBase64: true }),
    Table.configure({ resizable: true }),
    TableRow,
    TableCell,
    TableHeader,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Highlight.configure({ multicolor: true }),
    TextStyle,
    FontFamily,
    FontSize,
    Color,
    Subscript,
    Superscript,
    TaskList,
    TaskItem.configure({ nested: true }),
    Placeholder.configure({
      placeholder: 'ابدأ الكتابة هنا... ✨'
    }),
    CharacterCount,
    Typography
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-lg max-w-none focus:outline-none',
      spellcheck: 'false'
    }
  },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    emit('update:modelValue', html)
    // autosave to localStorage
    localStorage.setItem(STORAGE_KEY, html)
  }
})

watch(() => props.modelValue, (val) => {
  if (editor.value && val !== editor.value.getHTML()) {
    editor.value.commands.setContent(val, false)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

defineExpose({ editor })
</script>

<template>
  <div class="editor-shell">
    <EditorContent :editor="editor" class="editor-content printable-area" />
  </div>
</template>

<style scoped>
.editor-shell {
  width: 100%;
}
.editor-content {
  width: 100%;
}
</style>
