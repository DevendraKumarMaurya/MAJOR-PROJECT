<template>
  <div id="app">
    <!-- Mobile Header -->
    <Header v-if="$route.meta.requiresAuth" @toggle-sidebar="toggleSidebar" />

    <!-- Sidebar Overlay for Mobile -->
    <div v-if="$route.meta.requiresAuth && sidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

    <div class="main-container" :class="{ 'with-sidebar': $route.meta.requiresAuth }">
      <Sidebar 
        v-if="$route.meta.requiresAuth" 
        :class="{ 'open': sidebarOpen }" 
        @close="closeSidebar"
        @show-income-form="showIncomeForm = true"
        @show-expense-form="showExpenseForm = true"
        @show-goal-form="showGoalForm = true"
      />
      <main class="content">
        <RouterView />
      </main>
    </div>

    <!-- Full-screen Form Modals -->
    <IncomeForm v-if="showIncomeForm" @close="showIncomeForm = false" />
    <ExpenseForm v-if="showExpenseForm" @close="showExpenseForm = false" />
    <GoalForm v-if="showGoalForm" @close="showGoalForm = false" />
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import Header from './components/layout/Header.vue'
import Sidebar from './components/layout/Sidebar.vue'
import IncomeForm from './components/forms/IncomeForm.vue'
import ExpenseForm from './components/forms/ExpenseForm.vue'
import GoalForm from './components/forms/GoalForm.vue'
import { useAuthStore } from './stores/auth'

export default {
  name: 'App',
  components: {
    RouterView,
    Header,
    Sidebar,
    IncomeForm,
    ExpenseForm,
    GoalForm
  },
  setup() {
    const authStore = useAuthStore()
    const sidebarOpen = ref(false)
    const showIncomeForm = ref(false)
    const showExpenseForm = ref(false)
    const showGoalForm = ref(false)

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    const closeSidebar = () => {
      sidebarOpen.value = false
    }

    // Close sidebar on window resize for larger screens
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        sidebarOpen.value = false
      }
    }

    onMounted(() => {
      authStore.initializeAuth()
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })

    return {
      sidebarOpen,
      toggleSidebar,
      closeSidebar,
      showIncomeForm,
      showExpenseForm,
      showGoalForm
    }
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 32px;
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

@media (max-width: 767px) {
  .sidebar-overlay {
    display: block;
  }
}

.main-container {
  display: flex;
  flex: 1;
  position: relative;
}

/* Mobile Layout */
@media (max-width: 1023px) {
  .main-container.with-sidebar {
    padding-top: 60px;
    /* Header height */
  }

  .content {
    flex: 1;
    padding: 1rem;
    overflow-x: hidden;
  }
}

/* Desktop Layout */
@media (min-width: 1024px) {
  .main-container.with-sidebar {
    padding-top: 60px;
    /* Header height */
  }

  .main-container.with-sidebar .content {
    flex: 1;
    margin-left: 280px;
    /* Sidebar width */
  }

  .main-container:not(.with-sidebar) .content {
    flex: 1;
    overflow-x: hidden;
    margin-left: 0;
    /* No sidebar, no margin */
  }
}

/* Responsive content adjustments */
.content {
  max-width: 100%;
  box-sizing: border-box;
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
  display: block;
}

@media (min-width: 1024px) {
  .sidebar-overlay {
    display: none !important;
  }
}
</style>
