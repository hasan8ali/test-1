<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
const pad: Record<string, string> = { none: '0', sm: '24px', md: '48px', lg: '64px', xl: '96px' }

const courses = [
  { title: 'تعلّم React من الصفر', instructor: 'م. أحمد', price: '299', rating: 4.8, students: 1240, duration: '12h' },
  { title: 'Vue.js المتقدم', instructor: 'م. سارة', price: '399', rating: 4.9, students: 890, duration: '15h' },
  { title: 'تصميم UI/UX', instructor: 'أ. خالد', price: '499', rating: 4.7, students: 2100, duration: '20h' },
  { title: 'Node.js والـ APIs', instructor: 'م. أحمد', price: '349', rating: 4.8, students: 1560, duration: '18h' },
  { title: 'Python للمبتدئين', instructor: 'د. منى', price: '249', rating: 4.6, students: 3200, duration: '10h' },
  { title: 'Tailwind CSS', instructor: 'م. سارة', price: '199', rating: 4.9, students: 980, duration: '8h' }
]

const gridCols = "repeat(auto-fill, minmax(min(100%, 280px), 1fr))"
</script>

<template>
  <section :style="{ paddingTop: pad[block.props.paddingY] || '64px', paddingBottom: pad[block.props.paddingY] || '64px', paddingRight: '24px', paddingLeft: '24px' }">
    <div :style="{ maxWidth: '1200px', margin: '0 auto' }">
      <h2 v-if="block.props.title" :style="{ fontSize: '1.875rem', fontWeight: 700, textAlign: 'center', marginBottom: '40px' }">
        {{ block.props.title }}
      </h2>
      <div :style="{ display: 'grid', gridTemplateColumns: gridCols, gap: '20px' }">
        <div
          v-for="(c, i) in courses"
          :key="i"
          :style="{ border: '1px solid var(--canvas-border)', borderRadius: '12px', overflow: 'hidden' }"
        >
          <div :style="{ aspectRatio: '16 / 9', background: 'linear-gradient(135deg, var(--canvas-accent), var(--canvas-text))', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
            <UIcon name="i-lucide-graduation-cap" :style="{ color: 'var(--canvas-accent-fg)', fontSize: '40px' }" />
          </div>
          <div :style="{ padding: '16px' }">
            <div :style="{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.8rem' }">
              <UIcon name="i-lucide-star" :style="{ color: '#facc15' }" />
              <span :style="{ fontWeight: 600 }">{{ c.rating }}</span>
              <span :style="{ color: 'var(--canvas-text-muted)' }">{{ c.students.toLocaleString() }} طالب</span>
            </div>
            <h3 :style="{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }">{{ c.title }}</h3>
            <p :style="{ fontSize: '0.85rem', color: 'var(--canvas-text-muted)', marginBottom: '12px' }">{{ c.instructor }}</p>
            <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
              <div :style="{ display: 'flex', alignItems: 'baseline', gap: '2px' }">
                <span :style="{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--canvas-accent)' }">{{ c.price }}</span>
                <span :style="{ fontSize: '0.8rem' }">ج.م</span>
              </div>
              <span :style="{ fontSize: '0.8rem', color: 'var(--canvas-text-muted)' }">{{ c.duration }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
