import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
let isRedirecting = false
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      // Token expired or invalid
      isRedirecting = true

      // Clear all auth-related data
      localStorage.removeItem('token')
      localStorage.removeItem('sevem-auth-storage')

      // Clear axios auth header
      delete api.defaults.headers.common['Authorization']

      // Redirect to login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
