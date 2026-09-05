<script setup lang="ts">
import { computed } from 'vue'
import type { Page, Theme } from '~/types/builder'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: pageData, error: fetchError } = await useAsyncData(
  () => `page-${slug.value}`,
  async () => {
    const allPages = await $fetch<Page[]>('/api/pages')
    const found = allPages.find(p => p.slug === slug.value)
    if (!found) {
      throw createError({ statusCode: 404, statusMessage: 'الصفحة غير موجودة' })
    }
    if (found.status !== 'published') {
      throw createError({ statusCode: 403, statusMessage: 'الصفحة غير منشورة بعد' })
    }
    const theme = await $fetch<Theme>(`/api/themes/${found.themeId}`)
    return { page: found, theme }
  }
)

const page = computed(() => pageData.value?.page ?? null)
const theme = computed(() => pageData.value?.theme ?? null)
const error = computed(() => fetchError.value ? String(fetchError.value) : '')

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
  meta: page.value?.meta?.description
    ? [{ name: 'description', content: page.value.meta.description }]
    : []
}))
</script>

<template>
  <div v-if="error" class="min-h-screen flex items-center justify-center p-6">
    <div class="text-center">
      <UIcon name="i-lucide-file-question" class="text-6xl text-[var(--ui-text-muted)] mb-3" />
      <h1 class="text-2xl font-bold mb-2">{{ error }}</h1>
      <p class="text-[var(--ui-text-muted)] mb-5">قد تكون الصفحة حُذفت أو لم تُنشر بعد.</p>
      <UButton to="/" color="primary">العودة للرئيسية</UButton>
    </div>
  </div>

  <div v-else-if="page" class="t-builder-canvas min-h-screen" :style="themeStyle">
    <BlockRenderer
      v-for="block in page.blocks"
      :key="block.id"
      :block="block"
      :editing="false"
    />
  </div>
</template>
