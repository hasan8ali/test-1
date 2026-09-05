<script setup lang="ts">
import { computed } from 'vue'
import type { Block } from '~/types/builder'

import BlockContainer from '~/components/blocks/BlockContainer.vue'
import BlockColumns from '~/components/blocks/BlockColumns.vue'
import BlockSpacer from '~/components/blocks/BlockSpacer.vue'
import BlockDivider from '~/components/blocks/BlockDivider.vue'
import BlockHeading from '~/components/blocks/BlockHeading.vue'
import BlockText from '~/components/blocks/BlockText.vue'
import BlockImage from '~/components/blocks/BlockImage.vue'
import BlockVideo from '~/components/blocks/BlockVideo.vue'
import BlockButton from '~/components/blocks/BlockButton.vue'
import BlockIcon from '~/components/blocks/BlockIcon.vue'
import BlockHero from '~/components/blocks/BlockHero.vue'
import BlockFeatureGrid from '~/components/blocks/BlockFeatureGrid.vue'
import BlockPricingTable from '~/components/blocks/BlockPricingTable.vue'
import BlockTestimonialGrid from '~/components/blocks/BlockTestimonialGrid.vue'
import BlockFaq from '~/components/blocks/BlockFaq.vue'
import BlockStats from '~/components/blocks/BlockStats.vue'
import BlockEnrollmentCta from '~/components/blocks/BlockEnrollmentCta.vue'
import BlockPageHeader from '~/components/blocks/BlockPageHeader.vue'
import BlockCourseGrid from '~/components/blocks/BlockCourseGrid.vue'
import BlockCourseCard from '~/components/blocks/BlockCourseCard.vue'
import BlockCurriculumList from '~/components/blocks/BlockCurriculumList.vue'
import BlockInstructorBio from '~/components/blocks/BlockInstructorBio.vue'
import BlockInstructorGrid from '~/components/blocks/BlockInstructorGrid.vue'
import BlockCustomCode from '~/components/blocks/BlockCustomCode.vue'

const props = defineProps<{
  block: Block
  editing?: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const MAP: Record<string, any> = {
  container: BlockContainer,
  columns: BlockColumns,
  spacer: BlockSpacer,
  divider: BlockDivider,
  heading: BlockHeading,
  text: BlockText,
  image: BlockImage,
  video: BlockVideo,
  button: BlockButton,
  icon: BlockIcon,
  hero: BlockHero,
  'feature-grid': BlockFeatureGrid,
  'pricing-table': BlockPricingTable,
  'testimonial-grid': BlockTestimonialGrid,
  faq: BlockFaq,
  stats: BlockStats,
  'enrollment-cta': BlockEnrollmentCta,
  'page-header': BlockPageHeader,
  'course-grid': BlockCourseGrid,
  'course-card': BlockCourseCard,
  'curriculum-list': BlockCurriculumList,
  'instructor-bio': BlockInstructorBio,
  'instructor-grid': BlockInstructorGrid,
  'custom-code': BlockCustomCode
}

const Renderer = computed(() => MAP[props.block.type])

const classes = computed(() => {
  const c = ['blk']
  if (props.block.advanced?.customClass) c.push(props.block.advanced.customClass)
  if (!props.block.visibility.mobile) c.push('hide-mobile')
  if (!props.block.visibility.tablet) c.push('hide-tablet')
  if (!props.block.visibility.desktop) c.push('hide-desktop')
  return c.join(' ')
})

const onClick = (e: MouseEvent) => {
  if (!props.editing) return
  e.stopPropagation()
  emit('select', props.block.id)
}
</script>

<template>
  <div
    :class="classes"
    :id="block.advanced?.customId"
    @click="onClick"
  >
    <component :is="Renderer" :block="block" :editing="editing" @select="$emit('select', $event)" />
  </div>
</template>
