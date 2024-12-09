<template>
  <div class="space-y-6">
    <!-- Admin Dashboard -->
    <template v-if="isAdmin">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-medium">All Violations</h1>
      </div>

      <!-- Violations Table -->
      <n-card>
        <n-data-table
          :columns="adminColumns"
          :data="allViolations"
          :pagination="pagination"
          :bordered="false"
          :single-line="false"
        />
      </n-card>

     

      <!-- Disputes Table -->
      <div class="flex justify-between items-center mt-8 mb-6">
        <h2 class="text-2xl font-medium">Violation Disputes</h2>
      </div>

      <n-card>
        <n-data-table
          :columns="disputeColumns"
          :data="allDisputes"
          :pagination="pagination"
          :bordered="false"
          :single-line="false"
        />
      </n-card>
      
       <!-- Violation Types Table -->
      <div class="flex justify-between items-center mt-8 mb-6">
        <h2 class="text-2xl font-medium">Violation Types</h2>
      </div>

      <n-card>
        <n-data-table
          :columns="violationTypeColumns"
          :data="violationTypes"
          :pagination="pagination"
          :bordered="false"
          :single-line="false"
        />
      </n-card>
      
    </template>

    <!-- User Dashboard -->
    <template v-else>
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-medium">Violations</h1>
        </div>

        <n-card>
          <div class="flex justify-between items-center mb-4">
            <div class="text-lg font-medium">Your Violations</div>
            <div class="flex gap-6 items-center">
              <div class="flex gap-2 items-center">
                <span class="text-gray-600">Show</span>
                <n-select v-model:value="pageSize" :options="pageSizeOptions" size="small"
                  style="width: 100px" />
                <span class="text-gray-600">entries</span>
              </div>
              <div class="flex gap-2 items-center">
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

          <n-data-table 
            :loading="loading"
            :columns="columns" 
            :data="violations" 
            :pagination=pagination 
            :bordered="false"
            :single-line="false"
            :row-key="(row) => row.id.toString()" 
            @update:checked-row-keys="handleSelectionChange"
          />

          <div class="flex justify-between items-center pt-4 mt-6 border-t">
            <div class="text-lg">
              Total Payment: <span class="font-medium">ZWG {{ totalPayment.toFixed(2) }}</span>
            </div>
            <n-button type="primary" size="large" :disabled="checkedRowKeys.length === 0" 
              :style="{
                backgroundColor: '#F4B183',
                borderRadius: '50px',
                color: '#000000'
              }" 
              :hover-style="{
                backgroundColor: '#f3a46d',
                color: '#000000'
              }" 
              @click="handlePayment" 
              class="px-8 login-button">
              <span class="w-full text-center">Pay Penalties</span>
            </n-button>
          </div>
        </n-card>
    </template>

    <n-modal v-model:show="showDisputeModal" preset="card" title="Respond to Dispute" style="width: 600px">
      <template #header>
        <div class="text-lg font-medium">
          Respond to Dispute #{{ selectedDispute?.id }}
        </div>
      </template>

      <div class="space-y-4">
        <div class="p-4 bg-gray-50 rounded">
          <div class="text-sm text-gray-600">Dispute Details</div>
          <div class="mt-2">
            <div><strong>Violation ID:</strong> {{ selectedDispute?.violation_id }}</div>
            <div><strong>Violation Type:</strong> {{ selectedDispute?.violation_type }}</div>
            <div><strong>Reason:</strong> {{ selectedDispute?.reason }}</div>
          </div>
        </div>

        <div>
          <div class="mb-2">Action</div>
          <n-radio-group v-model:value="disputeAction">
            <n-space>
              <n-radio value="accept">Accept Dispute</n-radio>
              <n-radio value="reject">Reject Dispute</n-radio>
            </n-space>
          </n-radio-group>
        </div>

        <div>
          <div class="mb-2">Admin Response</div>
          <n-input
            v-model:value="adminResponse"
            type="textarea"
            placeholder="Enter your response..."
            :rows="4"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <n-button @click="showDisputeModal = false">Cancel</n-button>
          <n-button
            type="primary"
            :disabled="!adminResponse.trim()"
            @click="handleDisputeResponse"
            :style="{
              backgroundColor: disputeAction === 'accept' ? '#4CAF50' : '#F44336',
              color: 'white'
            }"
          >
            {{ disputeAction === 'accept' ? 'Accept' : 'Reject' }} Dispute
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, h } from 'vue'
import { NCard, NDataTable, NButton, NButtonGroup, NIcon, NSelect, NTag, NSpace, NModal, NInput, NRadioGroup, NRadio } from 'naive-ui'
import { ArrowUp, ArrowDown } from '@vicons/ionicons5'
import { useRouter, useRoute } from 'vue-router'
import type { RowKey } from '../types'
import type { DataTableColumns } from 'naive-ui'
import { violationService, type Violation } from '../services/violation.service'
import { useNotification } from '../composables/useNotification'
import { useAuthStore } from '../stores/auth'
import { disputeService } from '../services/dispute.service'
import { violationTypeService } from '../services/violationType.service'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const sortOrder = ref<'asc' | 'desc'>('desc')
const sortField = ref<'date' | 'fee'>('date')
const pageSize = ref(5)
const pageSizeOptions = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 }
]

const violations = ref<Violation[]>([])
const notification = useNotification()
const loading = ref(true)

// Check if user is admin
const isAdmin = computed(() => authStore.user?.role === 'admin')

// Admin data
const allViolations = ref([])
const allDisputes = ref([])
const violationTypes = ref([])

// Pagination config
const pagination = {
  pageSize: 10
}

// Admin columns for violations table
const adminColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 70
  },
  {
    title: 'VRN',
    key: 'vrn',
    width: 100
  },
  {
    title: 'Vehicle',
    key: 'vehicle',
    width: 150,
    render: (row) => `${row.vehicle.make} ${row.vehicle.model}`
  },
  {
    title: 'User',
    key: 'user',
    width: 180,
    render: (row) => `${row.user.first_name} ${row.user.last_name}`
  },
  {
    title: 'Location',
    key: 'location',
    width: 250
  },
  {
    title: 'Violation Type',
    key: 'violation_type',
    width: 120
  },
  {
    title: 'Penalty Fee',
    key: 'penalty_fee',
    width: 120,
    render: (row) => `ZWL ${Number(row.penalty_fee).toFixed(2)}`
  },
  {
    title: 'Date',
    key: 'violation_date',
    width: 120,
    render: (row) => new Date(row.violation_date).toLocaleDateString()
  },
  {
    title: 'Status',
    key: 'status',
    width: 100,
    render: (row) => h(NTag, {
      type: getViolationStatusType(row.status),
      bordered: false
    }, { default: () => row.status })
  }
]

// Helper function for status colors
const getViolationStatusType = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'success'
    case 'pending':
      return 'warning'
    case 'overdue':
      return 'error'
    case 'disputed':
      return 'info'
    case 'resolved':
      return 'success'
    case 'cancelled':
      return 'default'
    default:
      return 'default'
  }
}

// Admin columns for disputes table
const disputeColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 70
  },
  {
    title: 'Violation ID',
    key: 'violation_id',
    width: 100
  },
  {
    title: 'Violation Type',
    key: 'violation_type',
    width: 120
  },
  {
    title: 'Reason',
    key: 'reason',
    width: 250,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Status',
    key: 'status',
    width: 100,
    render: (row) => h(NTag, {
      type: getDisputeStatusType(row.status),
      bordered: false
    }, { default: () => row.status })
  },
  {
    title: 'Date',
    key: 'created_at',
    width: 120,
    render: (row) => new Date(row.created_at).toLocaleDateString()
  },
  {
    title: 'Admin Response',
    key: 'admin_response',
    width: 250,
    ellipsis: {
      tooltip: true
    },
    render: (row) => row.admin_response || 'No response yet'
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 100,
    render: (row) => row.status === 'pending' ? h(NButton, {
      type: 'primary',
      size: 'small',
      onClick: () => openDisputeModal(row)
    }, { default: () => 'Respond' }) : null
  }
]

// Helper function for dispute status colors
const getDisputeStatusType = (status: string) => {
  switch (status.toLowerCase()) {
    case 'accepted':
      return 'success'
    case 'pending':
      return 'warning'
    case 'rejected':
      return 'error'
    case 'reviewed':
      return 'info'
    default:
      return 'default'
  }
}

// Admin actions
const handleDisputeAction = async (disputeId: number, action: 'approve' | 'reject', adminResponse: string) => {
  try {
    await disputeService.updateDisputeStatus(disputeId, {
      action,
      admin_response: adminResponse
    })
    notification.showSuccess('Success', `Dispute ${action}ed successfully`)
    await fetchDisputes()
    await loadViolations()
  } catch (error) {
    notification.showError('Error', `Failed to ${action} dispute`)
  }
}

// Load data
const loadViolations = async () => {
  try {
    const response = await violationService.getAllViolations()
    allViolations.value = response.violations
  } catch (error) {
    notification.showError('Error', 'Failed to load violations')
  }
}

const fetchDisputes = async () => {
  try {
    const response = await disputeService.getAllDisputes()
    allDisputes.value = response.disputes
  } catch (error) {
    notification.showError('Error', 'Failed to load disputes')
  }
}

// Load data on mount
if (isAdmin.value) {
  loadViolations()
  fetchDisputes()
}

const columns: DataTableColumns<Violation> = [
    {
        type: 'selection',
        disabled: (row: Violation) => row.status === 'PAID',
        multiple: true,
        width: 50
    },
    {
        title: 'Reference',
        key: 'id',
        width: 100
    },
    {
        title: 'VRN',
        key: 'vehicle',
        width: 120,
        render: (row: Violation) => row.vehicle.vrn
    },
    {
        title: 'Date',
        key: 'violation_date',
        width: 120,
        render: (row: Violation) => new Date(row.violation_date).toLocaleDateString()
    },
    {
        title: 'Violation',
        key: 'violation_type',
        width: 200,
        render: (row: Violation) => row.violation_type.name
    },
    {
        title: 'Penalty Fee (ZWG)',
        key: 'penalty_fee',
        width: 150,
        render: (row: Violation) => {
            const fee = Number(row.violation_type.penalty_fee);
            return isNaN(fee) ? '0.00' : fee.toFixed(2);
        }
    },
    {
        title: 'Status',
        key: 'status',
        width: 120
    }
]

const checkedRowKeys = ref<string[]>([])

const totalPayment = computed(() => {
    return violations.value
        .filter(v => checkedRowKeys.value.includes(v.id.toString()))
        .reduce((sum, v) => sum + v.violation_type.penalty_fee, 0)
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
            return factor * (new Date(a.violation_date).getTime() - new Date(b.violation_date).getTime())
        }
        return factor * (a.violation_type.penalty_fee - b.violation_type.penalty_fee)
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

const fetchViolations = async () => {
    try {
        loading.value = true
        const response = await violationService.getUserViolations()
        violations.value = response.violations
        sortViolations()
        console.log('Violations refreshed:', violations.value.length, 'items')
    } catch (error: any) {
        console.error('Error fetching violations:', error)
        notification.showError(
            'Error',
            error.response?.data?.message || 'Failed to fetch violations'
        )
    } finally {
        loading.value = false
    }
}

// Watch for route query changes
watch(
    () => route.query.refresh,
    () => {
        console.log('Route refresh detected, fetching violations...')
        fetchViolations()
    }
)

onMounted(async () => {
  if (isAdmin.value) {
    await Promise.all([
      fetchViolations(),
      fetchDisputes(),
      fetchViolationTypes()
    ])
  } else {
    await fetchViolations()
  }
  loading.value = false
})

onUnmounted(() => {
    console.log('Dashboard unmounted')
})

const showDisputeModal = ref(false)
const selectedDispute = ref<any>(null)
const adminResponse = ref('')
const disputeAction = ref<'accept' | 'reject'>('accept')

const openDisputeModal = (dispute: any) => {
  selectedDispute.value = dispute
  adminResponse.value = ''
  disputeAction.value = 'accept'
  showDisputeModal.value = true
}

const handleDisputeResponse = async () => {
  try {
    await handleDisputeAction(
      selectedDispute.value.id, 
      disputeAction.value, 
      adminResponse.value
    )
    showDisputeModal.value = false
  } catch (error) {
    console.error('Error handling dispute response:', error)
  }
}

// Add violation type columns configuration
const violationTypeColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 70
  },
  {
    title: 'Name',
    key: 'name',
    width: 200
  },
  {
    title: 'Penalty Fee',
    key: 'penalty_fee',
    width: 120,
    render: (row: any) => {
        const fee = parseFloat(row.penalty_fee); // Parse the string to a float
        return isNaN(fee) ? 'ZWL 0.00' : `ZWL ${fee.toFixed(2)}`; // Handle NaN case
    }
  },
  {
    title: 'Created At',
    key: 'created_at',
    width: 120,
    render: (row: any) => new Date(row.created_at).toLocaleDateString()
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 100,
    render: (row: any) => h(NSpace, { justify: 'center' }, {
      default: () => [
        h(NButton, {
          size: 'small',
          quaternary: true,
          type: 'error',
          onClick: () => handleDeleteViolationType(row.id)
        }, { default: () => 'Delete' })
      ]
    })
  }
]

// Add function to fetch violation types
const fetchViolationTypes = async () => {
  try {
    const response = await violationTypeService.getViolationTypes()
    violationTypes.value = response.violation_types
  } catch (error: any) {
    notification.showError(error.response?.data?.message || 'Failed to fetch violation types')
  }
}

// Add function to handle violation type deletion
const handleDeleteViolationType = async (id: number) => {
  try {
    await violationTypeService.deleteViolationType(id)
    notification.showSuccess('Violation type deleted successfully')
    await fetchViolationTypes() // Refresh the list
  } catch (error: any) {
    notification.showError(error.response?.data?.message || 'Failed to delete violation type')
  }
}
</script>

<style scoped>
.n-data-table {
    --n-border-radius: 8px;
    width: 100%;
}

:deep(.n-data-table-wrapper) {
    width: 100%;
}

:deep(.n-data-table-table) {
    width: 100%;
}

/* Optional: Add horizontal scroll for small screens */
:deep(.n-data-table .n-data-table-base-table) {
    overflow-x: auto;
}

/* Optional: Make sure cells don't wrap unnecessarily */
:deep(.n-data-table-td) {
    white-space: nowrap;
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

.dispute-modal {
  max-width: 600px;
  margin: 0 auto;
}

:deep(.n-radio) {
  margin-right: 1rem;
}

:deep(.n-input) {
  margin-bottom: 1rem;
}

:deep(.n-modal-card-header) {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.n-modal-card-footer) {
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

:deep(.n-data-table) {
  width: 100% !important;
}

:deep(.n-data-table-wrapper) {
  width: 100% !important;
}

:deep(.n-data-table-base-table) {
  width: 100% !important;
}

:deep(.n-data-table-base-table-body) {
  width: 100% !important;
}

:deep(.n-data-table-table) {
  width: 100% !important;
}

:deep(.n-data-table th.n-data-table-th) {
  width: auto !important;
}
</style>