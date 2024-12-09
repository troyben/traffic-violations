<template>
    <n-layout has-sider>
        <!-- Left Sidebar -->
        <n-layout-sider bordered :width="240" :collapsed-width="64" :collapsed="collapsed" collapse-mode="width"
            show-trigger @collapse="collapsed = true" @expand="collapsed = false" class="h-screen">
            <div class="flex justify-center p-4">
                <h2 class="text-lg font-medium" v-if="!collapsed">Dashboard</h2>
                <n-icon size="24" v-else>
                    <dashboard-outlined />
                </n-icon>
            </div>
            <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions"
                :indent="16" default-value="dashboard" @update:value="handleMenuClick" />
        </n-layout-sider>

        <!-- Right Side Content -->
        <n-layout class="h-screen">
            <!-- Top Navigation -->
            <n-layout-header bordered class="flex justify-end items-center px-4 w-full h-16">
                <n-button quaternary circle class="mr-2 theme-toggle" @click="toggleTheme">
                    <n-icon size="18" :color="isDark ? '#fff' : '#333'">
                        <sunny v-if="isDark" />
                        <moon v-else />
                    </n-icon>
                </n-button>
                <n-dropdown :options="userOptions" trigger="click" @select="handleUserAction">
                    <div
                        class="flex gap-2 items-center px-3 py-2 rounded-full cursor-pointer hover:bg-opacity-10 hover:bg-gray-500">
                        <n-avatar round size="small" :style="{ background: '#F4B183' }">
                            {{ userInitials }}
                        </n-avatar>
                        <span class="text-sm" :style="{ color: isDark ? '#ffffff' : '#333333' }">
                            {{ userFullName }}
                        </span>
                        <n-icon size="tiny" :color="isDark ? '#ffffff' : '#333333'">
                            <chevron-down />
                        </n-icon>
                    </div>
                </n-dropdown>
            </n-layout-header>

            <!-- Main Content Area -->
            <n-layout-content class="p-6 w-full h-[calc(100vh-64px)] overflow-y-auto" :style="{
                backgroundColor: isDark ? '#1a1a1a' : '#F5F5F5'
            }">
                <router-view></router-view>
            </n-layout-content>
        </n-layout>
    </n-layout>

    <!-- Add Vehicle Modal -->
    <n-modal v-model:show="showAddVehicleModal" preset="card" style="width: 600px" 
        :title="isEditMode ? 'Edit Vehicle' : 'Add Vehicle'">
        <div>
            <div class="grid grid-cols-2 gap-6">
                <div class="relative">
                    <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white">
                        Make
                    </label>
                    <n-input v-model:value="vehicleForm.make" size="large" placeholder="Enter vehicle make"
                        class="modal-input" />
                </div>

                <div class="relative">
                    <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white">
                        Model
                    </label>
                    <n-input v-model:value="vehicleForm.model" size="large" placeholder="Enter vehicle model"
                        class="modal-input" />
                </div>

                <div class="relative">
                    <label class="absolute -top-2 left-3 z-10 px-1 text-sm text-gray-600 bg-white">
                        VRN
                    </label>
                    <n-input v-model:value="vehicleForm.vrn" size="large"
                        placeholder="Enter vehicle registration number" class="modal-input" />
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex gap-4 justify-end px-2">
                <n-button size="large" class="px-8 py-2" style="color: #666666" @click="showAddVehicleModal = false">
                    Cancel
                </n-button>
                <n-button type="primary" size="large" :style="{
                    backgroundColor: '#F4B183',
                    borderRadius: '50px',
                }" :hover-style="{
                    backgroundColor: '#f3a46d',
                }" class="px-8 py-2 login-button" @click="saveVehicle">
                    <span class="w-full text-center">{{ isEditMode ? 'Update Vehicle' : 'Save Vehicle' }}</span>
                </n-button>
            </div>
        </template>
    </n-modal>

    <!-- Add Dispute Modal -->
    <n-modal v-model:show="showDisputeModal" preset="card" style="width: 600px" title="Dispute Violation">
        <div class="space-y-6">
            <div class="relative">
                <label class="absolute -top-2 left-3 z-10 px-1 text-sm" :style="{
                    backgroundColor: isDark ? '#242424' : '#ffffff',
                    color: isDark ? '#e1e1e1' : '#666666'
                }">
                    Select Violation <span class="text-red-500">*</span>
                </label>
                <n-select v-model:value="disputeForm.reference" :options="unpaidViolations" filterable
                    placeholder="Search and select violation" size="large" :style="{ '--n-padding-vertical': '12px' }"
                    class="modal-input" />
            </div>

            <div class="relative">
                <label class="absolute -top-2 left-3 z-10 px-1 text-sm" :style="{
                    backgroundColor: isDark ? '#242424' : '#ffffff',
                    color: isDark ? '#e1e1e1' : '#666666'
                }">
                    Reason for Dispute <span class="text-red-500">*</span>
                </label>
                <n-input v-model:value="disputeForm.reason" type="textarea" size="large"
                    placeholder="Enter your reason for dispute" :rows="4" :autosize="{
                        minRows: 4,
                        maxRows: 8
                    }" :style="{
                        '--n-padding-vertical': '12px',
                        minHeight: '120px'
                    }" class="modal-input" />
            </div>

            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">
                    <span class="text-red-500">*</span> Required fields
                </span>
                <n-button type="primary" @click="handleDispute" :style="{
                    backgroundColor: '#F4B183',
                    borderRadius: '50px',
                    color: '#000000'
                }" :hover-style="{
                    backgroundColor: '#f3a46d',
                    color: '#000000'
                }" class="px-8 login-button">
                    Submit Dispute
                </n-button>
            </div>
        </div>
    </n-modal>

    <!-- Add Violation Type Modal -->
    <n-modal v-model:show="showAddViolationTypeModal" preset="card" style="width: 600px" title="Add Violation Type">
        <div class="space-y-6">
            <div class="relative">
                <label class="absolute -top-2 left-3 z-10 px-1 text-sm" :style="{
                    backgroundColor: isDark ? '#242424' : '#ffffff',
                    color: isDark ? '#e1e1e1' : '#666666'
                }">
                    Violation Type Name <span class="text-red-500">*</span>
                </label>
                <n-input v-model:value="violationTypeForm.name" type="text" size="large"
                    placeholder="Enter violation type name" class="modal-input" />
            </div>

            <div class="relative">
                <label class="absolute -top-2 left-3 z-10 px-1 text-sm" :style="{
                    backgroundColor: isDark ? '#242424' : '#ffffff',
                    color: isDark ? '#e1e1e1' : '#666666'
                }">
                    Penalty Fee <span class="text-red-500">*</span>
                </label>
                <n-input-number v-model:value="violationTypeForm.penaltyFee" size="large"
                    placeholder="Enter penalty fee amount" class="modal-input"
                    :min="0" :precision="2" />
            </div>

            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">
                    <span class="text-red-500">*</span> Required fields
                </span>
                <div class="flex gap-2">
                    <n-button @click="showAddViolationTypeModal = false">
                        Cancel
                    </n-button>
                    <n-button type="primary" @click="handleAddViolationType" :loading="violationTypeLoading"
                        :style="{
                            backgroundColor: '#F4B183',
                            borderRadius: '50px',
                        }" :hover-style="{
                            backgroundColor: '#f3a46d',
                        }" class="px-8 login-button">
                        Add Type
                    </n-button>
                </div>
            </div>
        </div>
    </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, h, inject, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import {
    NLayout,
    NLayoutSider,
    NLayoutHeader,
    NLayoutContent,
    NMenu,
    NDropdown,
    NAvatar,
    NIcon,
    NModal,
    NButton,
    NInput,
    NSelect,
    NInputNumber
} from 'naive-ui'
import { DashboardOutlined, CarOutlined, LogoutOutlined, UserOutlined } from '@vicons/antd'
import { ChevronDown, Sunny, Moon, AlertCircle } from '@vicons/ionicons5'
import { useNotification } from '../composables/useNotification'
import { useAuthStore } from '../stores/auth'
import { vehicleService } from '../services/vehicle.service'
import { disputeService } from '../services/dispute.service'
import { violationService } from '../services/violation.service'
import { violationTypeService } from '../services/violationType.service'

const router = useRouter()
const authStore = useAuthStore()
const userInitials = computed(() => {
    if (authStore.user?.firstName && authStore.user?.lastName) {
        return `${authStore.user.firstName[0]}${authStore.user.lastName[0]}`
    }
    return ''
})

const userFullName = computed(() => {
    if (authStore.user?.firstName && authStore.user?.lastName) {
        return `${authStore.user.firstName} ${authStore.user.lastName}`
    }
    return ''
})

const menuOptions = [
    {
        label: 'Dashboard',
        key: 'dashboard',
        icon: renderIcon(DashboardOutlined),
        defaultSelected: true
    }
]

const userOptions = computed(() => {
    const baseOptions = [
        {
            label: 'Profile',
            key: 'profile',
            icon: renderIcon(UserOutlined)
        }
    ]

    if (authStore.isAdmin) {
        baseOptions.push({
            label: 'Add Violation Type',
            key: 'add-violation-type',
            icon: renderIcon(AlertCircle)
        })
    } else {
        baseOptions.push(
            {
                label: 'Add Vehicle',
                key: 'add-vehicle',
                icon: renderIcon(CarOutlined)
            },
            {
                label: 'Dispute Violation',
                key: 'dispute',
                icon: renderIcon(AlertCircle)
            }
        )
    }

    baseOptions.push({
        label: 'Logout',
        key: 'logout',
        icon: renderIcon(LogoutOutlined)
    })

    return baseOptions
})

function renderIcon(icon: any) {
    return () => h(NIcon, null, { default: () => h(icon) })
}

const notification = useNotification()

const handleUserAction = async (key: string) => {
    if (key === 'logout') {
        authStore.logout()
    } else if (key === 'add-vehicle') {
        showAddVehicleModal.value = true
    } else if (key === 'add-violation-type') {
        showAddViolationTypeModal.value = true
    } else if (key === 'dispute') {
        await fetchUnpaidViolations()
        if (unpaidViolations.value.length > 0) {
            showDisputeModal.value = true
        }
    } else if (key === 'profile') {
        router.push('/profile')
    }
}

const collapsed = ref(false)

const showAddVehicleModal = ref(false)

interface VehicleForm {
    id?: number
    make: string
    model: string
    vrn: string
}

const vehicleForm = ref<VehicleForm>({
    make: '',
    model: '',
    vrn: ''
})

const { showSuccess } = useNotification()

const saveVehicle = async () => {
    try {
        if (!vehicleForm.value.make || !vehicleForm.value.model || !vehicleForm.value.vrn) {
            notification.showError('Validation Error', 'Please fill in all required fields')
            return
        }

        await vehicleService.addVehicle({
            make: vehicleForm.value.make,
            model: vehicleForm.value.model,
            vrn: vehicleForm.value.vrn.toUpperCase()
        })

        showSuccess('Success', 'Vehicle added successfully')
        
        vehicleForm.value = {
            make: '',
            model: '',
            vrn: ''
        }
        
        showAddVehicleModal.value = false
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to add vehicle'
        notification.showError('Error', errorMessage)
    }
}

const isDark = inject<Ref<boolean>>('theme-key')!

const toggleTheme = () => {
    isDark.value = !isDark.value
}

const showDisputeModal = ref(false)
const disputeForm = ref({
    reference: '',
    reason: ''
})

interface ViolationOption {
    label: string;
    value: number;
}

const unpaidViolations = ref<ViolationOption[]>([]);

const fetchUnpaidViolations = async () => {
    try {
        const response = await violationService.getUserViolations()
        unpaidViolations.value = response.violations
            .filter(v => v.status.toLowerCase() === 'pending')
            .map(v => ({
                label: `#${v.id} - ${v.vehicle.vrn} - ${v.violation_type.name} - ${new Date(v.violation_date).toLocaleDateString()}`,
                value: v.id
            }))

        if (unpaidViolations.value.length === 0) {
            notification.showWarning(
                'No Violations',
                'You have no pending violations to dispute'
            )
            showDisputeModal.value = false
        }
    } catch (error) {
        console.error('Error fetching violations:', error)
        notification.showError(
            'Error',
            'Failed to fetch violations for dispute'
        )
    }
}

const submitDispute = async () => {
    try {
        console.log('Submitting dispute...')
        await disputeService.createDispute({
            violation_id: disputeForm.reference,
            reason: disputeForm.reason
        })
        
        notification.showSuccess(
            'Success',
            'Dispute submitted successfully'
        )
        
        // Reset form
        disputeForm.reference = null
        disputeForm.reason = ''
        showDisputeModal.value = false
        
        console.log('Refreshing dashboard...')
        // Force a dashboard refresh
        if (router.currentRoute.value.name === 'dashboard') {
            await router.replace({
                name: 'dashboard',
                query: { refresh: Date.now().toString() }
            })
        }
        
    } catch (error: any) {
        console.error('Error submitting dispute:', error)
        notification.showError(
            'Error',
            error.response?.data?.message || 'Failed to submit dispute'
        )
    }
}

const handleDispute = async () => {
    try {
        if (!disputeForm.value.reference) {
            notification.showError('Validation Error', 'Please select a violation to dispute')
            return
        }

        if (!disputeForm.value.reason?.trim()) {
            notification.showError('Validation Error', 'Please provide a reason for your dispute')
            return
        }

        await disputeService.createDispute(
            disputeForm.value.reference,
            disputeForm.value.reason.trim()
        )

        notification.showSuccess('Success', 'Your dispute has been submitted successfully')
        
        disputeForm.value = {
            reference: '',
            reason: ''
        }
        showDisputeModal.value = false
    } catch (error: any) {
        notification.showError(
            'Error',
            error.response?.data?.message || 'Failed to submit dispute'
        )
    }
}

const handleMenuClick = (key: string) => {
    if (key === 'dashboard') {
        router.push('/dashboard')
    }
}

const showAddViolationTypeModal = ref(false)
const violationTypeLoading = ref(false)
const violationTypeForm = ref({
    name: '',
    penaltyFee: 0
})

const handleAddViolationType = async () => {
    try {
        if (!violationTypeForm.value.name?.trim()) {
            notification.showError('Validation Error', 'Please enter a violation type name')
            return
        }

        if (!violationTypeForm.value.penaltyFee || violationTypeForm.value.penaltyFee <= 0) {
            notification.showError('Validation Error', 'Please enter a valid penalty fee amount')
            return
        }

        violationTypeLoading.value = true
        await violationTypeService.addViolationType({
            name: violationTypeForm.value.name.trim(),
            penaltyFee: violationTypeForm.value.penaltyFee
        })

        notification.showSuccess('Success', 'Violation type added successfully')
        
        // Reset form
        violationTypeForm.value = {
            name: '',
            penaltyFee: 0
        }
        showAddViolationTypeModal.value = false

    } catch (error: any) {
        notification.showError(
            'Error',
            error.response?.data?.message || 'Failed to add violation type'
        )
    } finally {
        violationTypeLoading.value = false
    }
}
</script>

<style scoped>
/* :deep(.n-layout-scroll-container) {
    display: flex;
    flex-direction: column;
    align-items: flex-start !important;
    justify-content: flex-start !important;
} */

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

.login-button .n-button__border {
    display: none !important;
}

.login-button .n-button__state-border {
    display: none !important;
}

.modal-input {
    height: 43px !important;
}

:deep(.n-input) {
    padding-left: 12px !important;
}

:deep(.n-input__prefix) {
    margin-left: 0 !important;
    margin-right: 0 !important;
}

:deep(.n-input__placeholder) {
    display: flex !important;
    align-items: center !important;
    color: #cccccc !important;
    font-size: 13px !important;
}

:deep(.n-input__input) {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}

:deep(.login-button .n-button__border) {
    display: none !important;
}

:deep(.login-button .n-button__state-border) {
    display: none !important;
}

:deep(.login-button .n-button__content) {
    display: flex !important;
    justify-content: center !important;
    width: 100% !important;
}

.n-input:hover {
    border-color: var(--primary-color) !important;
}

.n-input:focus-within {
    border-color: var(--primary-color) !important;
    box-shadow: 0 0 0 2px var(--primary-color-focus) !important;
}

/* Update button styles */
.n-button[type="primary"] {
    background-color: var(--primary-color) !important;
}

.n-button[type="primary"]:hover {
    background-color: var(--primary-color-hover) !important;
}

/* Update link colors */
.text-\[\#F4B183\] {
    color: var(--primary-color) !important;
}

:deep(.n-layout-header) {
    background-color: var(--n-color) !important;
}

:deep(.n-layout-sider) {
    background-color: var(--n-color) !important;
}

.theme-toggle {
    background-color: v-bind('isDark ? "#333" : "#f5f5f5"');
}

.theme-toggle:hover {
    background-color: v-bind('isDark ? "#444" : "#e5e5e5"') !important;
}

.modal-input[type="textarea"] {
    height: auto !important;
}
</style>