<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const heightClass = computed(() => ({
  sm: 'h-2', md: 'h-4', lg: 'h-8', xl: 'h-12', '2xl': 'h-16', '3xl': 'h-24'
}[props.block.props.size] || 'h-8'))
</script>

<template>
  <div :class="['w-full', heightClass]" />
</template>
