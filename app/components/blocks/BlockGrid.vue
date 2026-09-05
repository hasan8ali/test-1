<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const gapClass = computed(() => ({
  none: 'gap-0', sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8', '2xl': 'gap-12'
}[props.block.props.gap] || 'gap-4'))

const style = computed(() => {
  const minW = props.block.props.minItemWidth
  if (minW && minW !== 'auto') {
    return `grid-template-columns: repeat(auto-fill, minmax(${minW}, 1fr))`
  }
  return undefined
})

const colClass = computed(() => {
  // On mobile use columnsMobile, tablet columnsTablet, desktop columns
  // Tailwind doesn't generate dynamic grid-cols-N, so we use inline style
  return ''
})

const mobileCols = computed(() => `repeat(${props.block.props.columnsMobile}, minmax(0, 1fr))`)
const tabletCols = computed(() => `repeat(${props.block.props.columnsTablet}, minmax(0, 1fr))`)
const desktopCols = computed(() => `repeat(${props.block.props.columns}, minmax(0, 1fr))`)

const responsiveStyle = computed(() => {
  if (props.block.props.minItemWidth !== 'auto') return style.value
  return `--cols-mobile: ${mobileCols.value}; --cols-tablet: ${tabletCols.value}; --cols-desktop: ${desktopCols.value}; grid-template-columns: var(--cols-mobile)`
})

defineEmits<{ 'select-block': [id: string] }>()
</script>

<template>
  <div :class="['grid', gapClass]" :style="responsiveStyle">
    <template v-if="block.children?.length">
      <BlockRenderer
        v-for="child in block.children"
        :key="child.id"
        :block="child"
        :editing="editing"
        @select-block="$emit('select-block', $event)"
      />
    </template>
    <div v-else-if="editing" class="t-drop-zone col-span-full">
      اسحب blocks هنا
    </div>
  </div>
</template>

<style scoped>
.grid {
  grid-template-columns: var(--cols-mobile, 1fr);
}
@media (min-width: 768px) {
  .grid { grid-template-columns: var(--cols-tablet, 1fr); }
}
@media (min-width: 1024px) {
  .grid { grid-template-columns: var(--cols-desktop, 1fr); }
}
</style>
