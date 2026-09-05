<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
const styles: Record<string, string> = {
  solid: '1px solid var(--canvas-border)',
  dashed: '1px dashed var(--canvas-border)',
  dotted: '1px dotted var(--canvas-border)'
}
</script>
<template>
  <hr :style="{ border: '0', borderTop: styles[block.props.style] || styles.solid, margin: '16px 0' }">
</template>
