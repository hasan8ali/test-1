<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
const heights = { sm: '8px', md: '16px', lg: '32px', xl: '64px', '2xl': '96px', '3xl': '128px' }
</script>
<template>
  <div :style="{ height: heights[block.props.size as keyof typeof heights] || '32px' }" />
</template>
