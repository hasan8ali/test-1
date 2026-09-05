<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useBuilderStore } from '~/stores/builder'
import type { Theme } from '~/types/builder'
import BlockPalette from '~/components/builder/BlockPalette.vue'
import LayersPanel from '~/components/builder/LayersPanel.vue'
import BuilderCanvas from '~/components/builder/Canvas.vue'
import Inspector from '~/components/builder/Inspector.vue'

const route = useRoute()
const store = useBuilderStore()

const pageId = computed(() => route.params.id as string)
const loading = ref(true)
const saving = ref(false)
const showLeftPanel = ref(true)
const showRightPanel = ref(true)
const showThemes = ref(false)
const activeLeftTab = ref<'palette' | 'layers'>('palette')

const loadPage = async () => {
  loading.value = true
  try {
    const page = await $fetch(`/api/pages/${pageId.value}`)
    store.setPage(page)
    await loadTheme(page.themeId)
    await loadThemes()
    await loadSnapshots()
  } catch (e) {
    console.error('Failed to load page', e)
  } finally {
    loading.value = false
  }
}

const loadTheme = async (themeId: string) => {
  try {
    const theme = await $fetch(`/api/themes/${themeId}`)
    store.setTheme(theme)
  } catch (e) {
    console.error('Failed to load theme', e)
  }
}

const loadThemes = async () => {
  try {
    const themes = await $fetch('/api/themes')
    store.setThemes(themes)
  } catch (e) {
    console.error('Failed to load themes', e)
  }
}

const loadSnapshots = async () => {
  try {
    const snaps = await $fetch(`/api/snapshots/${pageId.value}`)
    store.setSnapshots(snaps)
  } catch (e) {
    console.error('Failed to load snapshots', e)
  }
}

const save = async () => {
  if (!store.page || saving.value) return
  saving.value = true
  try {
    await $fetch(`/api/pages/${pageId.value}`, {
      method: 'PATCH',
      body: { blocks: store.page.blocks }
    })
    store.markSaved()
    await loadSnapshots()
  } catch (e) {
    console.error('Save failed', e)
  } finally {
    saving.value = false
  }
}

let autoSaveTimer: any = null
onMounted(() => {
  loadPage()
  autoSaveTimer = setInterval(() => {
    if (store.isDirty && !saving.value) save()
  }, 30000)
})
onBeforeUnmount(() => {
  if (autoSaveTimer) clearInterval(autoSaveTimer)
})

const onKey = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    save()
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

const setDevice = (d: 'mobile' | 'tablet' | 'desktop') => store.setDevice(d)

const applyTheme = async (theme: Theme) => {
  if (!store.page) return
  try {
    await $fetch(`/api/pages/${pageId.value}`, {
      method: 'PATCH',
      body: { themeId: theme.id }
    })
    store.page.themeId = theme.id
    await loadTheme(theme.id)
    showThemes.value = false
  } catch (e) {
    console.error('Failed to apply theme', e)
  }
}

const onAddBlock = (type: any) => {
  store.addBlock(type, null)
}

const previewUrl = computed(() => `/p/${store.page?.slug}`)
const openPreview = () => {
  window.open(previewUrl.value, '_blank')
}

const publish = async () => {
  if (!store.page) return
  try {
    await $fetch(`/api/pages/${pageId.value}`, {
      method: 'PATCH',
      body: { status: 'published' }
    })
    store.page.status = 'published'
  } catch (e) {
    console.error('Publish failed', e)
  }
}

const saveStatus = computed(() => {
  if (saving.value) return { label: 'جارٍ الحفظ...', color: 'warning' }
  if (store.isDirty) return { label: 'غير محفوظ', color: 'error' }
  return { label: 'محفوظ', color: 'success' }
})
</script>

<template>
  <div v-if="loading" class="h-screen flex items-center justify-center">
    <div class="text-center">
      <UIcon name="i-lucide-loader-circle" class="text-4xl animate-spin text-[var(--t-color-primary)] mb-3" />
      <p class="text-[var(--ui-text-muted)]">جارٍ تحميل المحرر...</p>
    </div>
  </div>

  <div v-else class="h-screen flex flex-col bg-[var(--ui-bg)]">
    <!-- Top toolbar -->
    <header class="border-b border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 md:px-4 py-2 flex items-center justify-between gap-2 flex-shrink-0">
      <div class="flex items-center gap-2 min-w-0">
        <UButton
          icon="i-lucide-panel-left"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="showLeftPanel = !showLeftPanel"
          :class="{ 'opacity-50': !showLeftPanel }"
        />
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--t-color-primary)] to-[var(--t-color-secondary)] flex items-center justify-center text-white">
            <UIcon name="i-lucide-layers" />
          </div>
          <span class="font-bold text-sm hidden sm:inline">Tolnera Builder</span>
        </NuxtLink>
        <div class="hidden md:block text-sm text-[var(--ui-text-muted)] mr-2">
          /
          <span class="text-[var(--ui-text)]">{{ store.page?.title }}</span>
        </div>
      </div>

      <div class="flex items-center gap-1 bg-[var(--ui-bg-elevated)] rounded-lg p-1">
        <UButton
          icon="i-lucide-smartphone"
          :variant="store.device === 'mobile' ? 'solid' : 'ghost'"
          color="neutral"
          size="xs"
          @click="setDevice('mobile')"
        />
        <UButton
          icon="i-lucide-tablet"
          :variant="store.device === 'tablet' ? 'solid' : 'ghost'"
          color="neutral"
          size="xs"
          @click="setDevice('tablet')"
        />
        <UButton
          icon="i-lucide-monitor"
          :variant="store.device === 'desktop' ? 'solid' : 'ghost'"
          color="neutral"
          size="xs"
          @click="setDevice('desktop')"
        />
      </div>

      <div class="flex items-center gap-2">
        <UBadge :color="saveStatus.color as any" variant="subtle" size="sm" class="hidden sm:inline-flex">
          {{ saveStatus.label }}
        </UBadge>
        <UButton
          icon="i-lucide-palette"
          color="secondary"
          variant="outline"
          size="sm"
          @click="showThemes = true"
        >
          <span class="hidden sm:inline">الثيم</span>
        </UButton>
        <UButton
          icon="i-lucide-eye"
          color="neutral"
          variant="outline"
          size="sm"
          @click="openPreview"
        >
          <span class="hidden sm:inline">معاينة</span>
        </UButton>
        <UButton
          icon="i-lucide-save"
          color="primary"
          size="sm"
          :loading="saving"
          @click="save"
        >
          <span class="hidden sm:inline">حفظ</span>
        </UButton>
        <UButton
          icon="i-lucide-rocket"
          color="success"
          size="sm"
          :variant="store.page?.status === 'published' ? 'solid' : 'outline'"
          @click="publish"
        >
          <span class="hidden sm:inline">{{ store.page?.status === 'published' ? 'منشور' : 'نشر' }}</span>
        </UButton>
        <UButton
          icon="i-lucide-panel-right"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="showRightPanel = !showRightPanel"
          :class="{ 'opacity-50': !showRightPanel }"
          class="hidden md:inline-flex"
        />
      </div>
    </header>

    <!-- 3-panel layout -->
    <div class="flex-1 flex overflow-hidden">
      <aside v-if="showLeftPanel" class="w-72 flex-shrink-0 border-l border-[var(--ui-border)] flex flex-col">
        <div class="border-b border-[var(--ui-border)] flex">
          <button
            class="flex-1 py-2 text-sm font-medium transition-colors"
            :class="activeLeftTab === 'palette' ? 'text-[var(--t-color-primary)] border-b-2 border-[var(--t-color-primary)]' : 'text-[var(--ui-text-muted)]'"
            @click="activeLeftTab = 'palette'"
          >
            العناصر
          </button>
          <button
            class="flex-1 py-2 text-sm font-medium transition-colors"
            :class="activeLeftTab === 'layers' ? 'text-[var(--t-color-primary)] border-b-2 border-[var(--t-color-primary)]' : 'text-[var(--ui-text-muted)]'"
            @click="activeLeftTab = 'layers'"
          >
            الطبقات
          </button>
        </div>
        <div class="flex-1 overflow-hidden">
          <BlockPalette v-show="activeLeftTab === 'palette'" @add-block="onAddBlock" />
          <LayersPanel v-show="activeLeftTab === 'layers'" />
        </div>
      </aside>

      <main class="flex-1 overflow-hidden">
        <BuilderCanvas />
      </main>

      <aside v-if="showRightPanel" class="w-80 flex-shrink-0 border-r border-[var(--ui-border)]">
        <Inspector />
      </aside>
    </div>
  </div>

  <!-- Theme picker modal -->
  <UModal v-model:open="showThemes" :ui="{ content: 'max-w-4xl' }">
    <template #content>
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">اختر ثيم</h2>
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" @click="showThemes = false" />
        </div>
        <p class="text-sm text-[var(--ui-text-muted)] mb-5">
          الثيم بيحدد الألوان والخطوط والاستدارة. تقدر تغيره في أي وقت — كل التغييرات هتنعكس فوراً على الصفحة.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="theme in store.themes"
            :key="theme.id"
            @click="applyTheme(theme)"
            :class="[
              'text-right rounded-2xl border-2 p-4 transition-all hover:shadow-lg',
              store.page?.themeId === theme.id ? 'border-[var(--t-color-primary)]' : 'border-[var(--ui-border)]'
            ]"
          >
            <div
              class="h-24 rounded-lg mb-3 flex items-center justify-center text-2xl font-bold"
              :style="{
                background: theme.tokens['color.bg'] || '#fff',
                color: theme.tokens['color.text'] || '#000',
                boxShadow: `inset 0 0 0 2px ${theme.tokens['color.border'] || '#e2e8f0'}`
              }"
            >
              <span :style="{ color: theme.tokens['color.primary'] }">Aa</span>
            </div>
            <h3 class="font-bold mb-1">{{ theme.name }}</h3>
            <p class="text-xs text-[var(--ui-text-muted)] mb-2">{{ theme.description }}</p>
            <div class="flex gap-1">
              <div class="w-5 h-5 rounded-full" :style="{ background: theme.tokens['color.primary'] }" />
              <div class="w-5 h-5 rounded-full" :style="{ background: theme.tokens['color.secondary'] }" />
              <div class="w-5 h-5 rounded-full" :style="{ background: theme.tokens['color.accent'] }" />
            </div>
          </button>
        </div>
      </div>
    </template>
  </UModal>
</template>
