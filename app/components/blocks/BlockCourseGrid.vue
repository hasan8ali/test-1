<script setup lang="ts">
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

// For demo purposes, show static course cards.
// In production, this would fetch from the configured apiUrl.
const demoCourses = [
  { title: 'تعلّم React من الصفر', instructor: 'م. أحمد علي', price: '299', image: '', rating: 4.8, students: 1240, duration: '12 ساعة' },
  { title: 'Vue.js المتقدم', instructor: 'م. سارة أحمد', price: '399', image: '', rating: 4.9, students: 890, duration: '15 ساعة' },
  { title: 'تصميم UI/UX', instructor: 'أ. خالد محمد', price: '499', image: '', rating: 4.7, students: 2100, duration: '20 ساعة' },
  { title: 'Node.js والـ APIs', instructor: 'م. أحمد علي', price: '349', image: '', rating: 4.8, students: 1560, duration: '18 ساعة' },
  { title: 'Python للمبتدئين', instructor: 'د. منى حسن', price: '249', image: '', rating: 4.6, students: 3200, duration: '10 ساعة' },
  { title: 'Tailwind CSS Master', instructor: 'م. سارة أحمد', price: '199', image: '', rating: 4.9, students: 980, duration: '8 ساعة' }
]
</script>

<template>
  <section class="py-16 px-6">
    <div class="mx-auto max-w-6xl">
      <h2 v-if="block.props.title" class="text-3xl md:text-4xl font-bold text-center mb-10">
        {{ block.props.title }}
      </h2>
      <div
        class="grid gap-6"
        :style="{ gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, 280px), 1fr))` }"
      >
        <div
          v-for="(course, i) in demoCourses.slice(0, block.props.limit)"
          :key="i"
          class="bg-[var(--t-color-surface-elevated)] rounded-2xl overflow-hidden border border-[var(--t-color-border)] hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <!-- Course thumbnail -->
          <div class="aspect-video bg-gradient-to-br from-[var(--t-color-primary)] to-[var(--t-color-secondary)] flex items-center justify-center">
            <UIcon name="i-lucide-graduation-cap" class="text-white text-5xl" />
          </div>
          <!-- Course body -->
          <div class="p-5">
            <div class="flex items-center gap-2 mb-2 text-sm">
              <UIcon name="i-lucide-star" class="text-yellow-400" />
              <span class="font-bold">{{ course.rating }}</span>
              <span class="text-[var(--t-color-text-muted)]">·</span>
              <span class="text-[var(--t-color-text-muted)]">{{ course.students.toLocaleString('ar-EG') }} طالب</span>
            </div>
            <h3 class="font-bold text-lg mb-1 line-clamp-2">{{ course.title }}</h3>
            <p class="text-sm text-[var(--t-color-text-muted)] mb-3">{{ course.instructor }}</p>
            <div class="flex items-center gap-2 text-sm text-[var(--t-color-text-muted)] mb-4">
              <UIcon name="i-lucide-clock" />
              <span>{{ course.duration }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-extrabold text-[var(--t-color-primary)]">{{ course.price }}</span>
                <span class="text-sm">ج.م</span>
              </div>
              <button class="text-sm font-bold text-[var(--t-color-primary)] hover:underline">
                عرض الكورس ←
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
