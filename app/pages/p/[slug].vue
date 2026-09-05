<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, error } = await useAsyncData(`public-${slug.value}`, () =>
  $fetch(`/api/public/${slug.value}`).catch(() => null)
)

const site = computed(() => (data.value as any)?.site || null)
const theme = computed(() => (data.value as any)?.theme || null)
const pages = computed(() => (data.value as any)?.pages || [])

// Show home page by default
const currentPage = computed(() => pages.value.find((p: any) => p.isHome) || pages.value[0] || null)

const themeStyle = computed(() => {
  if (!theme.value) return ''
  const t = theme.value.tokens || {}
  const map: Record<string, string> = {
    'color.bg': '--canvas-bg',
    'color.surface': '--canvas-surface',
    'color.text': '--canvas-text',
    'color.textMuted': '--canvas-text-muted',
    'color.accent': '--canvas-accent',
    'color.accentFg': '--canvas-accent-fg',
    'color.border': '--canvas-border'
  }
  return Object.entries(t).filter(([k, v]) => map[k] && v).map(([k, v]) => `${map[k]}: ${v}`).join('; ')
})

useHead(() => ({
  title: site.value?.name || 'Tolnera'
}))
</script>

<template>
  <div v-if="!data" class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <UIcon name="i-lucide-globe" class="text-4xl text-[var(--text-subtle)] mb-3" />
      <h1 class="text-xl font-bold mb-1">الموقع غير موجود</h1>
      <p class="text-sm text-[var(--text-muted)]">قد يكون غير منشور أو محذوفًا</p>
    </div>
  </div>

  <div v-else class="builder-canvas min-h-screen" :style="themeStyle">
    <BlockRenderer
      v-for="block in currentPage?.blocks || []"
      :key="block.id"
      :block="block"
      :editing="false"
    />
  </div>
</template>
