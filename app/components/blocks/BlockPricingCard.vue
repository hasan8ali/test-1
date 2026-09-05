<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()
</script>

<template>
  <div
    :class="[
      'rounded-2xl p-8 border-2 transition-all',
      block.props.featured
        ? 'border-[var(--t-color-primary)] shadow-2xl relative overflow-hidden'
        : 'border-[var(--t-color-border)]'
    ]"
  >
    <div
      v-if="block.props.featured"
      class="absolute top-0 right-0 bg-[var(--t-color-primary)] text-[var(--t-color-primary-foreground)] text-xs font-bold px-3 py-1 rounded-bl-lg"
    >
      الأكثر شعبية
    </div>
    <h3 class="text-xl font-bold mb-1">{{ block.props.name }}</h3>
    <p v-if="block.props.description" class="text-[var(--t-color-text-muted)] text-sm mb-4">
      {{ block.props.description }}
    </p>
    <div class="flex items-baseline gap-1 mb-6">
      <span class="text-4xl font-extrabold text-[var(--t-color-primary)]">{{ block.props.price }}</span>
      <span class="text-lg">{{ block.props.currency }}</span>
      <span class="text-sm text-[var(--t-color-text-muted)]">{{ block.props.period }}</span>
    </div>
    <ul class="space-y-3 mb-6">
      <li v-for="(f, i) in block.props.features" :key="i" class="flex items-start gap-2">
        <UIcon name="i-lucide-check" class="text-[var(--t-color-success)] mt-1 flex-shrink-0" />
        <span class="text-sm">{{ f }}</span>
      </li>
    </ul>
    <a
      :href="block.props.ctaHref"
      :class="[
        'block text-center py-3 rounded-xl font-bold transition-all',
        block.props.featured
          ? 'bg-[var(--t-color-primary)] text-[var(--t-color-primary-foreground)] hover:opacity-90'
          : 'border-2 border-[var(--t-color-primary)] text-[var(--t-color-primary)] hover:bg-[var(--t-color-primary)] hover:text-[var(--t-color-primary-foreground)]'
      ]"
    >
      {{ block.props.ctaText }}
    </a>
  </div>
</template>
