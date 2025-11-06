<script setup lang="ts">
import type { SalesData } from '~/types'

definePageMeta({
  middleware: 'auth',
})

const outletStore = useOutletStore()
const orderStore = useOrderStore()

const loading = ref(true)
const error = ref<string | null>(null)

const salesData = computed<SalesData[]>(() => {
  const regions = outletStore.regions

  return regions.map(region => {
    const regionOutlets = outletStore.getOutletsByRegion(region)
    const total = regionOutlets.reduce((sum, outlet) => {
      const outletOrders = orderStore.getOrdersByOutlet(outlet.id)
      const outletTotal = outletOrders
        .filter(order => order.status === 'completed')
        .reduce((orderSum, order) => orderSum + (order.price * order.quantity), 0)
      return sum + outletTotal
    }, 0)

    return {
      region,
      total,
    }
  }).sort((a, b) => b.total - a.total)
})

const totalSales = computed(() => {
  return salesData.value.reduce((sum, item) => sum + item.total, 0)
})

const topRegion = computed(() => {
  return salesData.value[0]?.region || '-'
})

const averagePerRegion = computed(() => {
  const regions = salesData.value.length
  return regions > 0 ? totalSales.value / regions : 0
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const getOutletCountByRegion = (region: string) => {
  return outletStore.getOutletsByRegion(region).length
}

const refreshData = async () => {
  loading.value = true
  error.value = null

  try {
    await Promise.all([
      outletStore.fetchOutlets(),
      orderStore.fetchOrders(),
    ])
  } catch (err: any) {
    error.value = err.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await refreshData()
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Dashboard Penjualan</h2>
      <button @click="refreshData" class="btn-secondary" :disabled="loading">
        <svg class="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="card text-center py-12">
      <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="card">
          <p class="text-sm text-gray-600">Total Penjualan</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">
            {{ formatCurrency(totalSales) }}
          </p>
        </div>

        <div class="card">
          <p class="text-sm text-gray-600">Wilayah Terbanyak</p>
          <p class="text-2xl font-bold text-blue-600 mt-1">
            {{ topRegion }}
          </p>
        </div>

        <div class="card">
          <p class="text-sm text-gray-600">Rata-rata per Wilayah</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">
            {{ formatCurrency(averagePerRegion) }}
          </p>
        </div>

        <div class="card">
          <p class="text-sm text-gray-600">Total Outlet</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">
            {{ outletStore.outlets.length }}
          </p>
        </div>
      </div>

      <DashboardSalesChart :data="salesData" />

      <div class="mt-6 card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Penjualan per Wilayah
        </h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wilayah
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Penjualan
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Outlet
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rata-rata
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in salesData" :key="item.region">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ item.region }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatCurrency(item.total) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getOutletCountByRegion(item.region) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(item.total / getOutletCountByRegion(item.region)) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
