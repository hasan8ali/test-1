<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

/**
 * Custom HTML block — renders user-provided HTML/CSS/JS in a fully
 * SANDBOXED iframe. The iframe has no same-origin access, no access to
 * cookies/localStorage, no forms submission, no popups. Only scripts run.
 * Communication with the host is via postMessage (future feature).
 *
 * This is a critical security boundary — never relax these flags.
 */
const iframeRef = ref<HTMLIFrameElement | null>(null)

const srcDoc = computed(() => {
  return `<!DOCTYPE html>
<html dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body {
    margin: 0;
    padding: 0;
    font-family: 'Cairo', system-ui, sans-serif;
    background: transparent;
  }
  /* Theme tokens pass-through (read-only) */
  :root {
    --t-color-primary: var(--host-primary, #6366f1);
    --t-color-text: var(--host-text, #0f172a);
    --t-color-surface: var(--host-surface, #ffffff);
  }
</style>
</head>
<body>
${props.block.props.html || ''}
</body>
</html>`
})

const sandbox = 'allow-scripts' // NOTE: NO allow-same-origin, NO allow-forms, NO allow-popups
</script>

<template>
  <div class="w-full">
    <iframe
      ref="iframeRef"
      :srcdoc="srcDoc"
      :sandbox="sandbox"
      :style="{ width: '100%', height: `${block.props.height || 200}px`, border: 'none', display: 'block' }"
      loading="lazy"
      referrerpolicy="no-referrer"
    />
  </div>
</template>
