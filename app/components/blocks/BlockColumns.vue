<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
defineEmits<{ select: [id: string] }>()

const layouts: Record<string, string> = {
  '1-1': '1fr 1fr',
  '1-2': '1fr 2fr',
  '2-1': '2fr 1fr',
  '1-3': '1fr 3fr',
  '3-1': '3fr 1fr',
  '1-1-1': '1fr 1fr 1fr'
}
const gap = { none: '0', sm: '8px', md: '16px', lg: '24px', xl: '48px' }

const cols = computed(() => layouts[props.block.props.layout] || '1fr 1fr')
</script>

<template>
  <div
    :style="{
      display: 'grid',
      gridTemplateColumns: block.props.stackMobile ? '1fr' : cols,
      gap: gap[block.props.gap as keyof typeof gap] || '16px'
    }"
    :class="block.props.stackMobile ? 'md:!grid' : ''"
    :data-mobile-cols="block.props.stackMobile ? cols : null"
  >
    <template v-if="block.children?.length">
      <BlockRenderer
        v-for="child in block.children"
        :key="child.id"
        :block="child"
        :editing="editing"
        @select="$emit('select', $event)"
      />
    </template>
    <template v-else-if="editing">
      <div v-for="i in (cols.split(' ').length)" :key="i" class="blk-empty">عمود {{ i }}</div>
    </template>
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  [data-mobile-cols] {
    grid-template-columns: attr(data-mobile-cols) !important;
  }
}
</style>
