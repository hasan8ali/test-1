<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
const pad = { none: '0', sm: '24px', md: '48px', lg: '64px', xl: '96px' }
</script>
<template>
  <section :style="{ paddingTop: pad[block.props.paddingY as keyof typeof pad] || '64px', paddingBottom: pad[block.props.paddingY as keyof typeof pad] || '64px', paddingRight: '24px', paddingLeft: '24px' }">
    <div :style="{ maxWidth: '1200px', margin: '0 auto' }">
      <div :style="{ textAlign: 'center', marginBottom: '48px' }">
        <h2 v-if="block.props.title" :style="{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }">
          {{ block.props.title }}
        </h2>
        <p v-if="block.props.subtitle" :style="{ color: 'var(--canvas-text-muted)', fontSize: '1.05rem' }">
          {{ block.props.subtitle }}
        </p>
      </div>
      <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px' }">
        <div
          v-for="(f, i) in block.props.features"
          :key="i"
          :style="{
            padding: '24px',
            borderRadius: '12px',
            background: 'var(--canvas-surface)'
          }"
        >
          <div :style="{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--canvas-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }">
            <UIcon :name="f.icon" style="font-size: 20px; color: var(--canvas-accent-fg)" />
          </div>
          <h3 :style="{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }">{{ f.title }}</h3>
          <p :style="{ fontSize: '0.9rem', color: 'var(--canvas-text-muted)', lineHeight: 1.55 }">{{ f.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
