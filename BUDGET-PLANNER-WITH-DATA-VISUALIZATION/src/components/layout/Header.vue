<template>
  <header class="header">
    <div class="header-content">
      <!-- Mobile menu button -->
      <button @click="$emit('toggle-sidebar')" class="mobile-menu-btn lg:hidden">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <div class="logo">
        <h1 class="logo-text">💰 Budget Planner</h1>
      </div>

      <div class="header-actions">
        <span class="user-info hidden lg:inline">Welcome, {{ authStore.userName }}</span>
        <button @click="handleLogout" class="btn btn-secondary logout-btn lg:hidden">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'Header',
  emits: ['toggle-sidebar'],
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const handleLogout = async () => {
      const result = await authStore.logout()
      if (result.success) {
        router.push('/login')
      }
    }

    return {
      authStore,
      handleLogout
    }
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  height: 60px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 1rem;
  max-width: 100%;
}

@media (min-width: 768px) {
  .header-content {
    padding: 0 2rem;
  }
}

/* Mobile menu button */
.mobile-menu-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-menu-btn:hover {
  background-color: #f3f4f6;
}

.mobile-menu-btn svg {
  width: 24px;
  height: 24px;
}

.logo {
  flex: 1;
  text-align: center;
}

@media (min-width: 768px) {
  .logo {
    flex: none;
    text-align: left;
  }
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

@media (max-width: 767px) {
  .logo-text {
    font-size: 1.125rem;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-info {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  min-height: 40px;
}

@media (min-width: 768px) {
  .logout-btn {
    padding: 0.5rem 1rem;
  }
}

.logout-btn svg {
  width: 16px;
  height: 16px;
}

/* Responsive utilities */
.hidden {
  display: none;
}

@media (max-width: 767px) {
  .md\:hidden {
    display: none;
  }
}

@media (max-width: 1023px) {
  .lg\:hidden {
    display: flex;
  }
}

@media (min-width: 768px) {
  .md\:inline {
    display: inline;
  }
}

@media (min-width: 1024px) {
  .lg\:hidden {
    display: none;
  }

  .lg\:inline {
    display: inline;
  }
}

.w-4 {
  width: 1rem;
}

.h-4 {
  height: 1rem;
}

.w-6 {
  width: 1.5rem;
}

.h-6 {
  height: 1.5rem;
}
</style>
