<template>
  <aside class="sidebar">
    <!-- Mobile close button -->
    <div class="sidebar-header lg:hidden">
      <h2 class="sidebar-title">💰 Menu</h2>
      <button @click="$emit('close')" class="close-btn">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
            <span class="nav-icon">📊</span>
            Dashboard
          </router-link>
        </li>
      </ul>

      <div class="sidebar-section">
        <h3 class="section-title">Management</h3>
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/income" class="nav-link" :class="{ active: $route.path === '/income' }">
              <span class="nav-icon">💰</span>
              Income
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/expenses" class="nav-link" :class="{ active: $route.path === '/expenses' }">
              <span class="nav-icon">💸</span>
              Expenses
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/goals" class="nav-link" :class="{ active: $route.path === '/goals' }">
              <span class="nav-icon">🎯</span>
              Goals
            </router-link>
          </li>
        </ul>
      </div>

      <div class="sidebar-section">
        <h3 class="section-title">Quick Actions</h3>
        <ul class="nav-list">
          <li class="nav-item">
            <button @click="$emit('show-income-form')" class="nav-button">
              <span class="nav-icon">➕</span>
              Add Income
            </button>
          </li>
          <li class="nav-item">
            <button @click="$emit('show-expense-form')" class="nav-button">
              <span class="nav-icon">➕</span>
              Add Expense
            </button>
          </li>
          <li class="nav-item">
            <button @click="$emit('show-goal-form')" class="nav-button">
              <span class="nav-icon">➕</span>
              Add Goal
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <!-- User info and logout at bottom -->
    <div class="sidebar-footer">
      <div class="user-section">
        <span class="user-info">Welcome, {{ authStore.userName }}</span>
        <button @click="handleLogout" class="logout-btn">
          <span class="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </div>

    <!-- Modals -->
  </aside>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'Sidebar',
  emits: ['close', 'show-income-form', 'show-expense-form', 'show-goal-form'],
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const handleLogout = async () => {
      try {
        // First try the normal logout (with Firebase signOut)
        const result = await authStore.logout()
        
        if (result.success) {
          if (result.warning) {
            console.warn(result.warning)
          }
          router.push('/login')
        }
      } catch (error) {
        console.error('Normal logout failed, trying local logout:', error)
        
        // If normal logout fails completely, try local-only logout
        try {
          const localResult = await authStore.logoutLocal()
          if (localResult.success) {
            console.log('Local logout successful')
            router.push('/login')
          }
        } catch (localError) {
          console.error('Both logout methods failed:', localError)
          // Force navigation anyway since we want user to go to login
          router.push('/login')
        }
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
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: white;
  border-right: 1px solid #e0e0e0;
  overflow: hidden;
  z-index: 999;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Sidebar header for mobile */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f8f9fa;
}

.sidebar-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
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

.close-btn:hover {
  background-color: #e5e7eb;
  color: #374151;
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

/* Mobile/Tablet: Show sidebar when toggled */
@media (max-width: 1023px) {
  .sidebar.open {
    transform: translateX(0);
  }
}

/* Desktop: Always show sidebar */
@media (min-width: 1024px) {
  .sidebar {
    position: fixed;
    top: 60px;
    /* Header height */
    left: 0;
    transform: translateX(0);
    flex-shrink: 0;
    height: calc(100vh - 60px);
    /* Subtract header height */
  }

  .sidebar-header {
    display: none;
  }
}

.sidebar-nav {
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.sidebar-footer {
  margin-top: auto;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background: #f8f9fa;
}

.user-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-info {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0 0.5rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  color: #dc2626;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  margin: 0 0.5rem;
}

.logout-btn:hover {
  background-color: #fee2e2;
  color: #b91c1c;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.nav-link,
.nav-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  color: #6b7280;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  margin: 0 0.5rem;
}

.nav-link:hover,
.nav-button:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.nav-link.active {
  background-color: #dbeafe;
  color: #1d4ed8;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.sidebar-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #9ca3af;
  padding: 0 1rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}

/* Mobile adjustments */
@media (max-width: 1023px) {

  .nav-link,
  .nav-button {
    padding: 1rem;
    font-size: 1rem;
    min-height: 48px;
    /* Touch-friendly */
  }

  .nav-icon {
    font-size: 1.5rem;
    width: 24px;
    height: 24px;
  }
}

/* Sidebar overlay for mobile */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  display: none;
}

@media (max-width: 1023px) {
  .sidebar-overlay.active {
    display: block;
  }
}

/* Utility classes */
.w-6 {
  width: 1.5rem;
}

.h-6 {
  height: 1.5rem;
}

@media (max-width: 1023px) {
  .lg\:hidden {
    display: flex;
  }
}

@media (min-width: 1024px) {
  .lg\:hidden {
    display: none;
  }
}
</style>
