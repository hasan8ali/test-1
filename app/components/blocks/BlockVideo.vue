<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const embedUrl = computed(() => {
  const src = props.block.props.src
  if (!src) return ''
  if (props.block.props.provider === 'youtube') {
    const m = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/)
    return m ? `https://www.youtube.com/embed/${m[1]}` : src
  }
  if (props.block.props.provider === 'vimeo') {
    const m = src.match(/vimeo\.com\/(\d+)/)
    return m ? `https://player.vimeo.com/video/${m[1]}` : src
  }
  return src
})

const radiusClass = computed(() => ({
  none: 'rounded-none', sm: 'rounded-sm', md: 'rounded-md',
  lg: 'rounded-lg', xl: 'rounded-xl'
}[props.block.props.radius] || 'rounded-lg'))
</script>

<template>
  <div v-if="!embedUrl" class="t-drop-zone">
    <UIcon name="i-lucide-video" class="text-2xl mb-2" />
    <p>أضف رابط الفيديو من الـ Inspector</p>
  </div>
  <div
    v-else
    :class="['relative w-full overflow-hidden', radiusClass]"
    :style="{ aspectRatio: block.props.aspectRatio }"
  >
    <iframe
      :src="embedUrl"
      class="absolute inset-0 w-full h-full"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>
