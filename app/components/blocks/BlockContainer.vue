<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const maxWidthClass = computed(() => {
  switch (props.block.props.maxWidth) {
    case 'sm': return 'max-w-2xl'
    case 'md': return 'max-w-4xl'
    case 'lg': return 'max-w-6xl'
    case 'xl': return 'max-w-7xl'
    case 'full': return 'max-w-none'
    default: return 'max-w-6xl'
  }
})

const paddingClass = computed(() => {
  const x = { none: 'px-0', sm: 'px-2', md: 'px-4', lg: 'px-6', xl: 'px-8', '2xl': 'px-12' }[props.block.props.paddingX] || 'px-4'
  const y = { none: 'py-0', sm: 'py-2', md: 'py-4', lg: 'py-6', xl: 'py-8', '2xl': 'py-12' }[props.block.props.paddingY] || 'py-4'
  return `${x} ${y}`
})

const bgClass = computed(() => {
  switch (props.block.props.background) {
    case 'surface': return 'bg-[var(--t-color-surface)]'
    case 'surface-elevated': return 'bg-[var(--t-color-surface-elevated)]'
    case 'primary': return 'bg-[var(--t-color-primary)] text-[var(--t-color-primary-foreground)]'
    case 'secondary': return 'bg-[var(--t-color-secondary)] text-[var(--t-color-secondary-foreground)]'
    default: return ''
  }
})

const alignClass = computed(() => ({
  right: 'text-right',
  center: 'text-center',
  left: 'text-left',
  justify: 'text-justify'
}[props.block.props.align] || 'text-right'))

const gapClass = computed(() => ({
  none: 'gap-0', sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8', '2xl': 'gap-12'
}[props.block.props.gap] || 'gap-4'))

defineEmits<{ 'select-block': [id: string] }>()
</script>

<template>
  <div :class="['w-full', bgClass]">
    <div :class="['mx-auto', maxWidthClass, paddingClass, alignClass]">
      <div :class="['flex flex-col', gapClass]">
        <template v-if="block.children?.length">
          <BlockRenderer
            v-for="child in block.children"
            :key="child.id"
            :block="child"
            :editing="editing"
            @select-block="$emit('select-block', $event)"
          />
        </template>
        <div v-else-if="editing" class="t-drop-zone">
          اسحب blocks هنا
        </div>
      </div>
    </div>
  </div>
</template>
