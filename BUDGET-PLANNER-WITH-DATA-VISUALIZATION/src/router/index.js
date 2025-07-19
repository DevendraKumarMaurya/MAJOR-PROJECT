import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '@/views/Home.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import IncomeManagement from '@/views/IncomeManagement.vue'
import ExpenseManagement from '@/views/ExpenseManagement.vue'
import GoalManagement from '@/views/GoalManagement.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/income',
      name: 'income-management',
      component: IncomeManagement,
      meta: { requiresAuth: true }
    },
    {
      path: '/expenses',
      name: 'expense-management',
      component: ExpenseManagement,
      meta: { requiresAuth: true }
    },
    {
      path: '/goals',
      name: 'goal-management',
      component: GoalManagement,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { requiresAuth: false }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (!to.meta.requiresAuth && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
