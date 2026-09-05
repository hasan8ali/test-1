<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const bgClass = computed(() => {
  switch (props.block.props.background) {
    case 'gradient':
      return 'bg-gradient-to-br from-[var(--t-color-primary)] to-[var(--t-color-secondary)] text-white'
    case 'solid':
      return 'bg-[var(--t-color-primary)] text-[var(--t-color-primary-foreground)]'
    default:
      return 'bg-[var(--t-color-surface)] text-[var(--t-color-text)]'
  }
})
</script>

<template>
  <section :class="['py-16 px-6', bgClass]">
    <div class="mx-auto max-w-3xl text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-3">{{ block.props.title }}</h2>
      <p class="text-lg opacity-90 mb-8">{{ block.props.subtitle }}</p>
      <a
        :href="block.props.buttonHref"
        class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[var(--t-color-primary)] font-bold text-lg hover:scale-105 transition-transform shadow-lg"
      >
        {{ block.props.buttonText }}
        <UIcon name="i-lucide-arrow-left" />
      </a>
    </div>
  </section>
</template>
