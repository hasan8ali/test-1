<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()

const bg: Record<string, string> = {
  light: 'var(--canvas-bg)',
  dark: 'var(--canvas-text)',
  accent: 'var(--canvas-accent)'
}
const fg: Record<string, string> = {
  light: 'var(--canvas-text)',
  dark: 'var(--canvas-bg)',
  accent: 'var(--canvas-accent-fg)'
}
const pad = { none: '0', sm: '24px', md: '48px', lg: '64px', xl: '96px', '2xl': '128px' }
const aligns: Record<string, string> = { right: 'right', center: 'center', left: 'left' }
</script>
<template>
  <section
    :style="{
      background: bg[block.props.background] || bg.light,
      color: fg[block.props.background] || fg.light,
      paddingTop: pad[block.props.paddingY as keyof typeof pad] || '48px',
      paddingBottom: pad[block.props.paddingY as keyof typeof pad] || '48px',
      paddingRight: '24px',
      paddingLeft: '24px'
    }"
  >
    <div :style="{ maxWidth: '1200px', margin: '0 auto', textAlign: aligns[block.props.align] || 'center' }">
      <p
        v-if="block.props.eyebrow"
        :style="{
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          opacity: 0.7,
          marginBottom: '12px'
        }"
      >
        {{ block.props.eyebrow }}
      </p>
      <h1 :style="{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '16px' }">
        {{ block.props.title }}
      </h1>
      <p :style="{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', opacity: 0.8, lineHeight: 1.6, marginBottom: '32px', maxWidth: '600px', margin: block.props.align === 'center' ? '0 auto 32px' : '0 0 32px' }">
        {{ block.props.subtitle }}
      </p>
      <div :style="{ display: 'flex', gap: '12px', justifyContent: aligns[block.props.align] === 'left' ? 'flex-start' : aligns[block.props.align] === 'right' ? 'flex-start' : 'center', flexWrap: 'wrap' }">
        <a
          v-if="block.props.primaryButton?.text"
          :href="editing ? '#' : block.props.primaryButton.href"
          :style="{
            display: 'inline-block',
            padding: '14px 28px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            textDecoration: 'none',
            background: block.props.background === 'accent' ? fg[block.props.background] : 'var(--canvas-accent)',
            color: block.props.background === 'accent' ? bg[block.props.background] : 'var(--canvas-accent-fg)'
          }"
        >
          {{ block.props.primaryButton.text }}
        </a>
        <a
          v-if="block.props.secondaryButton?.text"
          :href="editing ? '#' : block.props.secondaryButton.href"
          :style="{
            display: 'inline-block',
            padding: '14px 28px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            textDecoration: 'none',
            border: `1px solid ${block.props.background === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`,
            color: 'inherit'
          }"
        >
          {{ block.props.secondaryButton.text }}
        </a>
      </div>
    </div>
  </section>
</template>
