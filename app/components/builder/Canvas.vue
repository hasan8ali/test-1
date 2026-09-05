<script setup lang="ts">
import { computed } from 'vue'
import { useBuilderStore } from '~/stores/builder'

const store = useBuilderStore()

const width = computed(() => {
  switch (store.device) {
    case 'mobile': return '375px'
    case 'tablet': return '768px'
    default: return '100%'
  }
})

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  const type = e.dataTransfer?.getData('block-type') as any
  if (type) store.addBlock(type, null)
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
}

const onCanvasClick = () => {
  store.selectBlock(null)
}

/* Theme tokens → CSS variables for the canvas */
const themeStyle = computed(() => {
  if (!store.theme) return ''
  const t = store.theme.tokens || {}
  const lines: string[] = []
  const map: Record<string, string> = {
    'color.bg': '--canvas-bg',
    'color.surface': '--canvas-surface',
    'color.text': '--canvas-text',
    'color.textMuted': '--canvas-text-muted',
    'color.accent': '--canvas-accent',
    'color.accentFg': '--canvas-accent-fg',
    'color.border': '--canvas-border',
    'font.heading': '--canvas-font-heading',
    'font.body': '--canvas-font-body'
  }
  for (const [k, v] of Object.entries(t)) {
    if (map[k] && v) lines.push(`${map[k]}: ${v}`)
  }
  return lines.join('; ')
})
</script>

<template>
  <div class="h-full overflow-y-auto bg-[var(--bg)] p-4 md:p-8 flex justify-center">
    <div
      :style="{ width: width, maxWidth: '100%', transition: 'width 0.2s' }"
      :class="store.device !== 'desktop' ? 'shadow-2xl' : ''"
    >
      <div
        class="builder-canvas min-h-[600px] rounded-lg overflow-hidden"
        :style="themeStyle"
        @click="onCanvasClick"
        @drop="onDrop"
        @dragover="onDragOver"
      >
        <template v-if="store.currentPage && store.currentPage.blocks.length">
          <BlockRenderer
            v-for="block in store.currentPage.blocks"
            :key="block.id"
            :block="block"
            :editing="true"
            @select="store.selectBlock($event)"
          />
        </template>
        <div v-else class="blk-empty" style="min-height: 400px; margin: 16px;">
          <div class="text-center">
            <UIcon name="i-lucide-mouse-pointer-square-dashed" class="text-3xl mb-2" />
            <p class="text-sm font-medium">اسحب عناصر من اليمين</p>
            <p class="text-xs mt-1 opacity-60">أو اضغط على أي عنصر لإضافته</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
