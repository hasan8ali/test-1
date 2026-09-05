<script setup lang="ts">
import { ref } from 'vue'
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const open = ref<number | null>(0)

const toggle = (i: number) => {
  open.value = open.value === i ? null : i
}
</script>

<template>
  <section class="py-16 px-6">
    <div class="mx-auto max-w-3xl">
      <h2 v-if="block.props.title" class="text-3xl md:text-4xl font-bold text-center mb-10">
        {{ block.props.title }}
      </h2>
      <div class="space-y-3">
        <div
          v-for="(item, i) in block.props.items"
          :key="i"
          class="bg-[var(--t-color-surface-elevated)] rounded-xl overflow-hidden border border-[var(--t-color-border)]"
        >
          <button
            class="w-full flex items-center justify-between p-5 text-right font-semibold hover:bg-[var(--t-color-surface)] transition-colors"
            @click="toggle(i)"
            :disabled="editing"
          >
            <span>{{ item.question }}</span>
            <UIcon
              :name="open === i ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              class="flex-shrink-0 transition-transform"
            />
          </button>
          <div v-show="open === i" class="px-5 pb-5 text-[var(--t-color-text-muted)] leading-relaxed">
            {{ item.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
