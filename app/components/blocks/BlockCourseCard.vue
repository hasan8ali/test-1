<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()
</script>

<template>
  <div class="bg-[var(--t-color-surface-elevated)] rounded-2xl overflow-hidden border border-[var(--t-color-border)] hover:shadow-xl transition-all hover:-translate-y-1">
    <div class="aspect-video bg-gradient-to-br from-[var(--t-color-primary)] to-[var(--t-color-secondary)] flex items-center justify-center relative">
      <UIcon name="i-lucide-graduation-cap" class="text-white text-5xl" />
      <button class="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
        <div class="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
          <UIcon name="i-lucide-play" class="text-[var(--t-color-primary)] text-2xl ms-1" />
        </div>
      </button>
    </div>
    <div class="p-5">
      <div class="flex items-center gap-2 mb-2 text-sm">
        <UIcon name="i-lucide-star" class="text-yellow-400" />
        <span class="font-bold">{{ block.props.rating }}</span>
        <span class="text-[var(--t-color-text-muted)]">·</span>
        <span class="text-[var(--t-color-text-muted)]">{{ block.props.students.toLocaleString('ar-EG') }} طالب</span>
      </div>
      <h3 class="font-bold text-lg mb-1 line-clamp-2">{{ block.props.title }}</h3>
      <p class="text-sm text-[var(--t-color-text-muted)] mb-3">{{ block.props.instructor }}</p>
      <div class="flex items-center gap-2 text-sm text-[var(--t-color-text-muted)] mb-4">
        <UIcon name="i-lucide-clock" />
        <span>{{ block.props.duration }}</span>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-extrabold text-[var(--t-color-primary)]">{{ block.props.price }}</span>
          <span class="text-sm">{{ block.props.currency }}</span>
        </div>
        <a :href="block.props.href" class="text-sm font-bold text-[var(--t-color-primary)] hover:underline">
          عرض الكورس ←
        </a>
      </div>
    </div>
  </div>
</template>
