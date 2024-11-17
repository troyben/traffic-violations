<template>
    <div class="w-[500px] px-4">
        <n-card class="w-full" :content-style="{ padding: '40px 35px' }">
            <h1 class="text-2xl font-medium text-center mb-10">Register</h1>

            <n-form :model="formData" @submit.prevent="handleSubmit">
                <div class="relative mb-4">
                    <label class="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                        Name
                    </label>
                    <n-input v-model:value="formData.name" size="large" placeholder="Enter your full name" />
                </div>

                <div class="relative mb-4">
                    <label class="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                        Email
                    </label>
                    <n-input v-model:value="formData.email" type="text" inputmode="email" size="large"
                        placeholder="Enter your email" />
                </div>

                <div class="relative mb-4">
                    <label class="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                        Password
                    </label>
                    <n-input v-model:value="formData.password" type="password" size="large"
                        placeholder="Create a password" />
                </div>

                <div class="relative mb-4">
                    <label class="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                        Confirm Password
                    </label>
                    <n-input v-model:value="formData.confirmPassword" type="password" size="large"
                        placeholder="Confirm your password" />
                </div>

                <div class="mb-4">
                    <n-checkbox v-model:checked="formData.acceptTerms">
                        I accept the
                        <n-button text type="primary" @click="showTermsModal = true">
                            Terms and Conditions
                        </n-button>
                    </n-checkbox>
                </div>

                <n-button type="primary" block size="large" :style="{
                    backgroundColor: '#F4B183',
                    borderRadius: '50px',
                }" :hover-style="{
                    backgroundColor: '#f3a46d',
                }" :focusable="false" class="login-button" @click="handleSubmit" :disabled="!formData.acceptTerms">
                    <span class="w-full text-center">Register</span>
                </n-button>
            </n-form>

            <div class="mt-6 text-center">
                <p class="text-gray-400 text-sm">
                    Already have an account?
                    <router-link to="/auth/login" class="text-[#F4B183] hover:underline">
                        Login Now
                    </router-link>
                </p>
            </div>
        </n-card>

        <n-modal v-model:show="showTermsModal" preset="card" style="width: 600px" title="Terms and Conditions">
            <div class="terms-content">
                <h3 class="text-lg font-medium mb-4">Terms and Conditions</h3>
                <div class="text-gray-600 mb-4">
                    <p class="mb-2">Welcome to our service. By using our platform, you agree to these terms:</p>
                    <ul class="list-disc pl-6 space-y-2">
                        <li>Your account information must be accurate and up to date</li>
                        <li>You are responsible for maintaining the security of your account</li>
                        <li>You agree to use the service in compliance with all applicable laws</li>
                        <li>We reserve the right to modify or terminate the service at any time</li>
                    </ul>
                </div>
            </div>
            <template #footer>
                <div class="flex justify-end">
                    <n-button type="primary" @click="acceptTerms">Accept</n-button>
                </div>
            </template>
        </n-modal>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { NCard, NForm, NInput, NButton, NCheckbox, NModal } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useNotification } from '../../composables/useNotification'

const router = useRouter()
const showTermsModal = ref(false)
const { showSuccess } = useNotification()

const formData = ref({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
})

const acceptTerms = () => {
    formData.value.acceptTerms = true
    showTermsModal.value = false
}

const handleSubmit = () => {
    if (formData.value.acceptTerms) {
        showSuccess('Your account has been created', 'Registration Success')
        router.push('/onboarding/add-vehicles')
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