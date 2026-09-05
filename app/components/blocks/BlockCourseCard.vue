<script setup lang="ts">
import type { Block } from '~/types/builder'
const props = defineProps<{ block: Block; editing?: boolean }>()

const studentsText = computed(() => {
  const s = props.block.props.students
  if (!s) return '0'
  return Number(s).toLocaleString('ar-EG')
})
</script>

<template>
  <div class="course-card">
    <div class="course-card__thumb">
      <UIcon name="i-lucide-graduation-cap" class="course-card__thumb-icon" />
    </div>
    <div class="course-card__body">
      <div class="course-card__rating">
        <UIcon name="i-lucide-star" class="course-card__star" />
        <span class="course-card__rating-value">{{ block.props.rating }}</span>
        <span class="course-card__students">{{ studentsText }} طالب</span>
      </div>
      <h3 class="course-card__title">{{ block.props.title }}</h3>
      <p class="course-card__instructor">{{ block.props.instructor }}</p>
      <div class="course-card__footer">
        <div class="course-card__price">
          <span class="course-card__price-value">{{ block.props.price }}</span>
          <span class="course-card__price-currency">{{ block.props.currency }}</span>
        </div>
        <span class="course-card__duration">{{ block.props.duration }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.course-card {
  border: 1px solid var(--canvas-border);
  border-radius: 12px;
  overflow: hidden;
}
.course-card__thumb {
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, var(--canvas-accent), var(--canvas-text));
  display: flex;
  align-items: center;
  justify-content: center;
}
.course-card__thumb-icon {
  color: var(--canvas-accent-fg);
  font-size: 40px;
}
.course-card__body {
  padding: 16px;
}
.course-card__rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 0.8rem;
}
.course-card__star {
  color: #facc15;
}
.course-card__rating-value {
  font-weight: 600;
}
.course-card__students {
  color: var(--canvas-text-muted);
}
.course-card__title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px;
}
.course-card__instructor {
  font-size: 0.85rem;
  color: var(--canvas-text-muted);
  margin: 0 0 12px;
}
.course-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.course-card__price {
  display: flex;
  align-items: baseline;
  gap: 2px;
}
.course-card__price-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--canvas-accent);
}
.course-card__price-currency {
  font-size: 0.8rem;
}
.course-card__duration {
  font-size: 0.8rem;
  color: var(--canvas-text-muted);
}
</style>
