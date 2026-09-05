<script setup lang="ts">
/**
 * BlockRenderer — the recursive dispatcher that renders any block tree.
 *
 * Each block type maps to a renderer component in /components/blocks.
 * The renderer is responsible for the visual presentation only.
 * The wrapper handles: selection, hover, drop targets, responsive visibility,
 * advanced overrides (custom class/style/id).
 */
import { computed, defineAsyncComponent, type Component } from 'vue'
import type { Block } from '~/types/builder'
import { blockDefinitions } from '~/utils/blocks'

import BlockContainer from '~/components/blocks/BlockContainer.vue'
import BlockGrid from '~/components/blocks/BlockGrid.vue'
import BlockColumns from '~/components/blocks/BlockColumns.vue'
import BlockDivider from '~/components/blocks/BlockDivider.vue'
import BlockSpacer from '~/components/blocks/BlockSpacer.vue'
import BlockHeading from '~/components/blocks/BlockHeading.vue'
import BlockText from '~/components/blocks/BlockText.vue'
import BlockRichtext from '~/components/blocks/BlockRichtext.vue'
import BlockImage from '~/components/blocks/BlockImage.vue'
import BlockVideo from '~/components/blocks/BlockVideo.vue'
import BlockButton from '~/components/blocks/BlockButton.vue'
import BlockIcon from '~/components/blocks/BlockIcon.vue'
import BlockHero from '~/components/blocks/BlockHero.vue'
import BlockFeatureGrid from '~/components/blocks/BlockFeatureGrid.vue'
import BlockPricingCard from '~/components/blocks/BlockPricingCard.vue'
import BlockTestimonial from '~/components/blocks/BlockTestimonial.vue'
import BlockFaq from '~/components/blocks/BlockFaq.vue'
import BlockCta from '~/components/blocks/BlockCta.vue'
import BlockStats from '~/components/blocks/BlockStats.vue'
import BlockCourseGrid from '~/components/blocks/BlockCourseGrid.vue'
import BlockCourseCard from '~/components/blocks/BlockCourseCard.vue'
import BlockInstructorCard from '~/components/blocks/BlockInstructorCard.vue'
import BlockSignupForm from '~/components/blocks/BlockSignupForm.vue'
import BlockCustomHtml from '~/components/blocks/BlockCustomHtml.vue'
import BlockCodeBlock from '~/components/blocks/BlockCodeBlock.vue'

const props = defineProps<{
  block: Block
  /** Whether the canvas is in editing mode (vs published) */
  editing?: boolean
}>()

const emit = defineEmits<{
  'select-block': [id: string]
  'drop-block': [payload: { type: string; parentId: string | null; index: number }]
}>()

const rendererMap: Record<string, Component> = {
  container: BlockContainer,
  grid: BlockGrid,
  columns: BlockColumns,
  divider: BlockDivider,
  spacer: BlockSpacer,
  heading: BlockHeading,
  text: BlockText,
  richtext: BlockRichtext,
  image: BlockImage,
  video: BlockVideo,
  button: BlockButton,
  icon: BlockIcon,
  hero: BlockHero,
  'feature-grid': BlockFeatureGrid,
  'pricing-card': BlockPricingCard,
  testimonial: BlockTestimonial,
  faq: BlockFaq,
  cta: BlockCta,
  stats: BlockStats,
  'course-grid': BlockCourseGrid,
  'course-card': BlockCourseCard,
  'instructor-card': BlockInstructorCard,
  'signup-form': BlockSignupForm,
  'custom-html': BlockCustomHtml,
  'code-block': BlockCodeBlock
}

const Renderer = computed(() => rendererMap[props.block.type])

const def = computed(() => blockDefinitions[props.block.type])

const wrapperClasses = computed(() => {
  const classes = ['t-block']
  if (props.editing) classes.push('t-block-editable')
  if (props.block.advanced?.customClass) classes.push(props.block.advanced.customClass)
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
