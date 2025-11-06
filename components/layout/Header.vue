<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <h1 class="text-xl md:text-2xl font-bold text-blue-600">
            Sales Dashboard
          </h1>
        </div>

        <div v-if="isAuthenticated" class="flex items-center space-x-4">
          <div class="hidden md:block text-right">
            <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
            <p class="text-xs text-gray-500 capitalize">{{ user?.role }}</p>
          </div>
          <button @click="handleLogout" class="btn-secondary text-sm">
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
