<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useBuilderStore } from '~/stores/builder'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const store = useBuilderStore()
const auth = useAuthStore()

const siteId = computed(() => route.params.id as string)
const loading = ref(true)
const saving = ref(false)

const load = async () => {
  loading.value = true
  try {
    const data = await $fetch(`/api/sites/${siteId.value}`) as any
    const themes = await $fetch('/api/themes') as any[]
    const theme = themes.find((t: any) => t.id === data.themeId) || themes[0]
    store.setSite(data, data.pages, theme)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const save = async () => {
  if (!store.currentPage || saving.value) return
  saving.value = true
  try {
    await $fetch(`/api/pages/${store.currentPage.id}`, {
      method: 'PATCH',
      body: { blocks: store.currentPage.blocks }
    })
    store.markSaved()
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

let autoSave: any
onMounted(() => {
  load()
  auth.fetchMe()
  autoSave = setInterval(() => {
    if (store.dirty && !saving.value) save()
  }, 30000)
})
onBeforeUnmount(() => {
  if (autoSave) clearInterval(autoSave)
})

const onKey = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    save()
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
    e.preventDefault()
    store.undo()
  }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
    e.preventDefault()
    store.redo()
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

const publish = async () => {
  if (!store.site) return
  await save()
  await $fetch(`/api/sites/${siteId.value}`, {
    method: 'PATCH',
    body: { status: 'published' }
  })
  store.site.status = 'published'
}

const status = computed(() => {
  if (saving.value) return { text: 'جاري الحفظ...', color: 'text-yellow-400' }
  if (store.dirty) return { text: 'غير محفوظ', color: 'text-orange-400' }
  return { text: 'محفوظ', color: 'text-[var(--accent)]' }
})
</script>

<template>
  <div v-if="loading" class="h-screen flex items-center justify-center">
    <UIcon name="i-lucide-loader-circle" class="text-2xl animate-spin text-[var(--accent)]" />
  </div>

  <div v-else class="h-screen flex flex-col">
    <header class="border-b border-[var(--border)] px-3 py-2 flex items-center justify-between gap-2 flex-shrink-0">
      <div class="flex items-center gap-2">
        <UButton @click="store.toggleLeftPanel()" icon="i-lucide-panel-right" variant="ghost" color="neutral" size="xs" />
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-6 h-6 rounded bg-[var(--accent)] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 32 32">
              <rect x="8" y="8" width="6" height="6" rx="1" fill="#09090b"/>
              <rect x="18" y="18" width="6" height="6" rx="1" fill="#09090b"/>
            </svg>
          </div>
          <span class="text-sm font-semibold hidden sm:inline">{{ store.site?.name }}</span>
        </NuxtLink>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex gap-0.5">
          <button @click="store.undo()" :disabled="!store.canUndo" class="p-1.5 rounded hover:bg-[var(--surface-2)] disabled:opacity-30" title="تراجع (Ctrl+Z)">
            <UIcon name="i-lucide-undo-2" class="text-sm" />
          </button>
          <button @click="store.redo()" :disabled="!store.canRedo" class="p-1.5 rounded hover:bg-[var(--surface-2)] disabled:opacity-30" title="إعادة (Ctrl+Shift+Z)">
            <UIcon name="i-lucide-redo-2" class="text-sm" />
          </button>
        </div>
        <div class="w-px h-5 bg-[var(--border)]"></div>
        <div class="flex gap-0.5 bg-[var(--surface-2)] rounded p-0.5">
          <button v-for="d in ['mobile', 'tablet', 'desktop']" :key="d" @click="store.setDevice(d as any)"
            :class="['p-1.5 rounded transition-colors', store.device === d ? 'bg-[var(--surface)] text-[var(--text)]' : 'text-[var(--text-muted)]']">
            <UIcon :name="`i-lucide-${d === 'mobile' ? 'smartphone' : d === 'tablet' ? 'tablet' : 'monitor'}`" class="text-sm" />
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span :class="['text-xs', status.color]">{{ status.text }}</span>
        <UButton @click="store.toggleAdvanced()" :variant="store.advancedMode ? 'solid' : 'ghost'" color="neutral" size="xs" icon="i-lucide-code">
          <span class="hidden sm:inline">متقدم</span>
        </UButton>
        <UButton :to="`/p/${store.site?.slug}`" target="_blank" icon="i-lucide-external-link" variant="ghost" color="neutral" size="xs">
          <span class="hidden sm:inline">معاينة</span>
        </UButton>
        <UButton @click="save" :loading="saving" color="primary" size="xs" icon="i-lucide-save">
          <span class="hidden sm:inline">حفظ</span>
        </UButton>
        <UButton @click="publish" :variant="store.site?.status === 'published' ? 'solid' : 'outline'" color="success" size="xs" icon="i-lucide-rocket">
          <span class="hidden sm:inline">{{ store.site?.status === 'published' ? 'منشور' : 'نشر' }}</span>
        </UButton>
        <UButton @click="store.toggleRightPanel()" icon="i-lucide-panel-left" variant="ghost" color="neutral" size="xs" class="hidden md:inline-flex" />
      </div>
    </header>

    <div v-if="store.pages.length > 1" class="border-b border-[var(--border)] px-3 py-1 flex gap-1">
      <button v-for="p in store.pages" :key="p.id" @click="store.setCurrentPage(p.id)"
        :class="['px-3 py-1 text-xs rounded transition-colors', store.currentPage?.id === p.id ? 'bg-[var(--surface-2)] text-[var(--text)]' : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)]']">
        {{ p.title }}
      </button>
    </div>

    <div class="flex-1 flex overflow-hidden">
      <aside v-if="store.leftPanelOpen" class="w-64 border-l border-[var(--border)] flex flex-col flex-shrink-0">
        <div class="border-b border-[var(--border)] flex">
          <button @click="store.setLeftPanel('blocks')" :class="['flex-1 py-2 text-xs font-medium', store.leftPanel === 'blocks' ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]' : 'text-[var(--text-muted)]']">العناصر</button>
          <button @click="store.setLeftPanel('layers')" :class="['flex-1 py-2 text-xs font-medium', store.leftPanel === 'layers' ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]' : 'text-[var(--text-muted)]']">الطبقات</button>
        </div>
        <div class="flex-1 overflow-hidden">
          <BlockPalette v-show="store.leftPanel === 'blocks'" />
          <LayersTree v-show="store.leftPanel === 'layers'" />
        </div>
      </aside>

      <main class="flex-1 overflow-hidden">
        <Canvas />
      </main>

      <aside v-if="store.rightPanelOpen" class="w-72 border-r border-[var(--border)] flex-shrink-0">
        <Inspector />
      </aside>
    </div>
  </div>
</template>
