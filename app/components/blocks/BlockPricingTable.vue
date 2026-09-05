<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
const pad = { none: '0', sm: '24px', md: '48px', lg: '64px', xl: '96px' }
</script>
<template>
  <section :style="{ paddingTop: pad[block.props.paddingY as keyof typeof pad] || '64px', paddingBottom: pad[block.props.paddingY as keyof typeof pad] || '64px', paddingRight: '24px', paddingLeft: '24px' }">
    <div :style="{ maxWidth: '1200px', margin: '0 auto' }">
      <h2 v-if="block.props.title" :style="{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, textAlign: 'center', marginBottom: '40px', letterSpacing: '-0.02em' }">
        {{ block.props.title }}
      </h2>
      <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }">
        <div
          v-for="(plan, i) in block.props.plans"
          :key="i"
          :style="{
            padding: '32px 24px',
            borderRadius: '12px',
            border: plan.featured ? '2px solid var(--canvas-accent)' : '1px solid var(--canvas-border)',
            background: 'var(--canvas-bg)',
            position: 'relative'
          }"
        >
          <div v-if="plan.featured" :style="{ position: 'absolute', top: '-12px', right: '24px', background: 'var(--canvas-accent)', color: 'var(--canvas-accent-fg)', padding: '2px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }">
            الأكثر شعبية
          </div>
          <h3 :style="{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }">{{ plan.name }}</h3>
          <div :style="{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }">
            <span :style="{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }">{{ plan.price }}</span>
            <span :style="{ color: 'var(--canvas-text-muted)' }">{{ plan.currency }}</span>
          </div>
          <ul :style="{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '8px' }">
            <li v-for="(f, j) in plan.features" :key="j" :style="{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }">
              <UIcon name="i-lucide-check" :style="{ color: 'var(--canvas-accent)', flexShrink: 0 }" />
              <span>{{ f }}</span>
            </li>
          </ul>
          <a
            :href="editing ? '#' : plan.ctaHref"
            :style="{
              display: 'block',
              textAlign: 'center',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              background: plan.featured ? 'var(--canvas-accent)' : 'transparent',
              color: plan.featured ? 'var(--canvas-accent-fg)' : 'var(--canvas-text)',
              border: plan.featured ? 'none' : '1px solid var(--canvas-border)'
            }"
          >
            {{ plan.ctaText }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
