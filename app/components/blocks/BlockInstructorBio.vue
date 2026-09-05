<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
const pad = { none: '0', sm: '24px', md: '48px', lg: '64px', xl: '96px' }
</script>
<template>
  <section :style="{ paddingTop: pad[block.props.paddingY as keyof typeof pad] || '64px', paddingBottom: pad[block.props.paddingY as keyof typeof pad] || '64px', paddingRight: '24px', paddingLeft: '24px' }">
    <div :style="{ maxWidth: '760px', margin: '0 auto', display: 'flex', gap: '32px', alignItems: 'center' }">
      <div :style="{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--canvas-accent)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 700, color: 'var(--canvas-accent-fg)' }">
        {{ (block.props.name || '?').charAt(0) }}
      </div>
      <div>
        <h2 :style="{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '4px' }">{{ block.props.name }}</h2>
        <p :style="{ color: 'var(--canvas-accent)', fontSize: '0.9rem', marginBottom: '12px' }">{{ block.props.title }}</p>
        <p :style="{ color: 'var(--canvas-text-muted)', lineHeight: 1.6 }">{{ block.props.bio }}</p>
      </div>
    </div>
  </section>
</template>
