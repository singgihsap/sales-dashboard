<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const outletStore = useOutletStore()

const user = computed(() => authStore.user)

const stats = computed(() => {
  const outlets = outletStore.outlets
  const totalOutlets = outlets.length
  const activeOutlets = outlets.filter(o => o.isActive).length
  const totalOrders = outlets.reduce((sum, o) => sum + o.totalOrders, 0)

  return {
    totalOutlets,
    activeOutlets,
    totalOrders,
  }
})

onMounted(async () => {
  await outletStore.fetchOutlets()
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">
      Selamat Datang, <span class="text-blue-600">{{ user?.name }}</span> !
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Outlets</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">
              {{ stats.totalOutlets }}
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Active Outlets</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">
              {{ stats.activeOutlets }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Orders</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">
              {{ stats.totalOrders }}
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 card">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink v-if="user?.role === 'admin'" to="/dashboard"
          class="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
          <p class="font-medium text-gray-900">View Dashboard</p>
          <p class="text-sm text-gray-600 mt-1">Lihat grafik dan analisis penjualan</p>
        </NuxtLink>

        <NuxtLink to="/outlets"
          class="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
          <p class="font-medium text-gray-900">Manage Outlets</p>
          <p class="text-sm text-gray-600 mt-1">Kelola data outlet dan pesanan</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
