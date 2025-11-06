<script setup lang="ts">
import type { SalesData } from '~/types'

const props = defineProps<{
  data: SalesData[]
}>()

const loading = ref(false)
const error = ref<string | null>(null)

const chartOptions = computed(() => ({
  chart: {
    id: 'sales-chart',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      dataLabels: {
        position: 'top',
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(val)
    },
    offsetY: -20,
    style: {
      fontSize: '12px',
      colors: ['#304758'],
    },
  },
  xaxis: {
    categories: props.data.map(d => d.region),
    position: 'bottom',
    labels: {
      style: {
        fontSize: '12px',
      },
    },
  },
  yaxis: {
    labels: {
      formatter: (val: number) => {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          notation: 'compact',
        }).format(val)
      },
    },
  },
  colors: ['#3b82f6'],
  grid: {
    borderColor: '#f1f1f1',
  },
}))

const series = computed(() => [{
  name: 'Total Penjualan',
  data: props.data.map(d => d.total),
}])
</script>

<template>
  <div class="card">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      Total Penjualan per Wilayah
    </h3>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="text-center py-8 text-red-600">
      {{ error }}
    </div>

    <ClientOnly v-else>
      <apexchart type="bar" height="350" :options="chartOptions" :series="series" />
    </ClientOnly>
  </div>
</template>
