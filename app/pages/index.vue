<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ middleware: ['auth'] })

const auth = useAuthStore()
const sites = ref<any[]>([])
const loading = ref(true)
const showNewSite = ref(false)
const templates = ref<any[]>([])
const selectedTemplate = ref<string | null>(null)
const siteName = ref('')

const load = async () => {
  loading.value = true
  try {
    const [s, t] = await Promise.all([
      $fetch('/api/sites'),
      $fetch('/api/templates')
    ])
    sites.value = s as any[]
    templates.value = t as any[]
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const createSite = async () => {
  if (!siteName.value.trim()) return
  try {
    const res = await $fetch('/api/sites', {
      method: 'POST',
      body: {
        name: siteName.value,
        templateId: selectedTemplate.value
      }
    })
    await navigateTo(`/sites/${(res as any).id}/builder`)
  } catch (e: any) {
    console.error(e)
  }
}

const deleteSite = async (id: string) => {
  if (!confirm('هل أنت متأكد من حذف هذا الموقع؟')) return
  try {
    await $fetch(`/api/sites/${id}`, { method: 'DELETE' })
    await load()
  } catch (e) {
    console.error(e)
  }
}

const formatDate = (ts: number) => {
  return new Date(ts * 1000).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  await auth.fetchMe()
  await load()
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Top bar -->
    <header class="border-b border-[var(--border)] px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-md bg-[var(--accent)] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
            <rect x="8" y="8" width="6" height="6" rx="1" fill="#09090b"/>
            <rect x="18" y="8" width="6" height="6" rx="1" fill="#09090b" opacity="0.5"/>
            <rect x="8" y="18" width="6" height="6" rx="1" fill="#09090b" opacity="0.5"/>
            <rect x="18" y="18" width="6" height="6" rx="1" fill="#09090b"/>
          </svg>
        </div>
        <span class="font-bold tracking-tight">Tolnera</span>
        <span class="text-[var(--text-subtle)] text-sm mx-2">/</span>
        <span class="text-sm text-[var(--text-muted)]">مواقعي</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm text-[var(--text-muted)] hidden sm:inline">{{ auth.user?.name }}</span>
        <UButton @click="auth.logout()" variant="ghost" color="neutral" size="sm" icon="i-lucide-log-out">خروج</UButton>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-10">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">مواقعك</h1>
          <p class="text-[var(--text-muted)] text-sm mt-1">أنشئ وخصص موقعك التعليمي</p>
        </div>
        <UButton @click="showNewSite = true" color="primary" icon="i-lucide-plus">موقع جديد</UButton>
      </div>

      <div v-if="loading" class="text-center py-20 text-[var(--text-muted)]">
        <UIcon name="i-lucide-loader-circle" class="animate-spin text-2xl mb-3" />
        <p class="text-sm">جاري التحميل...</p>
      </div>

      <div v-else-if="!sites.length" class="text-center py-20 border border-dashed border-[var(--border)] rounded-lg">
        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--surface-2)] flex items-center justify-center">
          <UIcon name="i-lucide-globe" class="text-xl text-[var(--text-subtle)]" />
        </div>
        <h3 class="font-semibold mb-1">لا توجد مواقع بعد</h3>
        <p class="text-sm text-[var(--text-muted)] mb-4">ابدأ بإنشاء أول موقع</p>
        <UButton @click="showNewSite = true" color="primary" icon="i-lucide-plus">إنشاء موقع</UButton>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="site in sites"
          :key="site.id"
          class="panel p-4 hover:border-[var(--text-subtle)] transition-colors group"
        >
          <div class="aspect-video bg-[var(--surface-2)] rounded-md mb-3 flex items-center justify-center">
            <UIcon name="i-lucide-globe" class="text-2xl text-[var(--text-subtle)]" />
          </div>
          <div class="flex items-center gap-2 mb-1">
            <h3 class="font-semibold truncate-2 flex-1">{{ site.name }}</h3>
            <UBadge
              :color="site.status === 'published' ? 'success' : 'neutral'"
              variant="subtle"
              size="xs"
            >
              {{ site.status === 'published' ? 'منشور' : 'مسودة' }}
            </UBadge>
          </div>
          <p class="text-xs text-[var(--text-subtle)] mb-3">{{ formatDate(site.updatedAt) }}</p>
          <div class="flex gap-1">
            <UButton
              :to="`/sites/${site.id}/builder`"
              size="xs" color="primary" variant="soft" icon="i-lucide-pencil"
              class="flex-1 justify-center"
            >تحرير</UButton>
            <UButton
              :to="`/p/${site.slug}`"
              target="_blank"
              size="xs" color="neutral" variant="soft" icon="i-lucide-external-link"
            />
            <UButton
              @click="deleteSite(site.id)"
              size="xs" color="error" variant="soft" icon="i-lucide-trash-2"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- New site modal -->
    <UModal v-model:open="showNewSite">
      <template #content>
        <div class="p-6 max-w-2xl w-full">
          <h2 class="text-lg font-bold mb-1">إنشاء موقع جديد</h2>
          <p class="text-sm text-[var(--text-muted)] mb-5">اختر قالبًا للبدء أو ابدأ من صفحة فارغة</p>

          <div class="mb-4">
            <label class="block text-xs font-medium text-[var(--text-muted)] mb-1.5">اسم الموقع</label>
            <UInput v-model="siteName" placeholder="مثلاً: موقع الكورس الرئيسي" class="w-full" size="lg" />
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-[var(--text-muted)] mb-2">القالب</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                @click="selectedTemplate = null"
                :class="[
                  'text-right p-3 rounded-md border transition-all',
                  selectedTemplate === null ? 'border-[var(--accent)] bg-[var(--surface-2)]' : 'border-[var(--border)]'
                ]"
              >
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-file" />
                  <span class="font-medium text-sm">صفحة فارغة</span>
                </div>
                <p class="text-xs text-[var(--text-muted)] mt-1">ابدأ من الصفر</p>
              </button>
              <button
                v-for="tpl in templates"
                :key="tpl.id"
                @click="selectedTemplate = tpl.id"
                :class="[
                  'text-right p-3 rounded-md border transition-all',
                  selectedTemplate === tpl.id ? 'border-[var(--accent)] bg-[var(--surface-2)]' : 'border-[var(--border)]'
                ]"
              >
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-layout-template" />
                  <span class="font-medium text-sm">{{ tpl.name }}</span>
                </div>
                <p class="text-xs text-[var(--text-muted)] mt-1 truncate-2">{{ tpl.description }}</p>
              </button>
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <UButton @click="showNewSite = false" variant="ghost" color="neutral">إلغاء</UButton>
            <UButton @click="createSite" :disabled="!siteName.trim()" color="primary">إنشاء</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
