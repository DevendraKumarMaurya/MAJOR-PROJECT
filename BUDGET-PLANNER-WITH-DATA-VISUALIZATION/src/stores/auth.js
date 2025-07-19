import { defineStore } from 'pinia'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '@/firebase/config'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userName: (state) => state.user?.email || '',
    userId: (state) => state.user?.uid || null
  },

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async register(email, password) {
      this.loading = true
      this.error = null

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      this.error = null

      try {
        // Clear user state immediately for better UX
        this.user = null

        // Clear any stored tokens or session data first
        localStorage.removeItem('user')
        sessionStorage.clear()

        // Try to sign out from Firebase with a timeout
        const signOutPromise = signOut(auth)
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firebase signOut timeout')), 3000)
        )

        try {
          await Promise.race([signOutPromise, timeoutPromise])
        } catch (firebaseError) {
          console.warn('Firebase signOut failed or timed out, but user is logged out locally:', firebaseError)
        }

        return { success: true }
      } catch (error) {
        console.warn('Logout process encountered an error, but user state cleared locally:', error)

        // Ensure local state is cleared even if there's any error
        this.user = null
        localStorage.removeItem('user')
        sessionStorage.clear()

        return { success: true, warning: 'Logged out locally, network connection may be limited' }
      } finally {
        this.loading = false
      }
    },

    // Alternative logout method that skips Firebase network calls
    logoutLocal() {
      this.loading = true
      this.error = null

      try {
        // Clear all local state and storage
        this.user = null
        localStorage.removeItem('user')
        sessionStorage.clear()

        // Clear any Firebase-related data from local storage
        const firebaseKeys = Object.keys(localStorage).filter(key =>
          key.startsWith('firebase:') || key.includes('firebase')
        )
        firebaseKeys.forEach(key => localStorage.removeItem(key))

        console.log('User logged out locally (skipped Firebase network call)')
        return { success: true, method: 'local' }
      } catch (error) {
        console.error('Local logout failed:', error)
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    initializeAuth() {
      try {
        onAuthStateChanged(auth, (user) => {
          this.user = user
          // Store user state for persistence
          if (user) {
            localStorage.setItem('user', JSON.stringify({
              uid: user.uid,
              email: user.email
            }))
          } else {
            localStorage.removeItem('user')
          }
        })
      } catch (error) {
        console.warn('Firebase auth state listener failed:', error)
        // Try to restore user from localStorage if Firebase fails
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            this.user = userData
          } catch (parseError) {
            console.error('Failed to parse stored user data:', parseError)
            localStorage.removeItem('user')
          }
        }
      }
    }
  }
})
