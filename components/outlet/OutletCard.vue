<script setup lang="ts">
import type { Outlet } from '~/types'

defineProps<{
  outlet: Outlet
}>()
</script>

<template>
  <NuxtLink :to="`/outlets/${outlet.id}`"
    class="card hover:shadow-lg border hover:border-blue-300 hover:bg-blue-50 transition-shadow duration-200 cursor-pointer">
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ outlet.name }}</h3>
        <p class="text-sm text-gray-500">{{ outlet.region }}</p>
      </div>
      <span class="badge" :class="outlet.isActive ? 'badge-success' : 'badge-danger'">
        {{ outlet.isActive ? 'Aktif' : 'Tidak Aktif' }}
      </span>
    </div>

    <div class="space-y-2 text-sm text-gray-600">
      <div class="flex items-center">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {{ outlet.address }}
      </div>

      <div class="flex items-center">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        {{ outlet.phone }}
      </div>

      <div class="flex items-center font-medium text-blue-600 mt-4">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Total Orders: {{ outlet.totalOrders }}
      </div>
    </div>
  </NuxtLink>
</template>
