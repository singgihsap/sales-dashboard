export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  if (process.client) {
    authStore.checkAuth()
  }

  if (!authStore.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }

  // Admin-only routes
  if (to.path === '/dashboard' && authStore.user?.role !== 'admin') {
    return navigateTo('/outlets')
  }
})