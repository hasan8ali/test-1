<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
const sizes: Record<string, string> = { sm: '16px', md: '24px', lg: '32px', xl: '48px', '2xl': '64px' }
</script>
<template>
  <UIcon
    :name="block.props.name"
    :style="{
      fontSize: sizes[block.props.size as keyof typeof sizes] || '32px',
      color: 'var(--canvas-accent)'
    }"
  />
</template>
