<template>
    <div class="w-[500px] px-4">
        <n-card class="w-full" :content-style="{ padding: '40px 35px' }">
            <h1 class="mb-10 text-2xl font-medium text-center">Register</h1>

            <n-form :model="formData" @submit.prevent="handleSubmit">
                <div class="relative mb-4">
                    <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white">
                        Name
                    </label>
                    <n-input v-model:value="formData.name" size="large" placeholder="Enter your full name" />
                </div>

                <div class="relative mb-4">
                    <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white">
                        Email
                    </label>
                    <n-input v-model:value="formData.email" type="text" inputmode="email" size="large"
                        placeholder="Enter your email" />
                </div>

                <div class="relative mb-4">
                    <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white">
                        Mobile Number
                    </label>
                    <n-input v-model:value="formData.mobile" type="tel" size="large"
                        placeholder="Enter your mobile number (e.g., 0771234567)" />
                </div>

                <div class="relative mb-4">
                    <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white">
                        Password
                    </label>
                    <n-input v-model:value="formData.password" type="password" size="large"
                        placeholder="Create a password" />
                </div>

                <div class="relative mb-4">
                    <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white">
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

                <n-button type="primary" block size="large" 
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
                    :disabled="!formData.acceptTerms || loading"
                    :loading="loading">
                    <span class="w-full text-center">{{ loading ? 'Registering...' : 'Register' }}</span>
                </n-button>
            </n-form>

            <div class="mt-6 text-center">
                <p class="text-sm text-gray-400">
                    Already have an account?
                    <router-link to="/auth/login" class="text-[#F4B183] hover:underline">
                        Login Now
                    </router-link>
                </p>
            </div>
        </n-card>

        <n-modal v-model:show="showTermsModal" preset="card" style="width: 600px" title="Terms and Conditions">
            <div class="terms-content">
                <h3 class="mb-4 text-lg font-medium">Terms and Conditions</h3>
                <div class="mb-4 text-gray-600">
                    <p class="mb-2">Welcome to our service. By using our platform, you agree to these terms:</p>
                    <ul class="pl-6 space-y-2 list-disc">
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
import { authService } from '../../services/auth.service'

const router = useRouter()
const showTermsModal = ref(false)
const { showSuccess, showError } = useNotification()
const loading = ref(false)

const formData = ref({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
})

const acceptTerms = () => {
    formData.value.acceptTerms = true
    showTermsModal.value = false
}

const validateForm = () => {
    if (!formData.value.name.trim()) {
        showError('Please enter your full name')
        return false
    }
    
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (!emailRegex.test(formData.value.email.trim())) {
        showError('Please enter a valid email address')
        return false
    }
    
    // Mobile validation
    const mobileRegex = /^(071|077|073|078)\d{7}$/
    if (!mobileRegex.test(formData.value.mobile)) {
        showError('Please enter a valid mobile number (e.g., 0771234567)')
        return false
    }
    
    if (!formData.value.password) {
        showError('Please enter a password')
        return false
    }
    if (formData.value.password !== formData.value.confirmPassword) {
        showError('Passwords do not match')
        return false
    }
    if (!formData.value.acceptTerms) {
        showError('Please accept the terms and conditions')
        return false
    }
    return true
}

const handleSubmit = async () => {
    if (!validateForm()) return

    try {
        loading.value = true
        const [firstName, ...lastNameParts] = formData.value.name.trim().split(' ')
        const lastName = lastNameParts.join(' ')

        await authService.register({
            firstName,
            lastName,
            email: formData.value.email.trim(),
            mobile: formData.value.mobile,
            password: formData.value.password
        })

        showSuccess('Your account has been created', 'Registration Success')
        router.push('/auth/login')
    } catch (error: any) {
        showError(error.response?.data?.message || 'Registration failed')
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