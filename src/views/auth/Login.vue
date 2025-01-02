<template>
    <div class="w-[500px] px-4">
        <n-card class="w-full" :content-style="{ padding: '40px 35px' }">
            <h1 class="text-3xl font-bold text-center font-small">R238121C</h1>
            <h1 class="mb-10 text-center text-1xl font-small">Login</h1>

            <n-form :model="formData" @submit.prevent="handleSubmit">
                <div class="relative mb-4">
                    <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white">
                        Email
                    </label>
                    <n-input v-model:value="formData.email" type="text" inputmode="email" size="large"
                        placeholder="Enter your email address" :style="{ '--n-padding-vertical': '12px' }" />
                </div>

                <div class="relative mb-4">
                    <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white">
                        Password
                    </label>
                    <n-input v-model:value="formData.password" type="password" size="large"
                        placeholder="Enter your password" :style="{ '--n-padding-vertical': '12px' }" />
                </div>

                <n-button 
                    type="primary" 
                    block 
                    size="large" 
                    :loading="loading"
                    :style="{
                        backgroundColor: '#F4B183',
                        borderRadius: '50px',
                    }" 
                    :hover-style="{
                        backgroundColor: '#f3a46d',
                    }" 
                    :focusable="false" 
                    class="login-button" 
                    @click="handleSubmit"
                >
                    <span class="w-full text-center">
                        {{ loading ? 'Logging in...' : 'Login' }}
                    </span>
                </n-button>
            </n-form>

            <div class="mt-6 text-center">
                <p class="mb-2 text-sm text-gray-400">
                    Don't have an account?
                    <router-link to="/auth/register" class="text-[#F4B183] hover:underline">
                        Register Now
                    </router-link>
                </p>
                <p class="text-sm text-gray-400">
                    Have you forgotten your password?
                    <router-link to="/auth/forgot-password" class="text-[#F4B183] hover:underline">
                        Reset Password
                    </router-link>
                </p>
            </div>
        </n-card>
    </div>
    <p class="absolute bottom-20 mt-10 ml-10 text-center text-1xl left-50 font-small">Smart Traffic Violation Detection and Penalty System</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { NCard, NForm, NInput, NButton } from 'naive-ui'
import { useAuthStore } from '../../stores/auth'
import { useNotification } from '../../composables/useNotification'
import { useRouter } from 'vue-router'
import { authService } from '../../services/auth.service'

const authStore = useAuthStore()
const notification = useNotification()
const router = useRouter()
const loading = ref(false)

const formData = ref({
    email: '',
    password: ''
})

const handleSubmit = async () => {
    loading.value = true
    try {
        const response = await authService.login(formData.value)
        authStore.setToken(response.token)
        authStore.setUser({
            id: response.user.id,
            email: response.user.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            mobile: response.user.mobile,
            role: response.user.role
        })
        router.push('/dashboard')
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Invalid email or password'
        notification.showError('Login Failed', errorMessage)
    } finally {
        loading.value = false
    }
}
</script>

<style>
.login-button .n-button__border {
    display: none !important;
}

.login-button .n-button__state-border {
    display: none !important;
}

.login-button .n-button__content {
    display: flex !important;
    justify-content: center !important;
    width: 100% !important;
}

.floating-label {
    position: absolute;
    left: 12px;
    top: -10px;
    font-size: 14px;
    padding: 0 4px;
    background: white;
    color: #666;
}

.n-input {
    padding-left: 12px !important;
}

.n-input__prefix {
    margin-left: 0 !important;
    margin-right: 0 !important;
}

.n-input__placeholder {
    display: flex !important;
    align-items: center !important;
    color: #cccccc !important;
    font-size: 13px !important;
}

.n-input__input {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}

.n-input:hover {
    border-color: #F4B183 !important;
}

.n-input:focus-within {
    border-color: #F4B183 !important;
    box-shadow: 0 0 0 2px rgba(244, 177, 131, 0.2) !important;
}

.login-button {
    --disabled-bg: #f4b18380;
    --disabled-text: #000000;
}

.login-button:disabled {
    background-color: var(--disabled-bg) !important;
    color: var(--disabled-text) !important;
    cursor: not-allowed;
}
</style>