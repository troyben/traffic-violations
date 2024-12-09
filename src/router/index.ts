import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import { authGuard } from './middleware'
import { useAuthStore } from '../stores/auth'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/',
        name: 'default',
        component: () => import('../layouts/DefaultLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: () => import('../views/Dashboard.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'profile',
                name: 'profile',
                component: () => import('../views/Profile.vue'),
                meta: { requiresAuth: true }
            }
        ]
    },
    {
        path: '/auth',
        component: AuthLayout,
        meta: { requiresAuth: false },
        children: [
            {
                path: 'login',
                name: 'Login',
                component: () => import('../views/auth/Login.vue'),
                meta: { requiresAuth: false }
            },
            {
                path: 'register',
                name: 'Register',
                component: () => import('../views/auth/Register.vue'),
                meta: { requiresAuth: false }
            },
            {
                path: 'forgot-password',
                name: 'ForgotPassword',
                component: () => import('../views/auth/ForgotPassword.vue'),
                meta: { requiresAuth: false }
            },
            {
                path: 'reset-password',
                name: 'ResetPassword',
                component: () => import('../views/auth/ResetPassword.vue'),
                meta: { requiresAuth: false }
            }
        ]
    },
    {
        path: '/onboarding',
        component: DefaultLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: 'add-vehicles',
                name: 'AddVehicles',
                component: () => import('../views/onboarding/AddVehicles.vue'),
                meta: { requiresAuth: true }
            }
        ]
    },
    {
        path: '/payment',
        component: () => import('../views/Payment.vue'),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

const ALLOWED_FRONTEND_ROLES = ['user', 'admin']

router.beforeEach(async (to, from, next) => {
    try {
        // Check meta requirements
        const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
        const authStore = useAuthStore()
        
        // If route requires auth and no tokens are present, redirect to login
        if (requiresAuth && (!authStore.token || !localStorage.getItem('refreshToken'))) {
            authStore.logout() // Clear any remaining state
            return next('/auth/login')
        }

        // Check user role if authenticated
        if (authStore.user && !ALLOWED_FRONTEND_ROLES.includes(authStore.user.role)) {
            authStore.logout()
            return next('/auth/login')
        }

        await authGuard(to, from, next)
    } catch (error) {
        console.error('Navigation error:', error)
        const authStore = useAuthStore()
        authStore.logout()
        // Prevent infinite redirects
        if (to.path !== '/auth/login') {
            next('/auth/login')
        } else {
            next()
        }
    }
})

export default router
