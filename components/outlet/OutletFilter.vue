<script setup lang="ts">
const props = defineProps<{
  regions: string[]
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:region': [value: string]
  'update:status': [value: string]
}>()

const localSearch = ref('')
const localRegion = ref('')
const localStatus = ref('')

const debouncedSearch = useDebounce((value: string) => {
  emit('update:search', value)
}, 500)

const handleSearchInput = () => {
  debouncedSearch(localSearch.value)
}

watch(localRegion, (value) => {
  emit('update:region', value)
})

watch(localStatus, (value) => {
  emit('update:status', value)
})
</script>

<template>
  <div class="card mb-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Search Outlet
        </label>
        <input v-model="localSearch" type="text" placeholder="Cari nama outlet..." class="input-field"
          @input="handleSearchInput" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Wilayah
        </label>
        <select v-model="localRegion" class="input-field">
          <option value="">Semua Wilayah</option>
          <option v-for="region in regions" :key="region" :value="region">
            {{ region }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select v-model="localStatus" class="input-field">
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
      </div>
    </div>
  </div>
</template>
