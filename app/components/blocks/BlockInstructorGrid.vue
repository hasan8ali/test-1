<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
const pad = { none: '0', sm: '24px', md: '48px', lg: '64px', xl: '96px' }

// Demo instructors
const instructors = [
  { name: 'م. أحمد علي', title: 'مهندس برمجيات' },
  { name: 'م. سارة حسن', title: 'مطوّرة ويب' },
  { name: 'د. خالد محمد', title: 'أستاذ جامعي' }
]
</script>
<template>
  <section :style="{ paddingTop: pad[block.props.paddingY as keyof typeof pad] || '64px', paddingBottom: pad[block.props.paddingY as keyof typeof pad] || '64px', paddingRight: '24px', paddingLeft: '24px' }">
    <div :style="{ maxWidth: '1200px', margin: '0 auto' }">
      <h2 v-if="block.props.title" :style="{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, textAlign: 'center', marginBottom: '40px', letterSpacing: '-0.02em' }">
        {{ block.props.title }}
      </h2>
      <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '24px' }">
        <div v-for="(inst, i) in instructors" :key="i" :style="{ textAlign: 'center' }">
          <div :style="{ width: '96px', height: '96px', borderRadius: '50%', background: 'var(--canvas-accent)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 700, color: 'var(--canvas-accent-fg)' }">
            {{ inst.name.charAt(0) }}
          </div>
          <h3 :style="{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '4px' }">{{ inst.name }}</h3>
          <p :style="{ fontSize: '0.85rem', color: 'var(--canvas-text-muted)' }">{{ inst.title }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
