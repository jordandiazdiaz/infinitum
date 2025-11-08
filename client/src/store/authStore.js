import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post('/auth/login', { email, password })
          const { token, user } = response.data

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })

          // Set token in localStorage and api instance
          localStorage.setItem('token', token)
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`

          return { success: true }
        } catch (error) {
          set({
            error: error.response?.data?.error || 'Error al iniciar sesión',
            isLoading: false
          })
          return {
            success: false,
            error: error.response?.data?.error || 'Error al iniciar sesión'
          }
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post('/auth/register', userData)
          const { token, user } = response.data

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })

          // Set token in localStorage and api instance
          localStorage.setItem('token', token)
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`

          return { success: true }
        } catch (error) {
          set({
            error: error.response?.data?.error || 'Error al registrarse',
            isLoading: false
          })
          return {
            success: false,
            error: error.response?.data?.error || 'Error al registrarse'
          }
        }
      },

      // Logout
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        })
        // Clear localStorage and api headers
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
      },

      // Get current user
      getCurrentUser: async () => {
        const { token } = get()
        if (!token) return

        set({ isLoading: true })
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const response = await api.get('/auth/me')
          set({
            user: response.data.data,
            isLoading: false
          })
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          })
          delete api.defaults.headers.common['Authorization']
        }
      },

      // Update user
      updateUser: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.put('/auth/updatedetails', userData)
          set({
            user: response.data.data,
            isLoading: false
          })
          return { success: true }
        } catch (error) {
          set({
            error: error.response?.data?.error || 'Error al actualizar usuario',
            isLoading: false
          })
          return {
            success: false,
            error: error.response?.data?.error || 'Error al actualizar usuario'
          }
        }
      },

      // Clear error
      clearError: () => set({ error: null })
    }),
    {
      name: 'sevem-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
