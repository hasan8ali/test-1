<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
const pad = { none: '0', sm: '24px', md: '48px', lg: '64px', xl: '96px' }
</script>
<template>
  <section :style="{ paddingTop: pad[block.props.paddingY as keyof typeof pad] || '48px', paddingBottom: pad[block.props.paddingY as keyof typeof pad] || '48px', paddingRight: '24px', paddingLeft: '24px' }">
    <div :style="{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '24px', textAlign: 'center' }">
      <div v-for="(item, i) in block.props.items" :key="i">
        <div :style="{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--canvas-accent)', letterSpacing: '-0.02em', lineHeight: 1 }">
          {{ item.value }}
        </div>
        <div :style="{ fontSize: '0.85rem', color: 'var(--canvas-text-muted)', marginTop: '4px' }">
          {{ item.label }}
        </div>
      </div>
    </div>
  </section>
</template>
