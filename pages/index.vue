<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { FileText, Cloud, CloudOff, Save } from 'lucide-vue-next'

const editorComp = ref<any>(null)
const content = ref('')
const dark = ref(false)
const fullscreen = ref(false)
const reading = ref(false)
const saved = ref(true)
const lastSavedAt = ref<Date | null>(null)

/* ---------- Theme (dark mode) ---------- */
const applyTheme = () => {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', dark.value)
}
const toggleDark = () => {
  dark.value = !dark.value
  applyTheme()
  localStorage.setItem('nuxt-word-editor:dark', String(dark.value))
}

/* ---------- Fullscreen ---------- */
const toggleFullscreen = () => {
  fullscreen.value = !fullscreen.value
}

/* ---------- Reading mode ---------- */
const toggleReading = () => {
  reading.value = !reading.value
  if (reading.value && editorComp.value?.editor) {
    editorComp.value.editor.setEditable(false)
  } else if (editorComp.value?.editor) {
    editorComp.value.editor.setEditable(true)
  }
}

/* ---------- Save indicator ---------- */
let saveTimer: any = null
watch(content, () => {
  saved.value = false
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saved.value = true
    lastSavedAt.value = new Date()
  }, 600)
})

/* ---------- Export functions ---------- */
const downloadFile = (filename: string, content: string, mime: string) => {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const exportHTML = () => {
  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<title>مستند من Nuxt Word Editor</title>
<style>
body { font-family: 'Cairo', system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.75; color: #1f2937; }
h1, h2, h3 { line-height: 1.2; }
blockquote { border-right: 4px solid #1768f0; padding: 8px 16px; background: #eef6ff; border-radius: 8px; margin: 1em 0; font-style: italic; }
pre { background: #1e293b; color: #f1f5f9; padding: 12px 16px; border-radius: 8px; overflow-x: auto; direction: ltr; text-align: left; }
code { background: rgba(120,120,130,0.12); padding: 2px 6px; border-radius: 4px; font-size: 0.92em; }
table { width: 100%; border-collapse: collapse; margin: 1em 0; }
th, td { border: 1px solid #e8eaed; padding: 6px 12px; text-align: right; }
th { background: #eef6ff; font-weight: bold; }
img { max-width: 100%; height: auto; border-radius: 8px; }
a { color: #1768f0; }
</style>
</head>
<body>
${content.value}
</body>
</html>`
  downloadFile('document.html', html, 'text/html;charset=utf-8')
}

const exportMarkdown = () => {
  const md = htmlToMarkdown(content.value)
  downloadFile('document.md', md, 'text/markdown;charset=utf-8')
}

const exportText = () => {
  const tmp = document.createElement('div')
  tmp.innerHTML = content.value
  downloadFile('document.txt', tmp.innerText, 'text/plain;charset=utf-8')
}

const print = () => window.print()

/* ---------- Simple HTML to Markdown converter ---------- */
const htmlToMarkdown = (html: string): string => {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || ''
    if (node.nodeType !== Node.ELEMENT_NODE) return ''
    const el = node as HTMLElement
    const tag = el.tagName.toLowerCase()
    const inner = Array.from(el.childNodes).map(walk).join('')
    if (tag === 'h1') return `\n# ${inner}\n`
    if (tag === 'h2') return `\n## ${inner}\n`
    if (tag === 'h3') return `\n### ${inner}\n`
    if (tag === 'h4') return `\n#### ${inner}\n`
    if (tag === 'p') return `${inner}\n`
    if (tag === 'br') return '\n'
    if (tag === 'strong' || tag === 'b') return `**${inner}**`
    if (tag === 'em' || tag === 'i') return `*${inner}*`
    if (tag === 'u') return `<u>${inner}</u>`
    if (tag === 's' || tag === 'strike') return `~~${inner}~~`
    if (tag === 'code') return `\`${inner}\``
    if (tag === 'pre') return `\n\`\`\`\n${inner}\n\`\`\`\n`
    if (tag === 'blockquote') return `> ${inner}\n`
    if (tag === 'a') return `[${inner}](${el.getAttribute('href') || ''})`
    if (tag === 'img') return `![${el.getAttribute('alt') || ''}](${el.getAttribute('src') || ''})`
    if (tag === 'ul') return `\n${Array.from(el.children).map(li => `- ${walk(li)}`).join('\n')}\n`
    if (tag === 'ol') return `\n${Array.from(el.children).map((li, i) => `${i + 1}. ${walk(li)}`).join('\n')}\n`
    if (tag === 'hr') return `\n---\n`
    if (tag === 'table') return inner
    return inner
  }
  return walk(tmp)
}

/* ---------- Mount ---------- */
onMounted(() => {
  const savedDark = localStorage.getItem('nuxt-word-editor:dark') === 'true'
  dark.value = savedDark
  applyTheme()

  // Load saved content
  const stored = localStorage.getItem('nuxt-word-editor:content')
  if (stored) content.value = stored
})

/* ---------- Save manually ---------- */
const manualSave = () => {
  localStorage.setItem('nuxt-word-editor:content', content.value)
  saved.value = true
  lastSavedAt.value = new Date()
}

/* ---------- Keyboard shortcuts ---------- */
const onKey = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    manualSave()
  }
  if (e.key === 'Escape' && fullscreen.value) {
    fullscreen.value = false
  }
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
    e.preventDefault()
    toggleDark()
  }
}
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', onKey)
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
}

/* ---------- Keyboard shortcuts heading ---------- */
const lastSavedLabel = computed(() => {
  if (!lastSavedAt.value) return ''
  const d = lastSavedAt.value
  return `آخر حفظ: ${d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`
})
</script>

<script lang="ts">
import { computed, onBeforeUnmount } from 'vue'
</script>

<template>
  <div class="app-shell" :class="{ fullscreen, reading }">
    <!-- Top app bar -->
    <header v-if="!fullscreen" class="appbar">
      <div class="appbar-left">
        <div class="logo">
          <FileText :size="22" />
        </div>
        <div>
          <h1 class="title">محرر النصوص</h1>
          <p class="subtitle">Nuxt + TipTap — مثل Word، لكن عصري</p>
        </div>
      </div>

      <div class="appbar-right">
        <span class="save-status" :class="{ saved, unsaved: !saved }" :title="lastSavedLabel">
          <component :is="saved ? Cloud : CloudOff" :size="16" />
          <span class="hidden sm:inline">{{ saved ? 'محفوظ' : 'غير محفوظ' }}</span>
        </span>
        <button class="save-btn" @click="manualSave" title="حفظ (Ctrl+S)">
          <Save :size="16" />
          <span class="hidden sm:inline">حفظ</span>
        </button>
      </div>
    </header>

    <!-- Main editor area -->
    <main class="main-area">
      <!-- Toolbar (hidden in reading mode) -->
      <ClientOnly>
        <EditorToolbar
          v-if="!reading && editorComp?.editor"
          :editor="editorComp.editor"
          :dark="dark"
        />
      </ClientOnly>

      <ClientOnly>
        <TableMenu v-if="editorComp?.editor" :editor="editorComp.editor" />
      </ClientOnly>

      <!-- Editor content -->
      <div class="page-container" :class="{ 'reading-mode': reading }">
        <div class="page" :class="{ 'page-reading': reading }">
          <ClientOnly>
            <EditorContent
              ref="editorComp"
              v-model="content"
              :dark="dark"
            />
            <template #fallback>
              <div class="loading-fallback">
                <p>...جارٍ تحميل المحرر</p>
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </main>

    <!-- Statusbar (hidden in fullscreen reading mode) -->
    <ClientOnly>
      <EditorStatusbar
        v-if="editorComp?.editor && !fullscreen"
        :editor="editorComp.editor"
        :dark="dark"
        :fullscreen="fullscreen"
        :reading="reading"
        @toggle-dark="toggleDark"
        @toggle-fullscreen="toggleFullscreen"
        @toggle-reading="toggleReading"
        @export-html="exportHTML"
        @export-markdown="exportMarkdown"
        @export-text="exportText"
        @print="print"
      />
    </ClientOnly>

    <!-- Fullscreen exit hint -->
    <div v-if="fullscreen" class="exit-hint">
      <button class="exit-btn" @click="fullscreen = false">
        خروج من ملء الشاشة (Esc)
      </button>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-bg);
  transition: background 0.25s ease;
}
.app-shell.fullscreen {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--color-bg);
}

/* Top app bar */
.appbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}
.appbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-brand), #1252d4);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px -4px rgba(23,104,240,0.5);
}
.title {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.01em;
}
.subtitle {
  font-size: 12px;
  color: var(--color-muted);
  margin: 0;
  font-weight: 500;
}
.appbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.save-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}
.save-status.saved { color: #16a34a; }
.save-status.unsaved { color: #d97706; }

.save-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--color-brand);
  color: white;
  border: 0;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}
.save-btn:hover { filter: brightness(0.95); }

/* Main area */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

/* Page container — gives a "page" feel like Word */
.page-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background:
    linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg) 100%);
}
.page {
  max-width: 850px;
  min-height: 800px;
  margin: 0 auto;
  background: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 1px 3px -1px rgba(0,0,0,0.06), 0 12px 32px -8px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: all 0.25s ease;
}
.page-reading {
  max-width: 720px;
}

/* Loading fallback */
.loading-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: var(--color-muted);
  font-size: 14px;
}

/* Exit hint in fullscreen */
.exit-hint {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1100;
  pointer-events: none;
}
.exit-btn {
  pointer-events: all;
  padding: 8px 14px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-muted);
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 8px 24px -6px rgba(0,0,0,0.15);
}
.exit-btn:hover { color: var(--color-text); }

/* Responsive */
@media (max-width: 768px) {
  .appbar { padding: 10px 14px; }
  .title { font-size: 16px; }
  .subtitle { display: none; }
  .logo { width: 38px; height: 38px; }
  .page-container { padding: 12px; }
  .page { border-radius: 8px; min-height: 600px; }
}

@media (max-width: 480px) {
  .appbar-right { gap: 6px; }
  .save-btn { padding: 6px 10px; font-size: 12px; }
  .save-status { padding: 4px 6px; font-size: 12px; }
}
</style>
