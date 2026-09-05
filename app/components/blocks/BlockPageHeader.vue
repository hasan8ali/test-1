<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()
const pad = { none: '0', sm: '24px', md: '48px', lg: '64px', xl: '96px' }
</script>
<template>
  <section :style="{ paddingTop: pad[block.props.paddingY as keyof typeof pad] || '48px', paddingBottom: pad[block.props.paddingY as keyof typeof pad] || '48px', paddingRight: '24px', paddingLeft: '24px' }">
    <div :style="{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }">
      <h1 :style="{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: block.props.subtitle ? '12px' : '0' }">
        {{ block.props.title }}
      </h1>
      <p v-if="block.props.subtitle" :style="{ fontSize: '1.15rem', color: 'var(--canvas-text-muted)' }">
        {{ block.props.subtitle }}
      </p>
    </div>
  </section>
</template>
