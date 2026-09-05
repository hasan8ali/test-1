<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
const radii = { none: '0', sm: '4px', md: '8px', lg: '16px', xl: '24px', full: '9999px' }
const aligns = { right: 'margin-right:auto', center: 'margin:0 auto', left: 'margin-left:auto' }
</script>
<template>
  <div v-if="!block.props.src" class="blk-empty">
    <UIcon name="i-lucide-image" class="mr-1" /> أضف صورة من الخصائص
  </div>
  <img
    v-else
    :src="block.props.src"
    :alt="block.props.alt || ''"
    :style="{
      borderRadius: radii[block.props.radius as keyof typeof radii] || '8px',
      width: '100%',
      maxWidth: '100%',
      display: 'block',
      [aligns[block.props.align as keyof typeof aligns] || 'margin:0 auto']: true
    }"
    loading="lazy"
  >
</template>
