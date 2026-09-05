<script setup lang="ts">
import { ref } from 'vue'
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
const pad = { none: '0', sm: '24px', md: '48px', lg: '64px', xl: '96px' }
const open = ref<Record<number, boolean>>({ 0: true })
</script>
<template>
  <section :style="{ paddingTop: pad[block.props.paddingY as keyof typeof pad] || '64px', paddingBottom: pad[block.props.paddingY as keyof typeof pad] || '64px', paddingRight: '24px', paddingLeft: '24px' }">
    <div :style="{ maxWidth: '800px', margin: '0 auto' }">
      <h2 v-if="block.props.title" :style="{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '32px', letterSpacing: '-0.02em' }">
        {{ block.props.title }}
      </h2>
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '24px' }">
        <div v-for="(section, i) in block.props.sections" :key="i">
          <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }">
            <h3 :style="{ fontSize: '1.1rem', fontWeight: 600 }">{{ section.title }}</h3>
            <span :style="{ fontSize: '0.8rem', color: 'var(--canvas-text-muted)' }">{{ section.lessons.length }} دروس</span>
          </div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '4px' }">
            <div
              v-for="(lesson, j) in section.lessons"
              :key="j"
              :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '8px', background: 'var(--canvas-surface)', fontSize: '0.9rem' }"
            >
              <div :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
                <UIcon name="i-lucide-play-circle" :style="{ color: 'var(--canvas-accent)' }" />
                <span>{{ lesson.title }}</span>
              </div>
              <span :style="{ color: 'var(--canvas-text-muted)', fontSize: '0.8rem' }">{{ lesson.duration }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
