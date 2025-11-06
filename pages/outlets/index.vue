<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const outletStore = useOutletStore()

const user = computed(() => authStore.user)
const loading = computed(() => outletStore.loading)
const error = computed(() => outletStore.error)

const searchQuery = ref('')
const selectedRegion = ref('')
const selectedStatus = ref('')

const filteredOutlets = computed(() => {
  let outlets = outletStore.outlets

  // Filter by role
  if (user.value?.role === 'sales') {
    outlets = outlets.filter(o => o.salesPersonId === user.value?.id)
  }

  // Filter by search
  if (searchQuery.value) {
    outlets = outlets.filter(o =>
      o.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by region
  if (selectedRegion.value) {
    outlets = outlets.filter(o => o.region === selectedRegion.value)
  }

  // Filter by status
  if (selectedStatus.value === 'active') {
    outlets = outlets.filter(o => o.isActive)
  } else if (selectedStatus.value === 'inactive') {
    outlets = outlets.filter(o => !o.isActive)
  }

  return outlets
})

const handleSearchUpdate = (value: string) => {
  searchQuery.value = value
}

const handleRegionUpdate = (value: string) => {
  selectedRegion.value = value
}

const handleStatusUpdate = (value: string) => {
  selectedStatus.value = value
}

const refreshData = async () => {
  await outletStore.fetchOutlets()
}

onMounted(async () => {
  await refreshData()
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">
        {{ user?.role === 'admin' ? 'All Outlets' : 'My Outlets' }}
      </h2>
      <button @click="refreshData" class="btn-secondary" :disabled="loading">
        <svg class="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </div>

    <OutletFilter :regions="outletStore.regions" @update:search="handleSearchUpdate" @update:region="handleRegionUpdate"
      @update:status="handleStatusUpdate" />

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="card text-center py-12">
      <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-red-600 mb-2">{{ error }}</p>
      <button @click="refreshData" class="btn-primary">
        Coba Lagi
      </button>
    </div>

    <div v-else-if="filteredOutlets.length === 0" class="card text-center py-12">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p class="text-gray-600">Tidak ada outlet yang ditemukan</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <OutletCard v-for="outlet in filteredOutlets" :key="outlet.id" :outlet="outlet" />
    </div>
  </div>
</template>
