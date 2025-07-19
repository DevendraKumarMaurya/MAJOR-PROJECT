import { defineStore } from 'pinia'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from './auth'

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    incomes: [],
    expenses: [],
    goals: [],
    loading: false,
    error: null
  }),

  getters: {
    totalIncome: (state) => {
      return state.incomes.reduce((sum, income) => sum + income.amount, 0)
    },

    totalExpenses: (state) => {
      return state.expenses.reduce((sum, expense) => sum + expense.amount, 0)
    },

    netBalance: (state) => {
      return state.totalIncome - state.totalExpenses
    },

    expensesByCategory: (state) => {
      const categories = {}
      state.expenses.forEach(expense => {
        if (categories[expense.category]) {
          categories[expense.category] += expense.amount
        } else {
          categories[expense.category] = expense.amount
        }
      })
      return categories
    },

    monthlyData: (state) => {
      const months = {}

      // Process incomes
      state.incomes.forEach(income => {
        const month = new Date(income.date).toISOString().slice(0, 7)
        if (!months[month]) {
          months[month] = { income: 0, expenses: 0 }
        }
        months[month].income += income.amount
      })

      // Process expenses
      state.expenses.forEach(expense => {
        const month = new Date(expense.date).toISOString().slice(0, 7)
        if (!months[month]) {
          months[month] = { income: 0, expenses: 0 }
        }
        months[month].expenses += expense.amount
      })

      return months
    }
  },

  actions: {
    async fetchData() {
      const authStore = useAuthStore()
      if (!authStore.userId) return

      this.loading = true
      this.error = null

      try {
        await Promise.all([
          this.fetchIncomes(),
          this.fetchExpenses(),
          this.fetchGoals()
        ])
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchIncomes() {
      const authStore = useAuthStore()
      const q = query(
        collection(db, 'users', authStore.userId, 'incomes'),
        orderBy('date', 'desc')
      )
      const querySnapshot = await getDocs(q)
      this.incomes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    },

    async fetchExpenses() {
      const authStore = useAuthStore()
      const q = query(
        collection(db, 'users', authStore.userId, 'expenses'),
        orderBy('date', 'desc')
      )
      const querySnapshot = await getDocs(q)
      this.expenses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    },

    async fetchGoals() {
      const authStore = useAuthStore()
      const q = query(
        collection(db, 'users', authStore.userId, 'goals'),
        orderBy('deadline', 'asc')
      )
      const querySnapshot = await getDocs(q)
      this.goals = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    },

    async addIncome(incomeData) {
      const authStore = useAuthStore()
      try {
        const docRef = await addDoc(
          collection(db, 'users', authStore.userId, 'incomes'),
          {
            ...incomeData,
            createdAt: new Date()
          }
        )
        this.incomes.unshift({ id: docRef.id, ...incomeData })
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      }
    },

    async addExpense(expenseData) {
      const authStore = useAuthStore()
      try {
        const docRef = await addDoc(
          collection(db, 'users', authStore.userId, 'expenses'),
          {
            ...expenseData,
            createdAt: new Date()
          }
        )
        this.expenses.unshift({ id: docRef.id, ...expenseData })
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      }
    },

    async addGoal(goalData) {
      const authStore = useAuthStore()
      try {
        const docRef = await addDoc(
          collection(db, 'users', authStore.userId, 'goals'),
          {
            ...goalData,
            createdAt: new Date()
          }
        )
        this.goals.push({ id: docRef.id, ...goalData })
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      }
    },

    async deleteIncome(id) {
      const authStore = useAuthStore()
      try {
        await deleteDoc(doc(db, 'users', authStore.userId, 'incomes', id))
        this.incomes = this.incomes.filter(income => income.id !== id)
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      }
    },

    async deleteExpense(id) {
      const authStore = useAuthStore()
      try {
        await deleteDoc(doc(db, 'users', authStore.userId, 'expenses', id))
        this.expenses = this.expenses.filter(expense => expense.id !== id)
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      }
    },

    async deleteGoal(id) {
      const authStore = useAuthStore()
      try {
        await deleteDoc(doc(db, 'users', authStore.userId, 'goals', id))
        this.goals = this.goals.filter(goal => goal.id !== id)
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      }
    },

    async updateIncome(id, incomeData) {
      const authStore = useAuthStore()
      try {
        const docRef = doc(db, 'users', authStore.userId, 'incomes', id)
        await updateDoc(docRef, {
          ...incomeData,
          updatedAt: new Date()
        })

        const index = this.incomes.findIndex(income => income.id === id)
        if (index !== -1) {
          this.incomes[index] = { ...this.incomes[index], ...incomeData }
        }
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      }
    },

    async updateExpense(id, expenseData) {
      const authStore = useAuthStore()
      try {
        const docRef = doc(db, 'users', authStore.userId, 'expenses', id)
        await updateDoc(docRef, {
          ...expenseData,
          updatedAt: new Date()
        })

        const index = this.expenses.findIndex(expense => expense.id === id)
        if (index !== -1) {
          this.expenses[index] = { ...this.expenses[index], ...expenseData }
        }
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      }
    },

    async updateGoal(id, goalData) {
      const authStore = useAuthStore()
      try {
        const docRef = doc(db, 'users', authStore.userId, 'goals', id)
        await updateDoc(docRef, {
          ...goalData,
          updatedAt: new Date()
        })

        const index = this.goals.findIndex(goal => goal.id === id)
        if (index !== -1) {
          this.goals[index] = { ...this.goals[index], ...goalData }
        }
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      }
    }
  }
})
