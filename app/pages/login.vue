<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const name = ref('')
const mode = ref<'login' | 'register'>('login')
const loading = ref(false)
const error = ref('')

const submit = async () => {
  loading.value = true
  error.value = ''
  try {
    if (mode.value === 'login') {
      await auth.login(email.value, password.value)
    } else {
      await auth.register(name.value, email.value, password.value)
    }
    await navigateTo('/')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.message || 'حدث خطأ'
  } finally {
    loading.value = false
  }
}

// Redirect if already logged in
onMounted(async () => {
  const user = await auth.fetchMe()
  if (user) navigateTo('/')
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="flex items-center justify-center gap-2 mb-8">
        <div class="w-9 h-9 rounded-lg bg-[var(--accent)] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <rect x="8" y="8" width="6" height="6" rx="1" fill="#09090b"/>
            <rect x="18" y="8" width="6" height="6" rx="1" fill="#09090b" opacity="0.5"/>
            <rect x="8" y="18" width="6" height="6" rx="1" fill="#09090b" opacity="0.5"/>
            <rect x="18" y="18" width="6" height="6" rx="1" fill="#09090b"/>
          </svg>
        </div>
        <span class="text-lg font-bold tracking-tight">Tolnera</span>
      </div>

      <div class="panel p-6">
        <h1 class="text-xl font-bold mb-1">
          {{ mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب' }}
        </h1>
        <p class="text-sm text-[var(--text-muted)] mb-5">
          {{ mode === 'login' ? 'ادخل لحسابك للمتابعة' : 'ابدأ ببناء موقعك التعليمي' }}
        </p>

        <form @submit.prevent="submit" class="space-y-3">
          <div v-if="mode === 'register'">
            <label class="block text-xs font-medium text-[var(--text-muted)] mb-1.5">الاسم</label>
            <UInput v-model="name" placeholder="اسمك" class="w-full" size="lg" />
          </div>
          <div>
            <label class="block text-xs font-medium text-[var(--text-muted)] mb-1.5">البريد الإلكتروني</label>
            <UInput v-model="email" type="email" placeholder="you@example.com" class="w-full" size="lg" required />
          </div>
          <div>
            <label class="block text-xs font-medium text-[var(--text-muted)] mb-1.5">كلمة المرور</label>
            <UInput v-model="password" type="password" placeholder="••••••••" class="w-full" size="lg" required />
          </div>

          <p v-if="error" class="text-sm text-red-400">{{ error }}</p>

          <UButton type="submit" :loading="loading" class="w-full justify-center" size="lg" color="primary">
            {{ mode === 'login' ? 'دخول' : 'إنشاء حساب' }}
          </UButton>
        </form>

        <div class="mt-5 text-center text-sm text-[var(--text-muted)]">
          <span v-if="mode === 'login'">ليس لديك حساب؟</span>
          <span v-else>لديك حساب؟</span>
          <button
            @click="mode = mode === 'login' ? 'register' : 'login'"
            class="text-[var(--accent)] hover:underline mr-1 font-medium"
          >
            {{ mode === 'login' ? 'أنشئ حساب' : 'سجل دخول' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
