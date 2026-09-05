<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const widthStyle = computed(() => {
  switch (props.block.props.width) {
    case '100%': return 'width: 100%'
    case '50%': return 'width: 50%'
    case '320px': return 'width: 320px'
    case '640px': return 'width: 640px'
    case '1024px': return 'width: 1024px'
    default: return 'width: auto; max-width: 100%'
  }
})

const radiusClass = computed(() => ({
  none: 'rounded-none', sm: 'rounded-sm', md: 'rounded-md',
  lg: 'rounded-lg', xl: 'rounded-xl', full: 'rounded-full'
}[props.block.props.radius] || 'rounded-lg'))

const shadowClass = computed(() => ({
  none: 'shadow-none', sm: 'shadow-sm', md: 'shadow-md',
  lg: 'shadow-lg', xl: 'shadow-xl'
}[props.block.props.shadow] || 'shadow-md'))

const alignClass = computed(() => ({
  right: 'mr-auto', center: 'mx-auto', left: 'ml-auto'
}[props.block.props.align] || 'mx-auto'))
</script>

<template>
  <div v-if="!block.props.src" class="t-drop-zone">
    <UIcon name="i-lucide-image" class="text-2xl mb-2" />
    <p>اختر صورة من الـ Inspector</p>
  </div>
  <img
    v-else
    :src="block.props.src"
    :alt="block.props.alt"
    :class="['block', radiusClass, shadowClass, alignClass]"
    :style="widthStyle"
    loading="lazy"
  >
</template>
