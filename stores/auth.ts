import { defineStore } from 'pinia'
import type { User } from '~/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
  }),

  actions: {
    login(username: string, password: string) {
      const users: User[] = [
        {
          id: '1',
          username: 'admin',
          role: 'admin',
          name: 'Admin User',
        },
        {
          id: '2',
          username: 'sales',
          role: 'sales',
          name: 'Sales User',
          region: 'Jakarta',
        },
      ]

      const user = users.find(u => u.username === username)

      if (user && this.validatePassword(username, password)) {
        this.user = user
        this.isAuthenticated = true

        if (process.client) {
          localStorage.setItem('user', JSON.stringify(user))
        }

        return true
      }

      return false
    },

    validatePassword(username: string, password: string): boolean {
      const credentials: Record<string, string> = {
        'admin': 'admin123',
        'sales': 'sales123',
      }
      return credentials[username] === password
    },

    logout() {
      this.user = null
      this.isAuthenticated = false

      if (process.client) {
        localStorage.removeItem('user')
        localStorage.removeItem('outlets')
        localStorage.removeItem('orders')
      }
    },

    checkAuth() {
      if (process.client) {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          this.user = JSON.parse(savedUser)
          this.isAuthenticated = true
        }
      }
    },
  },
})