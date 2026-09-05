<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const colsClass = computed(() => {
  const c = props.block.props.columns || 3
  return `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${c} gap-6`
})
</script>

<template>
  <section class="py-16 px-6">
    <div class="mx-auto max-w-6xl">
      <div class="text-center mb-12">
        <h2 v-if="block.props.title" class="text-3xl md:text-4xl font-bold mb-3">
          {{ block.props.title }}
        </h2>
        <p v-if="block.props.subtitle" class="text-lg text-[var(--t-color-text-muted)]">
          {{ block.props.subtitle }}
        </p>
      </div>
      <div class="grid gap-6" :style="{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 280px), 1fr))` }">
        <div
          v-for="(f, i) in block.props.features"
          :key="i"
          class="bg-[var(--t-color-surface-elevated)] rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
        >
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--t-color-primary)]/10 text-[var(--t-color-primary)] mb-4">
            <UIcon :name="f.icon" class="text-2xl" />
          </div>
          <h3 class="text-lg font-bold mb-2">{{ f.title }}</h3>
          <p class="text-[var(--t-color-text-muted)] text-sm leading-relaxed">{{ f.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
