import { defineStore } from 'pinia'

interface AuthState {
  token: string | null
  user: { id: string; tenantId: string; email: string; name: string } | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null
  }),
  getters: {
    isAuthenticated: (s) => !!s.token
  },
  actions: {
    async login(email: string, password: string) {
      const res = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      this.token = res.token
      this.user = res.user
      return res
    },
    async register(name: string, email: string, password: string) {
      const res = await $fetch('/api/auth/register', {
        method: 'POST',
        body: { name, email, password }
      })
      this.token = res.token
      this.user = res.user
      return res
    },
    async fetchMe() {
      try {
        const res = await $fetch('/api/auth/me')
        this.user = res.user
        return res.user
      } catch {
        this.logout()
        return null
      }
    },
    logout() {
      this.token = null
      this.user = null
      if (import.meta.client) {
        document.cookie = 'tolnera_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        navigateTo('/login')
      }
    }
  }
})
