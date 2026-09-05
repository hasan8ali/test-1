<script setup lang="ts">
import { ref } from 'vue'
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const email = ref('')
const submitted = ref(false)
const loading = ref(false)

const submit = async () => {
  if (props.editing) return
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) return
  loading.value = true
  try {
    await $fetch(props.block.props.apiEndpoint, {
      method: 'POST',
      body: { email: email.value }
    })
    submitted.value = true
  } catch (e) {
    // Graceful failure in demo mode
    submitted.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-[var(--t-color-surface-elevated)] rounded-2xl p-8 text-center max-w-md mx-auto">
    <template v-if="!submitted">
      <h3 v-if="block.props.title" class="text-2xl font-bold mb-2">{{ block.props.title }}</h3>
      <p v-if="block.props.subtitle" class="text-[var(--t-color-text-muted)] mb-5">{{ block.props.subtitle }}</p>
      <form @submit.prevent="submit" class="flex flex-col sm:flex-row gap-2">
        <UInput
          v-model="email"
          type="email"
          :placeholder="block.props.placeholder"
          size="lg"
          class="flex-1"
          :disabled="editing"
        />
        <UButton
          type="submit"
          size="lg"
          color="primary"
          :loading="loading"
          :disabled="editing"
        >
          {{ block.props.buttonText }}
        </UButton>
      </form>
    </template>
    <template v-else>
      <UIcon name="i-lucide-check-circle" class="text-5xl text-[var(--t-color-success)] mb-3" />
      <h3 class="text-xl font-bold mb-2">تم الاشتراك بنجاح!</h3>
      <p class="text-[var(--t-color-text-muted)]">سنوافيك بأحدث الكورسات والعرضات.</p>
    </template>
  </div>
</template>
