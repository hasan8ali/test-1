<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
const sizes = { 1: '3rem', 2: '2.25rem', 3: '1.5rem', 4: '1.125rem' }
const aligns = { right: 'right', center: 'center', left: 'left' }
</script>
<template>
  <component
    :is="`h${block.props.level || 2}`"
    :style="{
      fontSize: sizes[block.props.level as keyof typeof sizes] || '2.25rem',
      fontWeight: 700,
      textAlign: aligns[block.props.align as keyof typeof aligns] || 'right',
      lineHeight: 1.15,
      letterSpacing: '-0.02em'
    }"
  >
    {{ block.props.text }}
  </component>
</template>
