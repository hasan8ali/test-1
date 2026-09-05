<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()
</script>

<template>
  <div class="bg-[var(--t-color-surface-elevated)] rounded-2xl p-6 md:p-8">
    <div class="flex gap-1 mb-4">
      <UIcon
        v-for="i in 5"
        :key="i"
        :name="i <= block.props.rating ? 'i-lucide-star' : 'i-lucide-star'"
        :class="i <= block.props.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'"
      />
    </div>
    <blockquote class="text-lg leading-relaxed mb-6">
      "{{ block.props.quote }}"
    </blockquote>
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-full overflow-hidden bg-[var(--t-color-surface)] flex-shrink-0">
        <img v-if="block.props.authorImage" :src="block.props.authorImage" :alt="block.props.authorName" class="w-full h-full object-cover">
        <div v-else class="w-full h-full flex items-center justify-center text-[var(--t-color-text-muted)]">
          <UIcon name="i-lucide-user" />
        </div>
      </div>
      <div>
        <div class="font-bold">{{ block.props.authorName }}</div>
        <div class="text-sm text-[var(--t-color-text-muted)]">{{ block.props.authorTitle }}</div>
      </div>
    </div>
  </div>
</template>
