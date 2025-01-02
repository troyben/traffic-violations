<template>
    <div class="w-[500px] px-4">
        <n-card class="w-full" :content-style="{ padding: '40px 35px' }">
            <h1 class="mb-2 text-3xl font-bold text-center font-small">R238121C</h1>
            <h1 class="mb-10 text-center text-1xl font-small">Reset Password</h1>

            <n-form :model="formData" @submit.prevent="handleSubmit">
                <div class="relative mb-4">
                    <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white">
                        New Password
                    </label>
                    <n-input v-model:value="formData.password" type="password" size="large"
                        placeholder="Enter your new password" />
                </div>

                <div class="relative mb-4">
                    <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white">
                        Confirm Password
                    </label>
                    <n-input v-model:value="formData.confirmPassword" type="password" size="large"
                        placeholder="Confirm your new password" />
                </div>

                <n-button type="primary" block size="large" :style="{
                    backgroundColor: '#F4B183',
                    borderRadius: '50px',
                }" :hover-style="{
                    backgroundColor: '#f3a46d',
                }" :focusable="false" class="login-button" @click="handleSubmit">
                    <span class="w-full text-center">Reset Password</span>
                </n-button>
            </n-form>

            <div class="mt-6 text-center">
                <p class="text-sm text-gray-400">
                    Remember your password?
                    <router-link to="/auth/login" class="text-[#F4B183] hover:underline">
                        Login Now
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
    password: '',
    confirmPassword: ''
})

const handleSubmit = () => {
    router.push('/auth/login')
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