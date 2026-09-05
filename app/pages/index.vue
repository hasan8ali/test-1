<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Page } from '~/types/builder'

const pages = ref<Page[]>([])
const loading = ref(true)
const showNewPage = ref(false)
const newPageTitle = ref('')
const newPageTheme = ref('')
const themes = ref<any[]>([])

const load = async () => {
  loading.value = true
  try {
    const [p, t] = await Promise.all([
      $fetch('/api/pages'),
      $fetch('/api/themes')
    ])
    pages.value = p as Page[]
    themes.value = t as any[]
    if (themes.value.length && !newPageTheme.value) {
      newPageTheme.value = themes.value[0].id
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const createPage = async () => {
  if (!newPageTitle.value.trim()) return
  try {
    const page = await $fetch('/api/pages', {
      method: 'POST',
      body: {
        title: newPageTitle.value,
        themeId: newPageTheme.value
      }
    })
    await navigateTo(`/builder/${(page as any).id}`)
  } catch (e) {
    console.error(e)
  }
}

const deletePage = async (id: string) => {
  if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟')) return
  try {
    await $fetch(`/api/pages/${id}`, { method: 'DELETE' })
    await load()
  } catch (e) {
    console.error(e)
  }
}

const formatDate = (ts: number) => {
  return new Date(ts * 1000).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(load)
</script>

<template>
  <div class="min-h-screen bg-[var(--ui-bg-muted)]">
    <!-- Header -->
    <header class="bg-[var(--ui-bg)] border-b border-[var(--ui-border)]">
      <div class="max-w-6xl mx-auto px-4 md:px-6 py-5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--t-color-primary)] to-[var(--t-color-secondary)] flex items-center justify-center text-white">
            <UIcon name="i-lucide-layers" class="text-xl" />
          </div>
          <div>
            <h1 class="font-extrabold text-xl">Tolnera Builder</h1>
            <p class="text-xs text-[var(--ui-text-muted)]">محرر صفحات وثيمات — مشروع مستقل</p>
          </div>
        </div>
        <UButton
          icon="i-lucide-plus"
          color="primary"
          @click="showNewPage = true"
        >
          صفحة جديدة
        </UButton>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-[var(--ui-bg)] rounded-2xl p-5 border border-[var(--ui-border)]">
          <div class="text-3xl font-extrabold text-[var(--t-color-primary)]">{{ pages.length }}</div>
          <div class="text-sm text-[var(--ui-text-muted)] mt-1">إجمالي الصفحات</div>
        </div>
        <div class="bg-[var(--ui-bg)] rounded-2xl p-5 border border-[var(--ui-border)]">
          <div class="text-3xl font-extrabold text-emerald-500">
            {{ pages.filter(p => p.status === 'published').length }}
          </div>
          <div class="text-sm text-[var(--ui-text-muted)] mt-1">منشور</div>
        </div>
        <div class="bg-[var(--ui-bg)] rounded-2xl p-5 border border-[var(--ui-border)]">
          <div class="text-3xl font-extrabold text-amber-500">
            {{ pages.filter(p => p.status === 'draft').length }}
          </div>
          <div class="text-sm text-[var(--ui-text-muted)] mt-1">مسودة</div>
        </div>
        <div class="bg-[var(--ui-bg)] rounded-2xl p-5 border border-[var(--ui-border)]">
          <div class="text-3xl font-extrabold text-violet-500">{{ themes.length }}</div>
          <div class="text-sm text-[var(--ui-text-muted)] mt-1">ثيم متاح</div>
        </div>
      </div>

      <!-- Pages grid -->
      <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
        <UIcon name="i-lucide-file-text" />
        صفحاتك
      </h2>

      <div v-if="loading" class="text-center py-12">
        <UIcon name="i-lucide-loader-circle" class="text-3xl animate-spin text-[var(--t-color-primary)] mx-auto" />
        <p class="text-sm text-[var(--ui-text-muted)] mt-3">جارٍ التحميل...</p>
      </div>

      <div v-else-if="!pages.length" class="text-center py-16 bg-[var(--ui-bg)] rounded-2xl border border-dashed border-[var(--ui-border)]">
        <UIcon name="i-lucide-file-plus" class="text-5xl text-[var(--ui-text-muted)] mb-3" />
        <h3 class="text-lg font-bold mb-1">لا توجد صفحات بعد</h3>
        <p class="text-sm text-[var(--ui-text-muted)] mb-4">ابدأ بإنشاء أول صفحة لك</p>
        <UButton icon="i-lucide-plus" color="primary" @click="showNewPage = true">صفحة جديدة</UButton>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="page in pages"
          :key="page.id"
          class="bg-[var(--ui-bg)] rounded-2xl border border-[var(--ui-border)] overflow-hidden hover:shadow-lg transition-shadow group"
        >
          <!-- Preview thumbnail -->
          <NuxtLink :to="`/builder/${page.id}`" class="block">
            <div class="aspect-video bg-gradient-to-br from-[var(--t-color-primary)]/10 to-[var(--t-color-secondary)]/10 flex items-center justify-center relative">
              <UIcon name="i-lucide-file-text" class="text-4xl text-[var(--t-color-primary)]/50" />
              <div class="absolute top-2 right-2">
                <UBadge
                  :color="page.status === 'published' ? 'success' : 'warning'"
                  variant="subtle"
                  size="xs"
                >
                  {{ page.status === 'published' ? 'منشور' : 'مسودة' }}
                </UBadge>
              </div>
            </div>
          </NuxtLink>
          <!-- Page info -->
          <div class="p-4">
            <NuxtLink :to="`/builder/${page.id}`">
              <h3 class="font-bold mb-1 group-hover:text-[var(--t-color-primary)] transition-colors">
                {{ page.title }}
              </h3>
            </NuxtLink>
            <p class="text-xs text-[var(--ui-text-muted)] mb-3">
              {{ formatDate(page.updatedAt) }}
            </p>
            <div class="flex items-center gap-1">
              <UButton
                :to="`/builder/${page.id}`"
                icon="i-lucide-pencil"
                color="primary"
                variant="soft"
                size="xs"
                class="flex-1"
              >تحرير</UButton>
              <UButton
                :to="`/p/${page.slug}`"
                icon="i-lucide-eye"
                color="neutral"
                variant="soft"
                size="xs"
                target="_blank"
              />
              <UButton
                icon="i-lucide-trash-2"
                color="error"
                variant="soft"
                size="xs"
                @click="deletePage(page.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- New page modal -->
    <UModal v-model:open="showNewPage">
      <template #content>
        <div class="p-6">
          <h2 class="text-xl font-bold mb-4">صفحة جديدة</h2>
          <div class="space-y-3">
            <UFormField label="عنوان الصفحة">
              <UInput
                v-model="newPageTitle"
                placeholder="مثلاً: الصفحة الرئيسية"
                autofocus
                @keyup.enter="createPage"
              />
            </UFormField>
            <UFormField label="الثيم">
              <USelect v-model="newPageTheme" :items="themes.map(t => ({ label: t.name, value: t.id }))" />
            </UFormField>
          </div>
          <div class="flex justify-end gap-2 mt-5">
            <UButton color="neutral" variant="ghost" @click="showNewPage = false">إلغاء</UButton>
            <UButton color="primary" :disabled="!newPageTitle.trim()" @click="createPage">إنشاء</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
