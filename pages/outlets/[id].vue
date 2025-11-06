<script setup lang="ts">
import type { Order } from '~/types'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const outletStore = useOutletStore()
const orderStore = useOrderStore()

const loading = ref(true)

const outlet = computed(() => {
  return outletStore.getOutletById(route.params.id as string)
})

const outletOrders = computed(() => {
  return orderStore.getOrdersByOutlet(route.params.id as string)
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const handleOrderAdded = (order: Order) => {
  // Refresh orders
  orderStore.fetchOrders()
}

onMounted(async () => {
  loading.value = true
  await Promise.all([
    outletStore.fetchOutlets(),
    orderStore.fetchOrders(),
  ])
  loading.value = false
})
</script>

<template>
  <div>
    <button @click="$router.back()" class="btn-secondary mb-6">
      ← Kembali
    </button>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="!outlet" class="card text-center py-12">
      <p class="text-gray-600">Outlet tidak ditemukan</p>
    </div>

    <div v-else>
      <div class="card mb-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ outlet.name }}</h2>
            <p class="text-gray-600">{{ outlet.region }}</p>
          </div>
          <span class="badge" :class="outlet.isActive ? 'badge-success' : 'badge-danger'">
            {{ outlet.isActive ? 'Aktif' : 'Tidak Aktif' }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <p class="text-sm text-gray-600">Alamat</p>
            <p class="font-medium text-gray-900">{{ outlet.address }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Telepon</p>
            <p class="font-medium text-gray-900">{{ outlet.phone }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Orders</p>
            <p class="font-medium text-gray-900">{{ outlet.totalOrders }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Wilayah</p>
            <p class="font-medium text-gray-900">{{ outlet.region }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OutletOrderForm :outlet-id="outlet.id" @order-added="handleOrderAdded" />

        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Daftar Order</h3>

          <div v-if="outletOrders.length === 0" class="text-center py-8 text-gray-600">
            Belum ada order
          </div>

          <div v-else class="space-y-3">
            <div v-for="order in outletOrders" :key="order.id" class="p-4 border border-gray-200 rounded-lg">
              <div class="flex justify-between items-start mb-2">
                <p class="font-medium text-gray-900">{{ order.productName }}</p>
                <span class="badge" :class="{
                  'badge-success': order.status === 'completed',
                  'bg-yellow-100 text-yellow-800': order.status === 'pending',
                  'badge-danger': order.status === 'cancelled',
                }">
                  {{ order.status }}
                </span>
              </div>
              <div class="text-sm text-gray-600 space-y-1">
                <p>Quantity: {{ order.quantity }}</p>
                <p>Harga: {{ formatCurrency(order.price) }}</p>
                <p>Total: {{ formatCurrency(order.price * order.quantity) }}</p>
                <p>Tanggal: {{ formatDate(order.date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
