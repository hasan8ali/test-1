<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const variantClass = computed(() => {
  switch (props.block.props.variant) {
    case 'primary':
      return 'bg-[var(--t-color-primary)] text-[var(--t-color-primary-foreground)] hover:opacity-90'
    case 'secondary':
      return 'bg-[var(--t-color-secondary)] text-[var(--t-color-secondary-foreground)] hover:opacity-90'
    case 'accent':
      return 'bg-[var(--t-color-accent)] text-[var(--t-color-accent-foreground)] hover:opacity-90'
    case 'outline':
      return 'border-2 border-[var(--t-color-primary)] text-[var(--t-color-primary)] hover:bg-[var(--t-color-primary)] hover:text-[var(--t-color-primary-foreground)]'
    case 'ghost':
      return 'text-[var(--t-color-primary)] hover:bg-[var(--t-color-primary)]/10'
    case 'link':
      return 'text-[var(--t-color-primary)] underline-offset-4 hover:underline'
    default:
      return 'bg-[var(--t-color-primary)] text-[var(--t-color-primary-foreground)]'
  }
})

const sizeClass = computed(() => ({
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
}[props.block.props.size] || 'px-6 py-3'))

const alignClass = computed(() => ({
  right: 'justify-start', center: 'justify-center', left: 'justify-end', justify: 'justify-center'
}[props.block.props.align] || 'justify-start'))

const radiusClass = 'rounded-lg'
const target = computed(() => props.block.props.target === 'blank' ? '_blank' : '_self')
</script>

<template>
  <div :class="['flex w-full', alignClass]">
    <a
      :href="block.props.href"
      :target="target"
      rel="noopener noreferrer"
      :class="['inline-flex items-center gap-2 font-semibold transition-all cursor-pointer', variantClass, sizeClass, radiusClass]"
    >
      <UIcon v-if="block.props.icon" :name="block.props.icon" />
      <span>{{ block.props.text }}</span>
    </a>
  </div>
</template>
