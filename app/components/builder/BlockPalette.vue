<script setup lang="ts">
import { computed } from 'vue'
import { useBuilderStore } from '~/stores/builder'
import { blocksByCategory } from '~/utils/blocks'
import type { BlockType } from '~/types/builder'

const store = useBuilderStore()
const cats = blocksByCategory()

const labels: Record<string, string> = {
  layout: 'تخطيط',
  content: 'محتوى',
  composed: 'مركّب',
  education: 'تعليمي',
  advanced: 'متقدم'
}

const onDragStart = (e: DragEvent, type: BlockType) => {
  e.dataTransfer?.setData('block-type', type)
  e.dataTransfer!.effectAllowed = 'copy'
}

const onAdd = (type: BlockType) => {
  store.addBlock(type, null)
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="px-3 py-2 border-b border-[var(--border)]">
      <h3 class="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">العناصر</h3>
    </div>
    <div class="flex-1 overflow-y-auto p-2 space-y-4">
      <div v-for="(blocks, cat) in cats" :key="cat" v-show="blocks.length">
        <p class="text-[10px] font-bold text-[var(--text-subtle)] uppercase tracking-wider px-1 mb-1.5">{{ labels[cat] }}</p>
        <div class="grid grid-cols-2 gap-1.5">
          <button
            v-for="def in blocks"
            :key="def.type"
            draggable="true"
            @dragstart="onDragStart($event, def.type)"
            @click="onAdd(def.type)"
            :class="[
              'flex flex-col items-start gap-1 p-2 rounded-md border text-right transition-all group',
              'border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface-2)]'
            ]"
            :title="def.description"
          >
            <UIcon :name="def.icon" class="text-base text-[var(--text-muted)] group-hover:text-[var(--accent)]" />
            <span class="text-xs font-medium">{{ def.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
