<template>
    <div class="flex justify-center items-center p-6 h-screen"
        :style="{ backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }">
        <div class="w-full max-w-[500px]">
            <h1 class="mb-4 text-2xl font-medium" :style="{ color: isDark ? '#ffffff' : '#333333' }">Payment</h1>
            <p :style="{ color: isDark ? '#e1e1e1' : '#666666' }" class="mb-6">Select your preferred payment method</p>

            <n-card class="mb-6">
                <div class="mb-4 text-lg" :style="{ color: isDark ? '#ffffff' : '#333333' }">
                    Payment Summary
                </div>
                <div class="flex justify-between items-center" :style="{ color: isDark ? '#e1e1e1' : '#666666' }">
                    <span>Selected Violations</span>
                    <span>{{ selectedCount }}</span>
                </div>
                <div class="flex justify-between items-center text-lg font-medium">
                    <span>Total Amount</span>
                    <span>ZWG {{ amount.toFixed(2) }}</span>
                </div>
            </n-card>

            <n-card>
                <div class="space-y-4">
                    <div class="p-4 rounded-lg border transition-colors cursor-pointer" :class="[
                        paymentMethod === 'card' ? 'border-[#F4B183] bg-[#F4B18310]' : 'border-gray-500',
                        isDark ? 'text-white' : 'text-gray-800'
                    ]" @click="paymentMethod = 'card'">
                        <div class="flex gap-3 items-center">
                            <n-radio :checked="paymentMethod === 'card'" />
                            <span class="font-medium">Pay with Card</span>
                        </div>

                        <div v-if="paymentMethod === 'card'" class="mt-4 space-y-4">
                            <div class="relative">
                                <label class="absolute -top-2 left-3 z-10 px-1 text-sm" :style="{
                                    backgroundColor: isDark ? '#242424' : '#ffffff',
                                    color: isDark ? '#e1e1e1' : '#666666'
                                }">
                                    Card Number
                                </label>
                                <n-input v-model:value="cardDetails.number" size="large" placeholder="Enter card number"
                                    class="modal-input" :style="{ height: '43px' }" />
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="relative">
                                    <label class="absolute -top-2 left-3 z-10 px-1 text-sm" :style="{
                                        backgroundColor: isDark ? '#242424' : '#ffffff',
                                        color: isDark ? '#e1e1e1' : '#666666'
                                    }">
                                        Expiry Date
                                    </label>
                                    <n-input v-model:value="cardDetails.expiry" size="large" placeholder="MM/YY"
                                        class="modal-input" :style="{ height: '43px' }" />
                                </div>
                                <div class="relative">
                                    <label class="absolute -top-2 left-3 z-10 px-1 text-sm" :style="{
                                        backgroundColor: isDark ? '#242424' : '#ffffff',
                                        color: isDark ? '#e1e1e1' : '#666666'
                                    }">
                                        CVV
                                    </label>
                                    <n-input v-model:value="cardDetails.cvv" size="large" placeholder="123"
                                        type="password" class="modal-input" :style="{ height: '43px' }" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="p-4 rounded-lg border transition-colors cursor-pointer"
                        :class="paymentMethod === 'ecocash' ? 'border-[#F4B183] bg-[#F4B18310]' : 'border-gray-200'"
                        @click="paymentMethod = 'ecocash'">
                        <div class="flex gap-3 items-center">
                            <n-radio :checked="paymentMethod === 'ecocash'" />
                            <span class="font-medium">Pay with Ecocash</span>
                        </div>

                        <div v-if="paymentMethod === 'ecocash'" class="mt-4">
                            <div class="relative">
                                <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white">
                                    Phone Number
                                </label>
                                <n-input v-model:value="phoneNumber" size="large" placeholder="Enter phone number"
                                    class="modal-input" :style="{ height: '43px' }" />
                            </div>
                        </div>
                    </div>
                </div>

                <n-button 
                    v-if="!isPaid"
                    type="primary" 
                    block 
                    size="large" 
                    :loading="loading"
                    :style="{
                        backgroundColor: '#F4B183',
                        borderRadius: '50px',
                        color: '#000000'
                    }" 
                    :hover-style="{
                        backgroundColor: '#f3a46d',
                        color: '#000000'
                    }" 
                    class="mt-6 login-button" 
                    :focusable="false" 
                    @click="handlePayment"
                >
                    <span class="w-full text-center">
                        {{ loading ? 'Processing...' : 'Pay Now' }}
                    </span>
                </n-button>
                
                <div v-else class="mt-6 text-center text-red-500">
                    This violation has already been paid
                </div>
            </n-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import { NCard, NButton, NRadio, NInput } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { useNotification } from '../composables/useNotification'
import { paymentService } from '../services/payment.service'
import { violationService, type Violation } from '../services/violation.service'

const router = useRouter()
const route = useRoute()
const amount = ref(Number(route.query.amount) || 0)
const selectedCount = ref(Number(route.query.count) || 0)
const paymentMethod = ref('card')
const phoneNumber = ref('')
const cardDetails = ref({
    number: '',
    expiry: '',
    cvv: ''
})
const isDark = inject('theme-key')
const notification = useNotification()
const loading = ref(false)
const violations = ref<Violation[]>([])
const isPaid = ref(false)

const handlePayment = async () => {
    try {
        loading.value = true

        if (paymentMethod.value === 'card' && 
            (!cardDetails.value.number || !cardDetails.value.expiry || !cardDetails.value.cvv)) {
            notification.showError('Validation Error', 'Please fill in all card details')
            return
        }

        if (paymentMethod.value === 'ecocash' && !phoneNumber.value) {
            notification.showError('Validation Error', 'Please enter your phone number')
            return
        }

        // Get violation IDs from route query
        const violationsParam = route.query.violations
        if (!violationsParam) {
            notification.showError('Error', 'No violations selected for payment')
            return
        }

        // Parse violations (handles both single and multiple violations)
        const violationIds = violationsParam.toString().split(',').map(Number)
        
        console.log('Processing violations:', violationIds)

        // Generate a mock transaction reference
        const transactionReference = `TXN${Date.now()}`

        // Process each violation payment
        for (const violationId of violationIds) {
            await paymentService.createPayment({
                violation_id: violationId,
                payment_method: paymentMethod.value === 'card' ? 'mastercard' : 'ecocash',
                transaction_reference: transactionReference
            })
        }

        notification.showSuccess('Success', 'Payment processed successfully')
        router.push('/dashboard')

    } catch (error: any) {
        notification.showError(
            'Payment Failed',
            error.response?.data?.message || 'Failed to process payment'
        )
    } finally {
        loading.value = false
    }
}

const checkViolationStatus = async () => {
    try {
        const violationsParam = route.query.violations
        if (!violationsParam) return

        const violationIds = violationsParam.toString().split(',').map(Number)
        
        // Fetch violations to check their status
        const response = await violationService.getUserViolations()
        violations.value = response.violations.filter(v => violationIds.includes(v.id))
        
        // Check if any of the selected violations are already paid
        isPaid.value = violations.value.some(v => v.status === 'paid')
        
        if (isPaid.value) {
            notification.showError('Error', 'One or more selected violations are already paid')
            router.push('/dashboard')
        }
    } catch (error) {
        console.error('Error checking violation status:', error)
        notification.showError('Error', 'Failed to verify violation status')
    }
}

onMounted(() => {
    checkViolationStatus()
})
</script>

<style scoped>
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
    color: #000000 !important;
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

.modal-input {
    height: 43px !important;
}

:deep(.n-input-wrapper) {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}

:deep(.n-input__placeholder) {
    line-height: 43px !important;
}

:deep(.n-input__input) {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}

:deep(.n-input) {
    background-color: var(--n-color) !important;
    color: var(--n-text-color) !important;
}

:deep(.n-input__placeholder) {
    color: var(--n-placeholder-color) !important;
}

:deep(.n-radio) {
    --n-text-color: var(--n-text-color) !important;
}
</style>