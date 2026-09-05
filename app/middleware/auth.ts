export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  
  // Skip for login page
  if (to.path === '/login') return

  // Check if authenticated
  if (!auth.isAuthenticated) {
    try {
      const user = await auth.fetchMe()
      if (!user) {
        return navigateTo('/login')
      }
    } catch {
      return navigateTo('/login')
    }
  }
})
