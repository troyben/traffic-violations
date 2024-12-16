import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import router from '../router'
import { authService } from './auth.service'

// Get the API URL from environment variables
const apiUrl = import.meta.env.VITE_API_URL

if (!apiUrl) {
    console.error('API URL is not defined in environment variables')
}

const api = axios.create({
    baseURL: apiUrl
})

// Request interceptor to add auth token
api.interceptors.request.use(
    config => {
        const authStore = useAuthStore()
        if (authStore.token) {
            config.headers['Authorization'] = `Bearer ${authStore.token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// Response interceptor
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config

        // Don't attempt token refresh for login requests
        if (originalRequest.headers['X-Login-Request']) {
            return Promise.reject(error)
        }

        if (originalRequest._retry) {
            // If we already tried refreshing, logout and redirect
            const authStore = useAuthStore()
            authStore.logout()
            router.push('/auth/login')
            return Promise.reject(error)
        }

        if (error.response?.status === 401 || error.response?.status === 403) {
            originalRequest._retry = true
            const authStore = useAuthStore()
            
            try {
                const response = await authService.refreshToken()
                authStore.setToken(response.token)
                originalRequest.headers['Authorization'] = `Bearer ${response.token}`
                return api(originalRequest)
            } catch (refreshError) {
                // Clear tokens and redirect to login
                localStorage.removeItem('refreshToken')
                authStore.logout()
                router.push('/auth/login')
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api 