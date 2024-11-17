<template>
    <n-layout has-sider>
        <!-- Left Sidebar -->
        <n-layout-sider bordered :width="240" :collapsed-width="64" :collapsed="collapsed" collapse-mode="width"
            show-trigger @collapse="collapsed = true" @expand="collapsed = false" class="h-screen">
            <div class="p-4 flex justify-center">
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
            <n-layout-header bordered class="h-16 px-4 flex items-center justify-end w-full">
                <n-button quaternary circle class="mr-2 theme-toggle" @click="toggleTheme">
                    <n-icon size="18" :color="isDark ? '#fff' : '#333'">
                        <sunny v-if="isDark" />
                        <moon v-else />
                    </n-icon>
                </n-button>
                <n-dropdown :options="userOptions" trigger="click" @select="handleUserAction">
                    <div
                        class="flex items-center gap-2 cursor-pointer hover:bg-opacity-10 hover:bg-gray-500 px-3 py-2 rounded-full">
                        <n-avatar round size="small" :style="{ background: '#F4B183' }">
                            {{ userInitials }}
                        </n-avatar>
                        <span class="text-sm" :style="{ color: isDark ? '#ffffff' : '#333333' }">John Doe</span>
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
    <n-modal v-model:show="showAddVehicleModal" preset="card" style="width: 600px" title="Add Vehicle">
        <div>
            <div class="grid grid-cols-2 gap-6">
                <div class="relative">
                    <label class="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                        Make
                    </label>
                    <n-input v-model:value="vehicleForm.make" size="large" placeholder="Enter vehicle make"
                        class="modal-input" />
                </div>

                <div class="relative">
                    <label class="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                        Model
                    </label>
                    <n-input v-model:value="vehicleForm.model" size="large" placeholder="Enter vehicle model"
                        class="modal-input" />
                </div>

                <div class="relative">
                    <label class="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                        Color
                    </label>
                    <n-input v-model:value="vehicleForm.color" size="large" placeholder="Enter vehicle color"
                        class="modal-input" />
                </div>

                <div class="relative">
                    <label class="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                        VRN
                    </label>
                    <n-input v-model:value="vehicleForm.vrn" size="large"
                        placeholder="Enter vehicle registration number" class="modal-input" />
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-4 px-2">
                <n-button size="large" class="px-8 py-2" style="color: #666666" @click="showAddVehicleModal = false">
                    Cancel
                </n-button>
                <n-button type="primary" size="large" :style="{
                    backgroundColor: '#F4B183',
                    borderRadius: '50px',
                }" :hover-style="{
                    backgroundColor: '#f3a46d',
                }" class="login-button px-8 py-2" @click="saveVehicle">
                    <span class="w-full text-center">Save Vehicle</span>
                </n-button>
            </div>
        </template>
    </n-modal>

    <!-- Add Dispute Modal -->
    <n-modal v-model:show="showDisputeModal" preset="card" style="width: 600px" title="Dispute Violation">
        <div class="space-y-6">
            <div class="relative">
                <label class="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600 z-10" :style="{
                    backgroundColor: isDark ? '#242424' : '#ffffff',
                    color: isDark ? '#e1e1e1' : '#666666'
                }">
                    Select Violation
                </label>
                <n-select v-model:value="disputeForm.reference" :options="unpaidViolations" filterable
                    placeholder="Search and select violation" size="large" :style="{ '--n-padding-vertical': '12px' }"
                    class="modal-input" />
            </div>

            <div class="relative">
                <label class="absolute -top-2 left-3 px-1 text-sm z-10" :style="{
                    backgroundColor: isDark ? '#242424' : '#ffffff',
                    color: isDark ? '#e1e1e1' : '#666666'
                }">
                    Reason for Dispute
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

            <div class="flex justify-end">
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
    NSelect
} from 'naive-ui'
import { DashboardOutlined, CarOutlined, LogoutOutlined, UserOutlined } from '@vicons/antd'
import { ChevronDown, Sunny, Moon, AlertCircle } from '@vicons/ionicons5'
import { useNotification } from '../composables/useNotification'
import { useViolations } from '../stores/violations'

const router = useRouter()
const userInitials = computed(() => 'JD')

const menuOptions = [
    {
        label: 'Dashboard',
        key: 'dashboard',
        icon: renderIcon(DashboardOutlined),
        defaultSelected: true
    }
]

const userOptions = [
    {
        label: 'Profile',
        key: 'profile',
        icon: renderIcon(UserOutlined)
    },
    {
        label: 'Add Vehicle',
        key: 'add-vehicle',
        icon: renderIcon(CarOutlined)
    },
    {
        label: 'Dispute Violation',
        key: 'dispute',
        icon: renderIcon(AlertCircle)
    },
    {
        label: 'Logout',
        key: 'logout',
        icon: renderIcon(LogoutOutlined)
    }
]

function renderIcon(icon: any) {
    return () => h(NIcon, null, { default: () => h(icon) })
}

const handleUserAction = (key: string) => {
    if (key === 'logout') {
        router.push('/auth/login')
    } else if (key === 'add-vehicle') {
        showAddVehicleModal.value = true
    } else if (key === 'dispute') {
        showDisputeModal.value = true
    } else if (key === 'profile') {
        router.push('/profile')
    }
}

const collapsed = ref(false)

const showAddVehicleModal = ref(false)

interface Vehicle {
    make: string
    model: string
    color: string
    vrn: string
}

const vehicleForm = ref<Vehicle>({
    make: '',
    model: '',
    color: '',
    vrn: ''
})

const { showSuccess } = useNotification()

const saveVehicle = () => {
    showSuccess('Vehicle Added', 'Your vehicle has been added to your account')
    vehicleForm.value = {
        make: '',
        model: '',
        color: '',
        vrn: ''
    }
    showAddVehicleModal.value = false
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

const handleDispute = () => {
    showSuccess('Dispute Submitted', 'Your dispute has been submitted successfully')
    disputeForm.value = {
        reference: '',
        reason: ''
    }
    showDisputeModal.value = false
}

const { unpaidViolations } = useViolations()

const handleMenuClick = (key: string) => {
    if (key === 'dashboard') {
        router.push('/dashboard')
    }
}
</script>

<style scoped>
:deep(.n-layout-scroll-container) {
    display: flex;
    flex-direction: column;
    align-items: flex-start !important;
    justify-content: flex-start !important;
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