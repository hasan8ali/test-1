<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
defineEmits<{ select: [id: string] }>()

const pad = { none: '0', sm: '8px', md: '16px', lg: '24px', xl: '48px', '2xl': '80px' }
const max = { sm: '640px', md: '768px', lg: '1024px', xl: '1200px', full: '100%' }
const bg = {
  transparent: 'transparent',
  surface: 'var(--canvas-surface)',
  'surface-elevated': 'var(--canvas-surface-2)'
}

const style = computed(() => ({
  paddingTop: pad[props.block.props.paddingY as keyof typeof pad] || '16px',
  paddingBottom: pad[props.block.props.paddingY as keyof typeof pad] || '16px',
  paddingLeft: pad[props.block.props.paddingX as keyof typeof pad] || '16px',
  paddingRight: pad[props.block.props.paddingX as keyof typeof pad] || '16px',
  background: bg[props.block.props.background as keyof typeof bg] || 'transparent'
}))

const innerStyle = computed(() => ({
  maxWidth: max[props.block.props.maxWidth as keyof typeof max] || '100%',
  margin: '0 auto'
}))
</script>

<template>
  <div :style="style">
    <div :style="innerStyle">
      <template v-if="block.children?.length">
        <BlockRenderer
          v-for="child in block.children"
          :key="child.id"
          :block="child"
          :editing="editing"
          @select="$emit('select', $event)"
        />
      </template>
      <div v-else-if="editing" class="blk-empty">اسحب blocks هنا</div>
    </div>
  </div>
</template>
