<script setup lang="ts">
import { ref } from 'vue'
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
const pad = { none: '0', sm: '24px', md: '48px', lg: '64px', xl: '96px' }
const open = ref(0)
const toggle = (i: number) => { open.value = open.value === i ? -1 : i }
</script>
<template>
  <section :style="{ paddingTop: pad[block.props.paddingY as keyof typeof pad] || '64px', paddingBottom: pad[block.props.paddingY as keyof typeof pad] || '64px', paddingRight: '24px', paddingLeft: '24px' }">
    <div :style="{ maxWidth: '760px', margin: '0 auto' }">
      <h2 v-if="block.props.title" :style="{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, textAlign: 'center', marginBottom: '32px', letterSpacing: '-0.02em' }">
        {{ block.props.title }}
      </h2>
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
        <div
          v-for="(item, i) in block.props.items"
          :key="i"
          :style="{ border: '1px solid var(--canvas-border)', borderRadius: '8px', overflow: 'hidden' }"
        >
          <button
            @click="editing ? null : toggle(i)"
            :style="{ width: '100%', textAlign: 'right', padding: '16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem', fontWeight: 500, color: 'inherit' }"
          >
            <span>{{ item.q }}</span>
            <UIcon :name="open === i ? 'i-lucide-minus' : 'i-lucide-plus'" :style="{ flexShrink: 0, opacity: 0.6 }" />
          </button>
          <div v-show="open === i" :style="{ padding: '0 16px 16px', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--canvas-text-muted)' }">
            {{ item.a }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
