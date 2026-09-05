<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const layout = computed(() => props.block.props.layout || '1-1')

const columns = computed(() => {
  switch (layout.value) {
    case '1-1': return ['1fr', '1fr']
    case '1-2': return ['1fr', '2fr']
    case '2-1': return ['2fr', '1fr']
    case '1-3': return ['1fr', '3fr']
    case '3-1': return ['3fr', '1fr']
    case '1-1-1': return ['1fr', '1fr', '1fr']
    default: return ['1fr', '1fr']
  }
})

const gapClass = computed(() => ({
  none: 'gap-0', sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8', '2xl': 'gap-12'
}[props.block.props.gap] || 'gap-4'))

const stackClass = computed(() => props.block.props.stackOnMobile ? 'flex-col md:grid' : 'grid')

defineEmits<{ 'select-block': [id: string] }>()
</script>

<template>
  <div :class="[stackClass, gapClass]" :style="{ gridTemplateColumns: columns.join(' ') }">
    <template v-if="block.children?.length">
      <BlockRenderer
        v-for="child in block.children"
        :key="child.id"
        :block="child"
        :editing="editing"
        @select-block="$emit('select-block', $event)"
      />
    </template>
    <template v-else-if="editing">
      <div v-for="(_, i) in columns" :key="i" class="t-drop-zone">
        عمود {{ i + 1 }}
      </div>
    </template>
  </div>
</template>
