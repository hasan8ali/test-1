<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const colorClass = computed(() => ({
  border: 'border-[var(--t-color-border)]',
  primary: 'border-[var(--t-color-primary)]',
  secondary: 'border-[var(--t-color-secondary)]'
}[props.block.props.color] || 'border-[var(--t-color-border)]'))

const widthClass = computed(() => ({
  sm: 'border-t', md: 'border-t-2', lg: 'border-t-4'
}[props.block.props.width] || 'border-t'))

const styleClass = computed(() => ({
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
  gradient: 'border-solid bg-gradient-to-l from-[var(--t-color-primary)] to-[var(--t-color-secondary)] border-0 h-1'
}[props.block.props.style] || 'border-solid'))
</script>

<template>
  <hr :class="['w-full my-4', colorClass, widthClass, styleClass]">
</template>
