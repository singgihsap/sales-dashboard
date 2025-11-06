import { defineStore } from 'pinia'
import type { Order } from '~/types'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as Order[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getOrdersByOutlet: (state) => (outletId: string) => {
      return state.orders.filter(o => o.outletId === outletId)
    },
  },

  actions: {
    async fetchOrders() {
      this.loading = true
      this.error = null

      try {
        if (process.client) {
          const cached = localStorage.getItem('orders')
          if (cached) {
            this.orders = JSON.parse(cached)
            this.loading = false
            return
          }
        }

        await new Promise(resolve => setTimeout(resolve, 300))

        this.orders = [
          {
            id: '1',
            outletId: '1',
            productName: 'Mie Instan',
            quantity: 50,
            price: 2500,
            date: '2025-11-01',
            status: 'completed',
          },
          {
            id: '2',
            outletId: '1',
            productName: 'Kopi Sachet',
            quantity: 100,
            price: 1500,
            date: '2025-11-03',
            status: 'completed',
          },
          {
            id: '3',
            outletId: '2',
            productName: 'Teh Botol',
            quantity: 24,
            price: 4000,
            date: '2025-11-02',
            status: 'pending',
          },
          {
            id: '4',
            outletId: '1',
            productName: 'Biscuit',
            quantity: 75,
            price: 3000,
            date: '2025-11-04',
            status: 'completed',
          },
          {
            id: '5',
            outletId: '2',
            productName: 'Air Mineral',
            quantity: 48,
            price: 3500,
            date: '2025-11-05',
            status: 'completed',
          },
          {
            id: '6',
            outletId: '3',
            productName: 'Snack',
            quantity: 60,
            price: 5000,
            date: '2025-11-03',
            status: 'completed',
          },
          {
            id: '7',
            outletId: '5',
            productName: 'Deterjen',
            quantity: 30,
            price: 15000,
            date: '2025-11-02',
            status: 'completed',
          },
        ]

        if (process.client) {
          localStorage.setItem('orders', JSON.stringify(this.orders))
        }
      } catch (err: any) {
        this.error = err.message || 'Gagal memuat data order'
      } finally {
        this.loading = false
      }
    },

    addOrder(order: Omit<Order, 'id'>) {
      const newOrder: Order = {
        ...order,
        id: Date.now().toString(),
      }

      this.orders.push(newOrder)

      if (process.client) {
        localStorage.setItem('orders', JSON.stringify(this.orders))
      }
    },
  },
})