<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBuilderStore } from '~/stores/builder'

const store = useBuilderStore()

const canvasWidth = computed(() => {
  switch (store.device) {
    case 'mobile': return '375px'
    case 'tablet': return '768px'
    default: return '100%'
  }
})

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  const type = e.dataTransfer?.getData('block-type') as any
  if (type) {
    store.addBlock(type, null)
  }
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
}

const onCanvasClick = () => {
  store.selectBlock(null)
}

const applyThemeTokens = computed(() => {
  if (!store.theme) return ''
  const tokens = store.theme.tokens || {}
  const lines: string[] = []
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
    'font.mono': '--t-font-mono',
    'radius.sm': '--t-radius-sm',
    'radius.md': '--t-radius-md',
    'radius.lg': '--t-radius-lg',
    'radius.xl': '--t-radius-xl',
    'shadow.sm': '--t-shadow-sm',
    'shadow.md': '--t-shadow-md',
    'shadow.lg': '--t-shadow-lg'
  }
  for (const [k, v] of Object.entries(tokens)) {
    if (map[k] && v) lines.push(`${map[k]}: ${v}`)
  }
  return lines.join('; ')
})
</script>

<template>
  <div class="h-full overflow-y-auto bg-[var(--ui-bg-muted)] p-4 md:p-8 flex justify-center">
    <div
      :class="[
        'transition-all duration-300',
        store.device === 'mobile' && 'shadow-2xl',
        store.device === 'tablet' && 'shadow-2xl'
      ]"
      :style="{ width: canvasWidth, maxWidth: '100%' }"
    >
      <div
        class="t-builder-canvas min-h-[600px] shadow-lg"
        :style="applyThemeTokens"
        @click="onCanvasClick"
        @drop="onDrop"
        @dragover="onDragOver"
      >
        <template v-if="store.page && store.page.blocks.length">
          <BlockRenderer
            v-for="block in store.page.blocks"
            :key="block.id"
            :block="block"
            :editing="true"
            @select-block="store.selectBlock($event)"
          />
        </template>
        <div v-else class="t-drop-zone m-4 min-h-[500px]">
          <UIcon name="i-lucide-mouse-pointer-square-dashed" class="text-4xl mb-3" />
          <p class="text-base font-medium">ابدأ السحب والإفلات</p>
          <p class="text-xs mt-1">اسحب عناصر من اللوحة اليمنى</p>
        </div>
      </div>
    </div>
  </div>
</template>
