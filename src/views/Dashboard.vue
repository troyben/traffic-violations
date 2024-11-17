<template>
    <div class="w-full">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-medium">Violations</h1>
        </div>

        <n-card>
            <div class="flex items-center justify-between mb-4">
                <div class="text-lg font-medium">Your Violations</div>
                <div class="flex items-center gap-6">
                    <div class="flex items-center gap-2">
                        <span class="text-gray-600">Show</span>
                        <n-select v-model:value="pageSize" :options="pageSizeOptions" size="small"
                            style="width: 100px" />
                        <span class="text-gray-600">entries</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-gray-600">Sort by:</span>
                        <n-button-group>
                            <n-button @click="sortByDate" size="small" :style="{
                                color: '#666666',
                                backgroundColor: sortField === 'date' ? '#F4B18330' : 'transparent'
                            }">
                                Date
                                <n-icon size="16" class="ml-1">
                                    <arrow-down v-if="sortField === 'date' && sortOrder === 'desc'" />
                                    <arrow-up v-if="sortField === 'date' && sortOrder === 'asc'" />
                                </n-icon>
                            </n-button>
                            <n-button @click="sortByFee" size="small" :style="{
                                color: '#666666',
                                backgroundColor: sortField === 'fee' ? '#F4B18330' : 'transparent'
                            }">
                                Fee
                                <n-icon size="16" class="ml-1">
                                    <arrow-down v-if="sortField === 'fee' && sortOrder === 'desc'" />
                                    <arrow-up v-if="sortField === 'fee' && sortOrder === 'asc'" />
                                </n-icon>
                            </n-button>
                        </n-button-group>
                    </div>
                </div>
            </div>

            <n-data-table :columns="columns" :data="violations" :pagination="{
                pageSize: pageSize,
                showSizePicker: false,
                pageSizes: [5, 10, 15, 20]
            }" :row-key="(row) => row.reference" @update:checked-row-keys="handleSelectionChange" />

            <div class="flex justify-between items-center mt-6 pt-4 border-t">
                <div class="text-lg">
                    Total Payment: <span class="font-medium">ZWG {{ totalPayment.toFixed(2) }}</span>
                </div>
                <n-button type="primary" size="large" :disabled="checkedRowKeys.length === 0" :style="{
                    backgroundColor: '#F4B183',
                    borderRadius: '50px',
                    color: '#000000'
                }" :hover-style="{
                    backgroundColor: '#f3a46d',
                    color: '#000000'
                }" @click="handlePayment" class="px-8 login-button">
                    <span class="w-full text-center">Pay Penalties</span>
                </n-button>
            </div>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard, NDataTable, NButton, NButtonGroup, NIcon, NSelect } from 'naive-ui'
import { ArrowUp, ArrowDown } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import { useViolations } from '../stores/violations'
import type { Violation, RowKey } from '../types'
import type { DataTableColumns } from 'naive-ui'

const router = useRouter()

const sortOrder = ref<'asc' | 'desc'>('desc')
const sortField = ref<'date' | 'fee'>('date')
const pageSize = ref(5)
const pageSizeOptions = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 }
]

const { violations } = useViolations()

const columns: DataTableColumns<Violation> = [
    {
        type: 'selection',
        disabled: (row: Violation) => row.status === 'Paid',
        multiple: true
    },
    {
        title: 'Reference',
        key: 'reference'
    },
    {
        title: 'VRN',
        key: 'vrn'
    },
    {
        title: 'Date',
        key: 'date'
    },
    {
        title: 'Violation',
        key: 'violation'
    },
    {
        title: 'Penalty Fee (ZWG)',
        key: 'fee'
    },
    {
        title: 'Status',
        key: 'status'
    },
    {
        title: 'Payment Reference',
        key: 'paymentRef'
    }
]

const checkedRowKeys = ref<string[]>([])

const totalPayment = computed(() => {
    return violations.value
        .filter(v => checkedRowKeys.value.includes(v.reference))
        .reduce((sum, v) => sum + v.fee, 0)
})

const sortByDate = () => {
    sortField.value = 'date'
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    sortViolations()
}

const sortByFee = () => {
    sortField.value = 'fee'
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    sortViolations()
}

const sortViolations = () => {
    violations.value.sort((a, b) => {
        const factor = sortOrder.value === 'asc' ? 1 : -1
        if (sortField.value === 'date') {
            return factor * (new Date(a.date).getTime() - new Date(b.date).getTime())
        }
        return factor * (a.fee - b.fee)
    })
}

const handlePayment = () => {
    router.push({
        path: '/payment',
        query: {
            amount: totalPayment.value,
            count: checkedRowKeys.value.length
        }
    })
}

const handleSelectionChange = (keys: RowKey[]) => {
    checkedRowKeys.value = keys as string[]
    violations.value.forEach(v => {
        v.selected = keys.includes(v.reference)
    })
}
</script>

<style scoped>
.n-data-table {
    --n-border-radius: 8px;
}

:deep(.n-select) {
    width: 80px;
}

:deep(.n-select .n-base-selection) {
    background-color: var(--n-color) !important;
}

:deep(.n-select .n-base-selection-label) {
    color: var(--n-text-color) !important;
}

:deep(.n-select .n-base-selection-placeholder) {
    color: var(--n-placeholder-color) !important;
}

:deep(.n-select-menu) {
    background-color: var(--n-color) !important;
    color: var(--n-text-color) !important;
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
</style>