<script setup lang="ts">
import { computed } from 'vue'
import { listBlocksByCategory } from '~/utils/blocks'
import type { BlockType } from '~/types/builder'

const props = defineProps<{
  /** Whether to show the palette (collapsed on mobile) */
  collapsed?: boolean
}>()

const emit = defineEmits<{
  'add-block': [type: BlockType]
}>()

const categories = listBlocksByCategory()

const categoryLabels: Record<string, string> = {
  layout: 'تخطيط',
  content: 'محتوى',
  composed: 'مركّبة',
  tolnera: 'Tolnera',
  advanced: 'متقدم'
}

const onDragStart = (e: DragEvent, type: BlockType) => {
  e.dataTransfer?.setData('block-type', type)
  e.dataTransfer!.effectAllowed = 'copy'
}

const categoryColors: Record<string, string> = {
  layout: 'text-blue-500',
  content: 'text-emerald-500',
  composed: 'text-violet-500',
  tolnera: 'text-amber-500',
  advanced: 'text-rose-500'
}
</script>

<template>
  <div class="h-full flex flex-col bg-[var(--ui-bg)]">
    <div class="px-4 py-3 border-b border-[var(--ui-border)] flex items-center justify-between">
      <h3 class="font-bold text-sm flex items-center gap-2">
        <UIcon name="i-lucide-plus-circle" />
        إضافة عنصر
      </h3>
    </div>

    <div class="flex-1 overflow-y-auto p-3 space-y-5">
      <div v-for="(blocks, cat) in categories" :key="cat" v-show="blocks.length">
        <h4 :class="['text-xs font-bold uppercase tracking-wider mb-2', categoryColors[cat]]">
          {{ categoryLabels[cat] }}
        </h4>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="def in blocks"
            :key="def.type"
            draggable="true"
            @dragstart="onDragStart($event, def.type)"
            @click="emit('add-block', def.type)"
            class="flex flex-col items-center gap-1 p-3 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg)] hover:border-[var(--t-color-primary)] hover:bg-[var(--t-color-primary)]/5 transition-all cursor-grab active:cursor-grabbing group"
            :title="def.description"
          >
            <UIcon
              :name="def.icon"
              class="text-xl text-[var(--ui-text-muted)] group-hover:text-[var(--t-color-primary)]"
            />
            <span class="text-xs font-medium text-center leading-tight">{{ def.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
