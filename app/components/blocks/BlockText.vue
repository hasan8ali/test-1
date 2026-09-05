<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const sizeClass = computed(() => ({
  sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl'
}[props.block.props.size] || 'text-base'))

const weightClass = computed(() => ({
  thin: 'font-thin', normal: 'font-normal', medium: 'font-medium',
  semibold: 'font-semibold', bold: 'font-bold'
}[props.block.props.weight] || 'font-normal'))

const colorClass = computed(() => ({
  text: 'text-[var(--t-color-text)]',
  textMuted: 'text-[var(--t-color-text-muted)]',
  primary: 'text-[var(--t-color-primary)]',
  secondary: 'text-[var(--t-color-secondary)]',
  accent: 'text-[var(--t-color-accent)]'
}[props.block.props.color] || 'text-[var(--t-color-text)]'))

const alignClass = computed(() => ({
  right: 'text-right', center: 'text-center', left: 'text-left', justify: 'text-justify'
}[props.block.props.align] || 'text-right'))
</script>

<template>
  <p :class="[sizeClass, weightClass, colorClass, alignClass, 'leading-relaxed']">
    {{ block.props.text }}
  </p>
</template>
