<script setup lang="ts">
import { computed } from 'vue'
import { useBuilderStore } from '~/stores/builder'
import { blockDefinitions } from '~/utils/blocks'

const store = useBuilderStore()
const flat = computed(() => store.flatBlocks)

const label = (b: any): string => {
  if (b.props.text) return b.props.text.slice(0, 30)
  if (b.props.title) return b.props.title.slice(0, 30)
  if (b.props.name) return b.props.name
  return blockDefinitions[b.type as keyof typeof blockDefinitions]?.label || b.type
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="px-3 py-2 border-b border-[var(--border)]">
      <h3 class="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">الطبقات</h3>
    </div>
    <div class="flex-1 overflow-y-auto p-1.5">
      <div v-if="!flat.length" class="text-center text-xs text-[var(--text-subtle)] py-8">
        لا توجد عناصر بعد
      </div>
      <button
        v-for="item in flat"
        :key="item.block.id"
        @click="store.selectBlock(item.block.id)"
        :style="{ paddingInlineStart: item.depth * 12 + 8 + 'px' }"
        :class="[
          'w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-xs text-right transition-colors',
          store.selectedBlockId === item.block.id
            ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
            : 'hover:bg-[var(--surface-2)] text-[var(--text-muted)]'
        ]"
      >
        <UIcon :name="blockDefinitions[item.block.type as keyof typeof blockDefinitions]?.icon" class="text-sm flex-shrink-0" />
        <span class="truncate flex-1">{{ label(item.block) }}</span>
        <UIcon
          v-if="!item.block.visibility.mobile || !item.block.visibility.tablet || !item.block.visibility.desktop"
          name="i-lucide-eye-off"
          class="text-[10px] opacity-60"
        />
      </button>
    </div>
  </div>
</template>
