<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const sizeClass = computed(() => ({
  sm: 'text-base', md: 'text-xl', lg: 'text-2xl', xl: 'text-4xl', '2xl': 'text-6xl'
}[props.block.props.size] || 'text-2xl'))

const colorClass = computed(() => ({
  text: 'text-[var(--t-color-text)]',
  textMuted: 'text-[var(--t-color-text-muted)]',
  primary: 'text-[var(--t-color-primary)]',
  secondary: 'text-[var(--t-color-secondary)]',
  accent: 'text-[var(--t-color-accent)]'
}[props.block.props.color] || 'text-[var(--t-color-primary)]'))
</script>

<template>
  <div :class="['flex', colorClass]">
    <UIcon :name="block.props.name" :class="sizeClass" />
  </div>
</template>
