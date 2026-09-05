<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Page, Theme } from '~/types/builder'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const page = ref<Page | null>(null)
const theme = ref<Theme | null>(null)
const loading = ref(true)
const error = ref('')

const loadPage = async () => {
  loading.value = true
  error.value = ''
  try {
    // Find page by slug via API
    const allPages = await $fetch<Page[]>('/api/pages')
    const found = allPages.find(p => p.slug === slug.value)
    if (!found) {
      error.value = 'الصفحة غير موجودة'
      return
    }
    if (found.status !== 'published') {
      error.value = 'الصفحة غير منشورة بعد'
      return
    }
    page.value = found
    theme.value = await $fetch<Theme>(`/api/themes/${found.themeId}`)
  } catch (e: any) {
    error.value = e.message || 'حدث خطأ'
  } finally {
    loading.value = false
  }
}

const themeStyle = computed(() => {
  if (!theme.value) return ''
  const tokens = theme.value.tokens || {}
  const map: Record<string, string> = {
    'color.primary': '--t-color-primary',
    'color.primaryForeground': '--t-color-primary-foreground',
    'color.secondary': '--t-color-secondary',
    'color.secondaryForeground': '--t-color-secondary-foreground',
    'color.accent': '--t-color-accent',
    'color.accentForeground': '--t-color-accent-foreground',
    'color.bg': '--t-color-bg',
    'color.surface': '--t-color-surface',
    'color.surfaceElevated': '--t-color-surface-elevated',
    'color.border': '--t-color-border',
    'color.text': '--t-color-text',
    'color.textMuted': '--t-color-text-muted',
    'color.textSubtle': '--t-color-text-subtle',
    'font.heading': '--t-font-heading',
    'font.body': '--t-font-body',
    'font.mono': '--t-font-mono'
  }
  return Object.entries(tokens)
    .filter(([k, v]) => map[k] && v)
    .map(([k, v]) => `${map[k]}: ${v}`)
    .join('; ')
})

useHead(() => ({
  title: page.value?.title || 'صفحة',
  meta: page.value?.meta?.description ? [{ name: 'description', content: page.value.meta.description }] : []
}))

onMounted(loadPage)
</script>

<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center">
    <UIcon name="i-lucide-loader-circle" class="text-4xl animate-spin text-[var(--t-color-primary)]" />
  </div>

  <div v-else-if="error" class="min-h-screen flex items-center justify-center p-6">
    <div class="text-center">
      <UIcon name="i-lucide-file-question" class="text-6xl text-[var(--ui-text-muted)] mb-3" />
      <h1 class="text-2xl font-bold mb-2">{{ error }}</h1>
      <p class="text-[var(--ui-text-muted)] mb-5">قد تكون الصفحة حُذفت أو لم تُنشر بعد.</p>
      <UButton to="/" color="primary">العودة للرئيسية</UButton>
    </div>
  </div>

  <div v-else class="t-builder-canvas min-h-screen" :style="themeStyle">
    <BlockRenderer
      v-for="block in page!.blocks"
      :key="block.id"
      :block="block"
      :editing="false"
    />
  </div>
</template>
