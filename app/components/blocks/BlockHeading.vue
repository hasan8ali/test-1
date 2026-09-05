<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const tag = computed(() => `h${props.block.props.level || 2}`)

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
  <component :is="tag" :class="[colorClass, alignClass]">
    {{ block.props.text }}
  </component>
</template>
