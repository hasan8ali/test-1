<script setup lang="ts">
import { computed } from 'vue'
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()

/**
 * SANDBOXED Custom Code Block.
 * Runs in an isolated iframe with sandbox="allow-scripts" only.
 * No allow-same-origin = no access to parent's cookies, storage, or DOM.
 * This is a hard security boundary — never add more sandbox flags.
 */
const srcdoc = computed(() => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;font-family:sans-serif}</style></head><body>${props.block.props.html || ''}</body></html>`)
</script>
<template>
  <iframe
    :srcdoc="srcdoc"
    sandbox="allow-scripts"
    :style="{ width: '100%', height: (block.props.height || 200) + 'px', border: 'none', display: 'block', borderRadius: '8px' }"
    referrerpolicy="no-referrer"
    loading="lazy"
  />
</template>
