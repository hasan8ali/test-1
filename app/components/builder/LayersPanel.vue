<script setup lang="ts">
import { computed } from 'vue'
import { useBuilderStore } from '~/stores/builder'

const store = useBuilderStore()

const flat = computed(() => store.flatBlocks)

const selectBlock = (id: string) => {
  store.selectBlock(id)
}

const indentStyle = (depth: number) => ({
  paddingInlineStart: `${depth * 12 + 8}px`
})

const blockIcon = (type: string): string => {
  const icons: Record<string, string> = {
    container: 'i-lucide-square-stack',
    grid: 'i-lucide-layout-grid',
    columns: 'i-lucide-columns',
    divider: 'i-lucide-minus',
    spacer: 'i-lucide-move-vertical',
    heading: 'i-lucide-heading',
    text: 'i-lucide-type',
    richtext: 'i-lucide-pilcrow',
    image: 'i-lucide-image',
    video: 'i-lucide-video',
    button: 'i-lucide-mouse-pointer-click',
    icon: 'i-lucide-smile',
    hero: 'i-lucide-mountain-snow',
    'feature-grid': 'i-lucide-layers',
    'pricing-card': 'i-lucide-credit-card',
    testimonial: 'i-lucide-quote',
    faq: 'i-lucide-help-circle',
    cta: 'i-lucide-megaphone',
    stats: 'i-lucide-bar-chart-3',
    'course-grid': 'i-lucide-graduation-cap',
    'course-card': 'i-lucide-book-open',
    'instructor-card': 'i-lucide-user-round',
    'signup-form': 'i-lucide-user-plus',
    'custom-html': 'i-lucide-code-2',
    'code-block': 'i-lucide-terminal'
  }
  return icons[type] || 'i-lucide-box'
}

const blockLabel = (item: { block: any }): string => {
  const b = item.block
  if (b.props?.text) return b.props.text.slice(0, 30)
  if (b.props?.title) return b.props.title.slice(0, 30)
  if (b.props?.name) return b.props.name
  return b.type
}
</script>

<template>
  <div class="h-full flex flex-col bg-[var(--ui-bg)]">
    <div class="px-4 py-3 border-b border-[var(--ui-border)]">
      <h3 class="font-bold text-sm flex items-center gap-2">
        <UIcon name="i-lucide-list-tree" />
        الطبقات
      </h3>
    </div>

    <div class="flex-1 overflow-y-auto p-2">
      <div v-if="!flat.length" class="text-center text-[var(--ui-text-muted)] text-sm py-8">
        الصفحة فارغة. أضف blocks من اللوحة الجانبية.
      </div>
      <div v-else class="space-y-0.5">
        <button
          v-for="item in flat"
          :key="item.block.id"
          @click="selectBlock(item.block.id)"
          :style="indentStyle(item.depth)"
          :class="[
            'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-right transition-colors',
            store.selectedBlockId === item.block.id
              ? 'bg-[var(--t-color-primary)] text-white'
              : 'hover:bg-[var(--ui-bg-elevated)]'
          ]"
        >
          <UIcon :name="blockIcon(item.block.type)" class="text-base flex-shrink-0" />
          <span class="truncate flex-1">{{ blockLabel(item) }}</span>
          <UIcon
            v-if="!item.block.visibility.mobile || !item.block.visibility.tablet || !item.block.visibility.desktop"
            name="i-lucide-eye-off"
            class="text-xs opacity-60"
          />
        </button>
      </div>
    </div>
  </div>
</template>
