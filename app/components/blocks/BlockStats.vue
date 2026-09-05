<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()
</script>

<template>
  <section class="py-16 px-6">
    <div class="mx-auto max-w-5xl">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div
          v-for="(item, i) in block.props.items"
          :key="i"
          class="text-center p-6 rounded-2xl bg-[var(--t-color-surface-elevated)]"
        >
          <div class="text-4xl md:text-5xl font-extrabold text-[var(--t-color-primary)] mb-2">
            {{ item.value }}
          </div>
          <div class="text-sm text-[var(--t-color-text-muted)] font-medium">
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
