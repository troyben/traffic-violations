import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/auth/login'
    },
    {
        path: '/',
        component: () => import('../layouts/DefaultLayout.vue'),
        children: [
            {
                path: 'dashboard',
                component: () => import('../views/Dashboard.vue')
            },
            {
                path: 'profile',
                component: () => import('../views/Profile.vue')
            }
        ]
    },
    {
        path: '/auth',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                name: 'Login',
                component: () => import('../views/auth/Login.vue')
            },
            {
                path: 'register',
                name: 'Register',
                component: () => import('../views/auth/Register.vue')
            },
            {
                path: 'forgot-password',
                name: 'ForgotPassword',
                component: () => import('../views/auth/ForgotPassword.vue')
            },
            {
                path: 'reset-password',
                name: 'ResetPassword',
                component: () => import('../views/auth/ResetPassword.vue')
            }
        ]
    },
    {
        path: '/onboarding',
        component: DefaultLayout,
        children: [
            {
                path: 'add-vehicles',
                name: 'AddVehicles',
                component: () => import('../views/onboarding/AddVehicles.vue')
            }
        ]
    },
    {
        path: '/payment',
        component: () => import('../views/Payment.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
