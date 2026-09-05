<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const bgClass = computed(() => {
  switch (props.block.props.background) {
    case 'gradient':
      return 'bg-gradient-to-br from-[var(--t-color-primary)] via-[var(--t-color-secondary)] to-[var(--t-color-accent)] text-white'
    case 'solid':
      return 'bg-[var(--t-color-primary)] text-[var(--t-color-primary-foreground)]'
    case 'image':
      return props.block.props.image
        ? 'text-white'
        : 'bg-[var(--t-color-surface)] text-[var(--t-color-text)]'
    default:
      return 'bg-[var(--t-color-bg)] text-[var(--t-color-text)]'
  }
})

const bgStyle = computed(() => {
  if (props.block.props.background === 'image' && props.block.props.image) {
    return `background: linear-gradient(rgba(15,23,42,0.7), rgba(15,23,42,0.8)), url(${props.block.props.image}); background-size: cover; background-position: center;`
  }
  return ''
})

const layoutClass = computed(() => {
  switch (props.block.props.layout) {
    case 'split-right': return 'grid md:grid-cols-2 gap-12 items-center'
    case 'split-left': return 'grid md:grid-cols-2 gap-12 items-center'
    case 'centered': return 'text-center max-w-3xl mx-auto'
    case 'full-bg': return 'text-center max-w-3xl mx-auto min-h-[60vh] flex flex-col justify-center'
    default: return 'text-center max-w-3xl mx-auto'
  }
})

const alignClass = computed(() => ({
  right: 'text-right', center: 'text-center', left: 'text-left'
}[props.block.props.align] || 'text-right'))

// For split layouts, image goes either side
const imageOrder = computed(() => props.block.props.layout === 'split-left' ? 'order-1' : 'order-2')
const contentOrder = computed(() => props.block.props.layout === 'split-left' ? 'order-2' : 'order-1')

const isSplit = computed(() => ['split-right', 'split-left'].includes(props.block.props.layout))
</script>

<template>
  <section :class="['py-16 px-6', bgClass]" :style="bgStyle">
    <div :class="['mx-auto max-w-6xl', layoutClass, alignClass]">
      <!-- Image side (for split layouts) -->
      <div v-if="isSplit && block.props.image" :class="imageOrder">
        <img
          :src="block.props.image"
          alt=""
          class="rounded-2xl shadow-2xl w-full"
        >
      </div>

      <!-- Content side -->
      <div :class="[isSplit ? contentOrder : '']">
        <span v-if="block.props.eyebrow" class="inline-block text-sm font-semibold mb-3 opacity-80 tracking-wider uppercase">
          {{ block.props.eyebrow }}
        </span>
        <h1 class="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
          {{ block.props.title }}
        </h1>
        <p class="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
          {{ block.props.subtitle }}
        </p>
        <div class="flex flex-wrap gap-4" :class="alignClass === 'text-center' ? 'justify-center' : 'justify-start'">
          <a
            v-if="block.props.primaryButton"
            :href="block.props.primaryButton.href"
            class="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white text-[var(--t-color-primary)] font-bold hover:scale-105 transition-transform shadow-lg"
          >
            {{ block.props.primaryButton.text }}
          </a>
          <a
            v-if="block.props.secondaryButton"
            :href="block.props.secondaryButton.href"
            class="inline-flex items-center gap-2 px-7 py-3 rounded-xl border-2 border-white/30 text-white font-bold hover:bg-white/10 transition-colors"
          >
            {{ block.props.secondaryButton.text }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
