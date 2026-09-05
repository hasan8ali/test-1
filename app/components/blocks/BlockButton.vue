<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()

const variants: Record<string, any> = {
  primary: { background: 'var(--canvas-accent)', color: 'var(--canvas-accent-fg)' },
  secondary: { background: 'var(--canvas-text)', color: 'var(--canvas-bg)' },
  outline: { background: 'transparent', color: 'var(--canvas-text)', border: '1px solid var(--canvas-border)' },
  ghost: { background: 'transparent', color: 'var(--canvas-text)' }
}
const sizes: Record<string, string> = { sm: '6px 14px', md: '10px 18px', lg: '14px 24px', xl: '18px 32px' }
const aligns: Record<string, string> = { right: 'flex-start', center: 'center', left: 'flex-end' }
</script>
<template>
  <div :style="{ display: 'flex', justifyContent: aligns[block.props.align] || 'flex-start' }">
    <a
      :href="editing ? '#' : block.props.href"
      :style="{
        display: 'inline-block',
        padding: sizes[block.props.size] || '10px 18px',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: 600,
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'opacity 0.15s',
        ...variants[block.props.variant] || variants.primary
      }"
    >
      {{ block.props.text }}
    </a>
  </div>
</template>
