<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
const pad: Record<string, string> = { none: '0', sm: '24px', md: '48px', lg: '64px', xl: '96px' }
</script>

<template>
  <section :style="{ paddingTop: pad[block.props.paddingY] || '64px', paddingBottom: pad[block.props.paddingY] || '64px', paddingRight: '24px', paddingLeft: '24px' }">
    <div :style="{ maxWidth: '1000px', margin: '0 auto' }">
      <h2 v-if="block.props.title" :style="{ fontSize: '1.875rem', fontWeight: 700, textAlign: 'center', marginBottom: '40px', letterSpacing: '-0.02em' }">
        {{ block.props.title }}
      </h2>
      <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px' }">
        <div
          v-for="(t, i) in block.props.testimonials"
          :key="i"
          :style="{ padding: '24px', borderRadius: '12px', background: 'var(--canvas-surface)' }"
        >
          <div :style="{ display: 'flex', gap: '2px', marginBottom: '12px' }">
            <UIcon
              v-for="n in 5"
              :key="n"
              name="i-lucide-star"
              :style="{ color: n <= (t.rating || 5) ? '#facc15' : 'var(--canvas-border)', fontSize: '14px' }"
            />
          </div>
          <p :style="{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '16px' }">{{ t.quote }}</p>
          <div :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
            <div :style="{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--canvas-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: 'var(--canvas-accent-fg)' }">
              {{ (t.name || '?').charAt(0) }}
            </div>
            <div>
              <div :style="{ fontSize: '0.9rem', fontWeight: 600 }">{{ t.name }}</div>
              <div :style="{ fontSize: '0.8rem', color: 'var(--canvas-text-muted)' }">{{ t.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
