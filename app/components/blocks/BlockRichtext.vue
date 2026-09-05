<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const sizeClass = computed(() => ({
  sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl'
}[props.block.props.size] || 'text-base'))

const alignClass = computed(() => ({
  right: 'text-right', center: 'text-center', left: 'text-left', justify: 'text-justify'
}[props.block.props.align] || 'text-right'))

// Render sanitized HTML (server-side sanitization happens on save)
const html = computed(() => props.block.props.html || '')
</script>

<template>
  <div :class="['prose prose-lg max-w-none', sizeClass, alignClass]" v-html="html" />
</template>
