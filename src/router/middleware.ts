import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export const authGuard = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const authStore = useAuthStore()
    const publicPages = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password']
    const isPublicPage = publicPages.includes(to.path)
    const hasToken = !!authStore.token
    const hasRefreshToken = !!localStorage.getItem('refreshToken')

    // Clear everything if no refresh token is available
    if (!hasRefreshToken && hasToken) {
        authStore.logout()
        return next('/auth/login')
    }

    // Prevent redirect loops
    if (to.path === '/auth/login' && from.path === '/dashboard') {
        authStore.logout()
        return next()
    }

    try {
        // If going to public page and has token, redirect to dashboard
        if (isPublicPage && hasToken) {
            return next('/dashboard')
        }

        // If going to protected page and no token, redirect to login
        if (!isPublicPage && !hasToken) {
            return next('/auth/login')
        }

        // Allow navigation
        return next()
    } catch (error) {
        console.error('Auth guard error:', error)
        authStore.logout()
        return next('/auth/login')
    }
} 