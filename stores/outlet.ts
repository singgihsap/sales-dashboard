import { defineStore } from 'pinia'
import type { Outlet } from '~/types'

export const useOutletStore = defineStore('outlet', {
  state: () => ({
    outlets: [] as Outlet[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getOutletById: (state) => (id: string) => {
      return state.outlets.find(o => o.id === id)
    },

    getOutletsByRegion: (state) => (region: string) => {
      return state.outlets.filter(o => o.region === region)
    },

    activeOutlets: (state) => {
      return state.outlets.filter(o => o.isActive)
    },

    regions: (state) => {
      return [...new Set(state.outlets.map(o => o.region))]
    },
  },

  actions: {
    async fetchOutlets() {
      this.loading = true
      this.error = null

      try {
        // Cek localStorage dulu
        if (process.client) {
          const cached = localStorage.getItem('outlets')
          if (cached) {
            this.outlets = JSON.parse(cached)
            this.loading = false
            return
          }
        }

        // Dummy data
        await new Promise(resolve => setTimeout(resolve, 500))

        this.outlets = [
          {
            id: '1',
            name: 'Toko Sejahtera',
            region: 'Jakarta',
            address: 'Jl. Sudirman No. 123',
            phone: '021-12345678',
            totalOrders: 45,
            isActive: true,
            salesPersonId: '2',
          },
          {
            id: '2',
            name: 'Warung Makmur',
            region: 'Jakarta',
            address: 'Jl. Gatot Subroto No. 45',
            phone: '021-87654321',
            totalOrders: 32,
            isActive: true,
            salesPersonId: '2',
          },
          {
            id: '3',
            name: 'Minimarket Jaya',
            region: 'Bandung',
            address: 'Jl. Asia Afrika No. 67',
            phone: '022-23456789',
            totalOrders: 28,
            isActive: true,
          },
          {
            id: '4',
            name: 'Toko Berkah',
            region: 'Bandung',
            address: 'Jl. Dago No. 89',
            phone: '022-98765432',
            totalOrders: 15,
            isActive: false,
          },
          {
            id: '5',
            name: 'Swalayan Maju',
            region: 'Yogyakarta',
            address: 'Jl. Gejayan No. 12',
            phone: '031-34567890',
            totalOrders: 52,
            isActive: true,
          },
        ]

        if (process.client) {
          localStorage.setItem('outlets', JSON.stringify(this.outlets))
        }
      } catch (err: any) {
        this.error = err.message || 'Gagal memuat data outlet'
      } finally {
        this.loading = false
      }
    },
  },
})