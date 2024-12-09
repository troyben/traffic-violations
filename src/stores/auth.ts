import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface User {
    id: number
    firstName: string
    lastName: string
    email: string
    role: 'user' | 'admin' | 'device'
}

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const token = ref<string | null>(localStorage.getItem('token'))
    const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
    const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))

    // Computed property to check if user is admin
    const isAdmin = computed(() => user.value?.role === 'admin')

    const setToken = (newToken: string) => {
        token.value = newToken
        localStorage.setItem('token', newToken)
    }

    const setRefreshToken = (newRefreshToken: string) => {
        refreshToken.value = newRefreshToken
        localStorage.setItem('refreshToken', newRefreshToken)
    }

    const setUser = (userData: User) => {
        user.value = userData
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const logout = () => {
        // Clear localStorage first
        localStorage.clear() // Clear all storage at once
        
        // Then clear the store state
        token.value = null
        refreshToken.value = null
        user.value = null
        
        // Force a direct page reload and redirect
        window.location.href = '/auth/login'
    }

    return {
        token,
        refreshToken,
        user,
        isAdmin,
        setToken,
        setRefreshToken,
        setUser,
        logout
    }
})