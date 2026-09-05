<script setup lang="ts">
/**
 * BlockRenderer — the recursive dispatcher that renders any block tree.
 *
 * Each block type maps to a renderer component in /blocks/renderers.
 * The renderer is responsible for the visual presentation only.
 * The wrapper handles: selection, hover, drop targets, responsive visibility,
 * advanced overrides (custom class/style/id).
 */
import { computed } from 'vue'
import type { Block } from '~/types/builder'
import { blockDefinitions } from '~/utils/blocks'

const props = defineProps<{
  block: Block
  /** Whether the canvas is in editing mode (vs published) */
  editing?: boolean
}>()

const emit = defineEmits<{
  'select-block': [id: string]
  'drop-block': [payload: { type: string; parentId: string | null; index: number }]
}>()

// Resolve renderer component dynamically
const rendererName = computed(() => {
  // Map type 'feature-grid' -> 'FeatureGrid', 'custom-html' -> 'CustomHtml'
  return props.block.type
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
})

const Renderer = computed(() => {
  return resolveComponent(`Block${rendererName.value}`)
})

const def = computed(() => blockDefinitions[props.block.type])

const wrapperClasses = computed(() => {
  const classes = ['t-block']
  if (props.editing) classes.push('t-block-editable')
  if (props.block.advanced?.customClass) classes.push(props.block.advanced.customClass)
  // Responsive visibility
  if (!props.block.visibility.mobile) classes.push('t-hide-mobile')
  if (!props.block.visibility.tablet) classes.push('t-hide-tablet')
  if (!props.block.visibility.desktop) classes.push('t-hide-desktop')
  return classes.join(' ')
})

const wrapperStyle = computed(() => {
  const styles: string[] = []
  if (props.block.advanced?.customStyle) styles.push(props.block.advanced.customStyle)
  return styles.join(';')
})

const onClick = (e: MouseEvent) => {
  if (!props.editing) return
  e.stopPropagation()
  emit('select-block', props.block.id)
}

const onDrop = (e: DragEvent) => {
  if (!props.editing) return
  e.preventDefault()
  e.stopPropagation()
  const type = e.dataTransfer?.getData('block-type')
  if (type) {
    emit('drop-block', { type, parentId: props.block.id, index: 0 })
  }
}

const onDragOver = (e: DragEvent) => {
  if (!props.editing) return
  if (def.value?.acceptsChildren) {
    e.preventDefault()
  }
}
</script>

<template>
  <div
    :class="wrapperClasses"
    :style="wrapperStyle"
    :id="block.advanced?.customId"
    @click="onClick"
    @drop="onDrop"
    @dragover="onDragOver"
  >
    <component :is="Renderer" :block="block" :editing="editing" />
  </div>
</template>
