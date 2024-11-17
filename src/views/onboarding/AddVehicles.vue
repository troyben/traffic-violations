<template>
    <div class="w-full">
        <h1 class="text-2xl font-medium mb-4">Add Your Vehicles</h1>
        <p class="text-gray-600 mb-6">Add all the vehicles you want to manage in the system.</p>

        <div class="space-y-4">
            <n-card v-for="(vehicle, index) in vehicles" :key="index" class="w-full">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium">Vehicle {{ index + 1 }}</h3>
                    <n-button circle type="error" @click="removeVehicle(index)">
                        <template #icon>
                            <n-icon>
                                <close />
                            </n-icon>
                        </template>
                    </n-button>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="relative">
                        <label class="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                            Make
                        </label>
                        <n-input v-model:value="vehicle.make" size="large" placeholder="Enter vehicle make"
                            :style="{ '--n-padding-vertical': '12px' }" />
                    </div>

                    <div class="relative">
                        <label class="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                            Model
                        </label>
                        <n-input v-model:value="vehicle.model" size="large" placeholder="Enter vehicle model"
                            :style="{ '--n-padding-vertical': '12px' }" />
                    </div>

                    <div class="relative">
                        <label class="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                            Color
                        </label>
                        <n-input v-model:value="vehicle.color" size="large" placeholder="Enter vehicle color"
                            :style="{ '--n-padding-vertical': '12px' }" />
                    </div>

                    <div class="relative">
                        <label class="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                            VRN
                        </label>
                        <n-input v-model:value="vehicle.vrn" size="large"
                            placeholder="Enter vehicle registration number"
                            :style="{ '--n-padding-vertical': '12px' }" />
                    </div>
                </div>
            </n-card>
        </div>

        <div class="flex justify-between mt-6">
            <n-button type="default" @click="addVehicle" class="px-8" style="color: #666666">
                Add Another Vehicle
            </n-button>

            <n-button type="primary" :style="{
                backgroundColor: '#F4B183',
                borderRadius: '50px',
            }" :hover-style="{
                backgroundColor: '#f3a46d',
            }" @click="handleSubmit" class="px-8 login-button">
                Continue to Dashboard
            </n-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NButton, NInput, NIcon } from 'naive-ui'
import { Close } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import { useNotification } from '../../composables/useNotification'

const router = useRouter()
const { showSuccess } = useNotification()

interface Vehicle {
    make: string
    model: string
    color: string
    vrn: string
}

const vehicles = ref<Vehicle[]>([{
    make: '',
    model: '',
    color: '',
    vrn: ''
}])

const addVehicle = () => {
    vehicles.value.push({
        make: '',
        model: '',
        color: '',
        vrn: ''
    })
}

const removeVehicle = (index: number) => {
    if (vehicles.value.length > 1) {
        vehicles.value.splice(index, 1)
    }
}

const handleSubmit = () => {
    showSuccess('Vehicles Added', 'Your vehicles have been added to your account')
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