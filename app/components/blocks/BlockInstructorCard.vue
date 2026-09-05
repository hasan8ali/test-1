<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const socials = computed(() => {
  const s = props.block.props.socials || {}
  return [
    { key: 'twitter', icon: 'i-lucide-twitter', url: s.twitter },
    { key: 'linkedin', icon: 'i-lucide-linkedin', url: s.linkedin },
    { key: 'github', icon: 'i-lucide-github', url: s.github },
    { key: 'website', icon: 'i-lucide-globe', url: s.website }
  ].filter((x) => x.url)
})
</script>

<template>
  <div class="bg-[var(--t-color-surface-elevated)] rounded-2xl p-6 text-center">
    <div class="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-[var(--t-color-surface)]">
      <img v-if="block.props.image" :src="block.props.image" :alt="block.props.name" class="w-full h-full object-cover">
      <div v-else class="w-full h-full flex items-center justify-center text-[var(--t-color-text-muted)]">
        <UIcon name="i-lucide-user-round" class="text-4xl" />
      </div>
    </div>
    <h3 class="font-bold text-lg mb-1">{{ block.props.name }}</h3>
    <p class="text-sm text-[var(--t-color-primary)] font-medium mb-3">{{ block.props.title }}</p>
    <p class="text-sm text-[var(--t-color-text-muted)] leading-relaxed mb-4">{{ block.props.bio }}</p>
    <div v-if="socials.length" class="flex justify-center gap-2">
      <a
        v-for="s in socials"
        :key="s.key"
        :href="s.url"
        class="w-9 h-9 rounded-full bg-[var(--t-color-surface)] flex items-center justify-center text-[var(--t-color-text-muted)] hover:bg-[var(--t-color-primary)] hover:text-white transition-colors"
      >
        <UIcon :name="s.icon" />
      </a>
    </div>
  </div>
</template>
