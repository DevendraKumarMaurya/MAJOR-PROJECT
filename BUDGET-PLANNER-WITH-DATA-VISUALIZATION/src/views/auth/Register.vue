<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="text-center mb-4">Create Account</h2>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required placeholder="Enter your email" />
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required placeholder="Enter your password"
            minlength="6" />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required
            placeholder="Confirm your password" minlength="6" />
        </div>

        <div v-if="error" class="error mb-3">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? 'Creating Account...' : 'Register' }}
        </button>
      </form>

      <div class="text-center mt-3">
        <p>Already have an account?
          <router-link to="/login" class="link">Login here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Register',
  setup() {
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const error = ref('')
    const router = useRouter()
    const authStore = useAuthStore()

    const handleRegister = async () => {
      error.value = ''

      if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match'
        return
      }

      if (password.value.length < 6) {
        error.value = 'Password must be at least 6 characters long'
        return
      }

      const result = await authStore.register(email.value, password.value)

      if (result.success) {
        router.push('/')
      } else {
        error.value = result.error
      }
    }

    return {
      email,
      password,
      confirmPassword,
      error,
      loading: authStore.loading,
      handleRegister
    }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.w-100 {
  width: 100%;
}

.link {
  color: #007bff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
