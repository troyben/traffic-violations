<template>
    <div class="px-4 w-full md:px-0">
        <div class="flex flex-col items-start mb-8 md:flex-row md:gap-6 md:items-center">
            <n-avatar round size="large" :style="{
                background: '#F4B183',
                width: '80px',
                height: '80px',
                fontSize: '28px'
            }">
                {{ userInitials }}
            </n-avatar>
            <div class="mt-4 md:mt-0">
                <h1 class="text-xl font-medium md:text-2xl">Profile Settings</h1>
                <p class="text-gray-600">Manage your account information</p>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <n-card class="h-full">
                <div class="space-y-6 h-full">
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                        <div class="relative">
                            <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white" :style="{
                                backgroundColor: isDark ? '#242424' : '#ffffff',
                                color: isDark ? '#e1e1e1' : '#666666'
                            }">
                                First Name
                            </label>
                            <n-input v-model:value="profileForm.firstName" size="large"
                                placeholder="Enter first name" :style="{ '--n-padding-vertical': '12px' }"
                                class="modal-input" />
                        </div>

                        <div class="relative">
                            <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white" :style="{
                                backgroundColor: isDark ? '#242424' : '#ffffff',
                                color: isDark ? '#e1e1e1' : '#666666'
                            }">
                                Last Name
                            </label>
                            <n-input v-model:value="profileForm.lastName" size="large" placeholder="Enter last name"
                                :style="{ '--n-padding-vertical': '12px' }" class="modal-input" />
                        </div>

                        <div class="relative">
                            <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white" :style="{
                                backgroundColor: isDark ? '#242424' : '#ffffff',
                                color: isDark ? '#e1e1e1' : '#666666'
                            }">
                                Email
                            </label>
                            <n-input v-model:value="profileForm.email" size="large"
                                placeholder="Enter email address" :style="{ '--n-padding-vertical': '12px' }"
                                class="modal-input" />
                        </div>

                        <div class="relative">
                            <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white" :style="{
                                backgroundColor: isDark ? '#242424' : '#ffffff',
                                color: isDark ? '#e1e1e1' : '#666666'
                            }">
                                Phone
                            </label>
                            <n-input v-model:value="profileForm.phone" size="large" placeholder="Enter phone number"
                                :style="{ '--n-padding-vertical': '12px' }" class="modal-input" />
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <n-button type="primary" @click="handleSaveProfile" :style="{
                            backgroundColor: '#F4B183',
                            borderRadius: '50px',
                            color: '#000000'
                        }" :hover-style="{
                            backgroundColor: '#f3a46d',
                            color: '#000000'
                        }" class="px-8 w-full md:w-auto login-button">
                            Save Changes
                        </n-button>
                    </div>
                </div>
            </n-card>

            <n-card class="h-full">
                <div class="space-y-4 h-full">
                    <h2 class="mb-4 text-lg font-medium">Payment Methods</h2>

                    <div class="p-4 rounded-lg border transition-colors cursor-pointer" :class="[
                        paymentMethod === 'card' ? 'border-[#F4B183] bg-[#F4B18310]' : 'border-gray-500',
                        isDark ? 'text-white' : 'text-gray-800'
                    ]" @click="paymentMethod = 'card'">
                        <div class="flex gap-3 items-center">
                            <n-radio :checked="paymentMethod === 'card'" />
                            <span class="font-medium">Card Payment</span>
                        </div>

                        <div v-if="paymentMethod === 'card'" class="mt-4 space-y-4">
                            <div class="relative">
                                <label class="absolute -top-2 left-3 z-10 px-1 text-sm" :style="{
                                    backgroundColor: isDark ? '#242424' : '#ffffff',
                                    color: isDark ? '#e1e1e1' : '#666666'
                                }">
                                    Card Number
                                </label>
                                <n-input v-model:value="paymentForm.cardNumber" size="large"
                                    placeholder="Enter card number" class="modal-input" />
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="relative">
                                    <label class="absolute -top-2 left-3 z-10 px-1 text-sm" :style="{
                                        backgroundColor: isDark ? '#242424' : '#ffffff',
                                        color: isDark ? '#e1e1e1' : '#666666'
                                    }">
                                        Expiry Date
                                    </label>
                                    <n-input v-model:value="paymentForm.expiry" size="large" placeholder="MM/YY"
                                        class="modal-input" />
                                </div>
                                <div class="relative">
                                    <label class="absolute -top-2 left-3 z-10 px-1 text-sm" :style="{
                                        backgroundColor: isDark ? '#242424' : '#ffffff',
                                        color: isDark ? '#e1e1e1' : '#666666'
                                    }">
                                        CVV
                                    </label>
                                    <n-input v-model:value="paymentForm.cvv" size="large" placeholder="123"
                                        type="password" class="modal-input" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="p-4 rounded-lg border transition-colors cursor-pointer" :class="[
                        paymentMethod === 'ecocash' ? 'border-[#F4B183] bg-[#F4B18310]' : 'border-gray-500',
                        isDark ? 'text-white' : 'text-gray-800'
                    ]" @click="paymentMethod = 'ecocash'">
                        <div class="flex gap-3 items-center">
                            <n-radio :checked="paymentMethod === 'ecocash'" />
                            <span class="font-medium">Ecocash</span>
                        </div>

                        <div v-if="paymentMethod === 'ecocash'" class="mt-4">
                            <div class="relative">
                                <label class="absolute -top-2 left-3 z-10 px-1 text-sm" :style="{
                                    backgroundColor: isDark ? '#242424' : '#ffffff',
                                    color: isDark ? '#e1e1e1' : '#666666'
                                }">
                                    Phone Number
                                </label>
                                <n-input v-model:value="paymentForm.phoneNumber" size="large"
                                    placeholder="Enter phone number" class="modal-input" />
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end mt-6">
                        <n-button type="primary" @click="handleSavePayment" :style="{
                            backgroundColor: '#F4B183',
                            borderRadius: '50px',
                            color: '#000000'
                        }" :hover-style="{
                            backgroundColor: '#f3a46d',
                            color: '#000000'
                        }" class="px-8 login-button">
                            Save Payment Method
                        </n-button>
                    </div>
                </div>
            </n-card>
        </div>

        <div class="mt-8">
            <h2 class="mb-4 text-lg font-medium">Manage Vehicles</h2>
            <n-card>
                <div class="space-y-4">
                    <div class="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                        <div class="w-full md:w-[300px]">
                            <div class="relative">
                                <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white" :style="{
                                    backgroundColor: isDark ? '#242424' : '#ffffff',
                                    color: isDark ? '#e1e1e1' : '#666666'
                                }">
                                    Select Vehicle
                                </label>
                                <n-select v-model:value="selectedVehicle" :options="vehicleOptions" 
                                    placeholder="Select vehicle"
                                    class="vehicle-select" size="large" />
                            </div>
                        </div>
                    </div>

                    <div v-if="selectedVehicle" class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                        <div class="relative">
                            <label class="absolute -top-2 left-3 z-10 px-1 text-sm" :style="{
                                backgroundColor: isDark ? '#242424' : '#ffffff',
                                color: isDark ? '#e1e1e1' : '#666666'
                            }">
                                Make
                            </label>
                            <n-input v-model:value="vehicleForm.make" size="large" placeholder="Enter vehicle make"
                                :style="{ '--n-padding-vertical': '12px' }" class="modal-input" />
                        </div>

                        <div class="relative">
                            <label class="absolute -top-2 left-3 z-10 px-1 text-sm" :style="{
                                backgroundColor: isDark ? '#242424' : '#ffffff',
                                color: isDark ? '#e1e1e1' : '#666666'
                            }">
                                Model
                            </label>
                            <n-input v-model:value="vehicleForm.model" size="large" placeholder="Enter vehicle model"
                                :style="{ '--n-padding-vertical': '12px' }" class="modal-input" />
                        </div>

                        <div class="relative">
                            <label class="absolute -top-2 left-3 z-10 px-1 text-sm" :style="{
                                backgroundColor: isDark ? '#242424' : '#ffffff',
                                color: isDark ? '#e1e1e1' : '#666666'
                            }">
                                VRN
                            </label>
                            <n-input v-model:value="vehicleForm.vrn" size="large" placeholder="Enter vehicle registration number"
                                :style="{ '--n-padding-vertical': '12px' }" class="modal-input" />
                        </div>
                    </div>

                    <div class="flex flex-col gap-4 justify-end mt-4 md:flex-row">
                        <n-button v-if="selectedVehicle" type="error" @click="handleDeleteVehicle" 
                            :style="{ borderRadius: '50px' }" 
                            class="px-8 w-full md:w-auto">
                            Delete Vehicle
                        </n-button>
                        
                        <n-button type="primary" @click="handleUpdateVehicle" :style="{
                            backgroundColor: '#F4B183',
                            borderRadius: '50px',
                            color: '#000000'
                        }" :hover-style="{
                            backgroundColor: '#f3a46d',
                            color: '#000000'
                        }" class="px-8 w-full md:w-auto login-button">
                            Update Vehicle
                        </n-button>
                    </div>
                </div>
            </n-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, watch, onMounted, computed } from 'vue'
import { NCard, NButton, NInput, NAvatar, NRadio, NSelect } from 'naive-ui'
import { useNotification } from '../composables/useNotification'
import { useAuthStore } from '../stores/auth'
import { authService } from '../services/auth.service'
import { vehicleService, type Vehicle } from '../services/vehicle.service'

const isDark = inject('theme-key')
const { showSuccess } = useNotification()
const authStore = useAuthStore()
const notification = useNotification()

const userInitials = computed(() => {
    if (authStore.user?.firstName && authStore.user?.lastName) {
        return `${authStore.user.firstName[0]}${authStore.user.lastName[0]}`
    }
    return ''
})

const profileForm = ref({
    firstName: authStore.user?.firstName || '',
    lastName: authStore.user?.lastName || '',
    email: authStore.user?.email || '',
    phone: authStore.user?.mobile || ''
})

const paymentMethod = ref('card')
const paymentForm = ref({
    cardNumber: '',
    expiry: '',
    cvv: '',
    phoneNumber: ''
})

const vehicles = ref<Vehicle[]>([])
const vehicleOptions = ref<{ label: string; value: number }[]>([])
const selectedVehicle = ref('')
const vehicleForm = ref({
    make: '',
    model: '',
    vrn: ''
})

const loadVehicles = async () => {
    try {
        const response = await vehicleService.getVehicles()
        vehicles.value = response.vehicles
        vehicleOptions.value = vehicles.value.map(vehicle => ({
            label: `${vehicle.make} ${vehicle.model} - ${vehicle.vrn}`,
            value: vehicle.id
        }))
    } catch (error: any) {
        notification.showError('Error', 'Failed to load vehicles')
    }
}

watch(selectedVehicle, (newValue) => {
    if (newValue) {
        const vehicle = vehicles.value.find(v => v.id === newValue)
        if (vehicle) {
            vehicleForm.value = {
                make: vehicle.make,
                model: vehicle.model,
                vrn: vehicle.vrn
            }
        }
    }
})

const handleSaveProfile = async () => {
    try {
        const response = await authService.updateProfile({
            firstName: profileForm.value.firstName,
            lastName: profileForm.value.lastName,
            email: profileForm.value.email
        })

        if (profileForm.value.phone) {
            await authService.updateMobile({
                mobile: profileForm.value.phone
            })
        }

        // Update the store with new user data
        authStore.setUser({
            ...authStore.user!,  // Keep existing data
            firstName: profileForm.value.firstName,
            lastName: profileForm.value.lastName,
            email: profileForm.value.email,
            mobile: profileForm.value.phone
        })

        notification.showSuccess('Profile Updated', 'Your profile has been updated successfully')
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to update profile'
        notification.showError('Update Failed', errorMessage)
    }
}

const handleSavePayment = () => {
    showSuccess('Payment Method Updated', 'Your payment method has been saved successfully')
}

const handleUpdateVehicle = async () => {
    try {
        await vehicleService.updateVehicle({
            vehicleId: selectedVehicle.value,
            vrn: vehicleForm.value.vrn,
            make: vehicleForm.value.make,
            model: vehicleForm.value.model
        })
        
        notification.showSuccess('Success', 'Vehicle updated successfully')
        await loadVehicles() // Reload the vehicles list
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to update vehicle'
        notification.showError('Error', errorMessage)
    }
}

const handleDeleteVehicle = async () => {
    if (!selectedVehicle.value) return;

    try {
        await vehicleService.deleteVehicle(selectedVehicle.value)
        notification.showSuccess('Success', 'Vehicle deleted successfully')
        selectedVehicle.value = ''  // Clear selection
        vehicleForm.value = {  // Reset form
            make: '',
            model: '',
            vrn: ''
        }
        await loadVehicles()  // Reload the vehicles list
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to delete vehicle'
        notification.showError('Error', errorMessage)
    }
}

onMounted(() => {
    loadVehicles()
})
</script>

<style scoped>
.n-card {
    display: flex;
    flex-direction: column;
}

.n-card :deep(.n-card__content) {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.space-y-4,
.space-y-6 {
    flex: 1;
}

.vehicle-select :deep(.n-base-selection) {
    height: 43px !important;
}

.vehicle-select :deep(.n-base-selection-input) {
    padding-left: 12px !important;
}

.vehicle-select :deep(.n-base-selection-placeholder) {
    display: flex !important;
    align-items: center !important;
    color: #cccccc !important;
    font-size: 13px !important;
    padding-left: 12px !important;
}

.vehicle-select :deep(.n-base-selection:hover) {
    border-color: #F4B183 !important;
}

.vehicle-select :deep(.n-base-selection--focused) {
    border-color: #F4B183 !important;
    box-shadow: 0 0 0 2px rgba(244, 177, 131, 0.2) !important;
}

/* Add responsive styles */
@media (max-width: 768px) {
    :deep(.n-card) {
        padding: 16px !important;
    }

    :deep(.n-input) {
        height: 40px !important;
    }

    :deep(.n-button) {
        height: 40px !important;
    }
}

/* Keep your existing styles */
:deep(.n-input__input) {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}

:deep(.modal-input) {
    height: 43px !important;
}

/* Add any other existing styles you have */
</style>