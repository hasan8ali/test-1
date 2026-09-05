<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
const sizes = { sm: '14px', base: '16px', lg: '18px', xl: '20px' }
const aligns = { right: 'right', center: 'center', left: 'left', justify: 'justify' }
const max = { full: '100%', prose: '65ch', narrow: '45ch' }
</script>
<template>
  <p
    :style="{
      fontSize: sizes[block.props.size as keyof typeof sizes] || '16px',
      textAlign: aligns[block.props.align as keyof typeof aligns] || 'right',
      lineHeight: 1.65,
      maxWidth: max[block.props.maxWidth as keyof typeof max] || '100%',
      margin: '0 auto'
    }"
  >
    {{ block.props.content }}
  </p>
</template>
