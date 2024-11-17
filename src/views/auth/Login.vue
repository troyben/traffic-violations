<template>
    <div class="w-[500px] px-4">
        <n-card class="w-full" :content-style="{ padding: '40px 35px' }">
            <h1 class="text-2xl font-medium text-center mb-10">Login</h1>

            <n-form :model="formData" @submit.prevent="handleSubmit">
                <div class="relative mb-4">
                    <label class="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                        Email
                    </label>
                    <n-input v-model:value="formData.email" type="text" inputmode="email" size="large"
                        placeholder="Enter your email address" :style="{ '--n-padding-vertical': '12px' }" />
                </div>

                <div class="relative mb-4">
                    <label class="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                        Password
                    </label>
                    <n-input v-model:value="formData.password" type="password" size="large"
                        placeholder="Enter your password" :style="{ '--n-padding-vertical': '12px' }" />
                </div>

                <n-button type="primary" block size="large" :style="{
                    backgroundColor: '#F4B183',
                    borderRadius: '50px',
                }" :hover-style="{
                    backgroundColor: '#f3a46d',
                }" :focusable="false" class="login-button" @click="handleSubmit">
                    <span class="w-full text-center">Login</span>
                </n-button>
            </n-form>

            <div class="mt-6 text-center">
                <p class="text-gray-400 text-sm mb-2">
                    Don't have an account?
                    <router-link to="/auth/register" class="text-[#F4B183] hover:underline">
                        Register Now
                    </router-link>
                </p>
                <p class="text-gray-400 text-sm">
                    Have you forgotten your password?
                    <router-link to="/auth/forgot-password" class="text-[#F4B183] hover:underline">
                        Reset Password
                    </router-link>
                </p>
            </div>
        </n-card>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { NCard, NForm, NInput, NButton } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
    email: '',
    password: ''
})

const handleSubmit = () => {
    router.push('/dashboard')
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
</style>