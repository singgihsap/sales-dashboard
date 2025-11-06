<script setup lang="ts">
definePageMeta({
  layout: false,
})

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  username: '',
  password: '',
})

const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))

  const success = authStore.login(form.username, form.password)

  if (success) {
    const redirectPath = authStore.user?.role === 'admin' ? '/' : '/outlets'
    router.push(redirectPath)
  } else {
    errorMessage.value = 'Username atau password salah!'
  }

  loading.value = false
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    const redirectPath = authStore.user?.role === 'admin' ? '/dashboard' : '/outlets'
    router.push(redirectPath)
  }
})
</script>

<template>
  <div class="auth">
    <div class="auth__main">
      <div class="card">
        <div class="card__header">
          <h1 class="title">
            Sales Dashboard
          </h1>
          <p class="text-gray-600">Silakan login untuk melanjutkan</p>
        </div>

        <form @submit.prevent="handleLogin" class="card__form">
          <div class="card__form__field">
            <div class="label">Username</div>
            <input v-model="form.username" type="text" required placeholder="Masukkan username" class="input-field"
              :disabled="loading" />
          </div>

          <div class="card__form__field">
            <div class="label">Password</div>
            <input v-model="form.password" type="password" required placeholder="Masukkan password" class="input-field"
              :disabled="loading" />
          </div>

          <button type="submit" class="btn-primary w-full" :disabled="loading">
            {{ loading ? 'Loading...' : 'Login' }}
          </button>
        </form>

        <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {{ errorMessage }}
        </div>

        <div class="card__footer">
          <p class="font-medium text-blue-900 mb-2">Demo Credentials:</p>
          <div class="space-y-1 text-blue-700">
            <p><strong>Admin:</strong> admin / admin123</p>
            <p><strong>Sales:</strong> sales / sales123</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.auth {
  @apply min-h-screen;
  @apply flex items-center justify-center;
  @apply bg-gradient-to-br from-blue-200 to-blue-700;
  @apply px-4;

  &__main {
    @apply w-full max-w-md;

    .card {
      &__header {
        @apply text-center mb-8;

        .title {
          @apply text-3xl font-bold text-gray-900;
          @apply mb-2;
        }
      }

      &__form {
        @apply space-y-4;

        &__field {
          .label {
            @apply text-sm font-medium text-gray-700;
            @apply mb-2;
          }
        }
      }

      &__footer {
        @apply mt-6 p-4;
        @apply bg-blue-50;
        @apply rounded-lg;
        @apply text-sm;
      }
    }
  }
}
</style>
