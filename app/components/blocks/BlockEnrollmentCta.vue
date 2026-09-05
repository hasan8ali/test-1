<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
const pad = { none: '0', sm: '24px', md: '48px', lg: '64px', xl: '96px' }
const bgs: Record<string, string> = {
  accent: 'var(--canvas-accent)',
  dark: 'var(--canvas-text)',
  light: 'var(--canvas-surface)'
}
const fgs: Record<string, string> = {
  accent: 'var(--canvas-accent-fg)',
  dark: 'var(--canvas-bg)',
  light: 'var(--canvas-text)'
}
</script>
<template>
  <section
    :style="{
      background: bgs[block.props.background] || bgs.accent,
      color: fgs[block.props.background] || fgs.accent,
      paddingTop: pad[block.props.paddingY as keyof typeof pad] || '64px',
      paddingBottom: pad[block.props.paddingY as keyof typeof pad] || '64px',
      paddingRight: '24px',
      paddingLeft: '24px'
    }"
  >
    <div :style="{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }">
      <h2 :style="{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px' }">
        {{ block.props.title }}
      </h2>
      <p :style="{ fontSize: '1.1rem', opacity: 0.85, marginBottom: '32px' }">
        {{ block.props.subtitle }}
      </p>
      <a
        :href="editing ? '#' : block.props.buttonHref"
        :style="{
          display: 'inline-block',
          padding: '14px 32px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 600,
          textDecoration: 'none',
          background: block.props.background === 'accent' ? 'var(--canvas-accent-fg)' : 'var(--canvas-accent)',
          color: block.props.background === 'accent' ? 'var(--canvas-accent)' : 'var(--canvas-accent-fg)'
        }"
      >
        {{ block.props.buttonText }}
      </a>
    </div>
  </section>
</template>
