<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()

const embed = computed(() => {
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
</script>
<template>
  <div v-if="!embed" class="blk-empty">
    <UIcon name="i-lucide-video" class="mr-1" /> أضف رابط الفيديو
  </div>
  <div
    v-else
    :style="{
      position: 'relative',
      width: '100%',
      aspectRatio: block.props.ratio || '16/9',
      borderRadius: '8px',
      overflow: 'hidden',
      background: '#000'
    }"
  >
    <iframe :src="embed" style="position:absolute;inset:0;width:100%;height:100%;border:0" allowfullscreen />
  </div>
</template>
