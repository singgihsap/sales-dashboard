<script setup lang="ts">
import type { Order } from '~/types'

const props = defineProps<{
  outletId: string
}>()

const emit = defineEmits<{
  'order-added': [order: Order]
}>()

const orderStore = useOrderStore()

const form = reactive({
  productName: '',
  quantity: 0,
  price: 0,
  status: 'pending' as Order['status'],
})

const successMessage = ref('')

const handleSubmit = () => {
  const newOrder = {
    outletId: props.outletId,
    productName: form.productName,
    quantity: form.quantity,
    price: form.price,
    date: new Date().toISOString().split('T')[0],
    status: form.status,
  }

  orderStore.addOrder(newOrder)

  successMessage.value = 'Order berhasil ditambahkan!'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)

  resetForm()
  emit('order-added', { ...newOrder, id: Date.now().toString() })
}

const resetForm = () => {
  form.productName = ''
  form.quantity = 0
  form.price = 0
  form.status = 'pending'
}
</script>

<template>
  <div class="card">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Tambah Order Baru</h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Nama Produk *
        </label>
        <input v-model="form.productName" type="text" required placeholder="Contoh: Mie Instan" class="input-field" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Quantity *
          </label>
          <input v-model.number="form.quantity" type="number" required min="1" placeholder="0" class="input-field" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Harga (Rp) *
          </label>
          <input v-model.number="form.price" type="number" required min="0" step="100" placeholder="0"
            class="input-field" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select v-model="form.status" class="input-field">
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div class="flex space-x-3">
        <button type="submit" class="btn-primary flex-1">
          Tambah Order
        </button>
        <button type="button" @click="resetForm" class="btn-secondary">
          Reset
        </button>
      </div>
    </form>

    <div v-if="successMessage" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
      {{ successMessage }}
    </div>
  </div>
</template>
