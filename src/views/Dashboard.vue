<template>
  <div class="space-y-6">
    <!-- Admin Dashboard -->
    <template v-if="isAdmin">
      <!-- Mobile View with Tabs -->
      <div class="md:hidden">
        <n-tabs 
          type="line"
          animated
          :style="{
            '--n-tab-text-color': '#666',
            '--n-tab-text-color-active': '#000',
            '--n-bar-color': '#F4B183'
          }"
        >
          <!-- Violations Tab -->
          <n-tab-pane name="violations" tab="Violations">
            <div class="space-y-4">
              <n-card v-for="violation in allViolations" 
                     :key="violation.id"
                     :class="[
                       'mobile-violation-card',
                       { 
                         'disputed-card': violation.status === 'disputed',
                         'paid-card': violation.status === 'paid',
                         'pending-card': violation.status === 'pending'
                       }
                     ]"
              >
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <div class="font-medium">{{ violation.vehicle.vrn }}</div>
                    <n-tag :type="getStatusType(violation.status)">
                      {{ violation.status }}
                    </n-tag>
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ new Date(violation.violation_date).toLocaleDateString() }}
                  </div>
                  <div>
                    <span class="text-gray-600">User:</span> 
                    {{ violation.user.email }}
                  </div>
                  <div>
                    <span class="text-gray-600">Violation:</span> 
                    {{ violation.violation_type.name }}
                  </div>
                  <div>
                    <span class="text-gray-600">Fee:</span>
                    ZWG {{ formatCurrency(violation.penalty_fee) }}
                  </div>
                </div>
              </n-card>
            </div>
          </n-tab-pane>

          <!-- Disputes Tab -->
          <n-tab-pane name="disputes" tab="Disputes">
            <div class="space-y-4">
              <n-card v-for="dispute in allDisputes" 
                     :key="dispute.id"
                     class="mobile-violation-card"
              >
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <div class="font-medium">Dispute #{{ dispute.id }}</div>
                    <n-tag :type="getStatusType(dispute.status)">
                      {{ dispute.status }}
                    </n-tag>
                  </div>
                  <div>
                    <span class="text-gray-600">Violation ID:</span> 
                    {{ dispute.violation_id }}
                  </div>
                  <div>
                    <span class="text-gray-600">Reason:</span> 
                    {{ dispute.reason }}
                  </div>
                  <div>
                    <span class="text-gray-600">Date:</span>
                    {{ new Date(dispute.created_at).toLocaleDateString() }}
                  </div>
                  <div class="flex gap-2" v-if="dispute.status === 'pending'">
                    <n-button size="small" type="primary" @click="handleDisputeAction(dispute.id, 'approve')">
                      Approve
                    </n-button>
                    <n-button size="small" @click="handleDisputeAction(dispute.id, 'reject')">
                      Reject
                    </n-button>
                  </div>
                </div>
              </n-card>
            </div>
          </n-tab-pane>

          <!-- Violation Types Tab -->
          <n-tab-pane name="types" tab="Violation Types">
            <div class="space-y-4">
              <n-card v-for="type in violationTypes" 
                     :key="type.id"
                     class="mobile-violation-card"
              >
                <div class="space-y-2">
                  <div class="font-medium">{{ type.name }}</div>
                  <div>
                    <span class="text-gray-600">Description:</span> 
                    {{ type.description }}
                  </div>
                  <div>
                    <span class="text-gray-600">Penalty Fee:</span>
                    ZWG {{ formatCurrency(type.penalty_fee) }}
                  </div>
                </div>
              </n-card>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>

      <!-- Desktop View -->
      <div class="hidden md:block">
        <!-- Violations Table -->
        <div class="mb-8">
          <h1 class="mb-6 text-2xl font-medium">All Violations</h1>
          <n-card>
            <n-data-table
              :columns="adminColumns"
              :data="allViolations"
              :pagination="pagination"
              :bordered="false"
              :single-line="false"
              :row-props="getRowProps"
              :row-key="(row) => row.id"
            />
          </n-card>
        </div>

        <!-- Disputes Table -->
        <div class="mb-8">
          <h2 class="mb-6 text-2xl font-medium">Violation Disputes</h2>
          <n-card>
            <n-data-table
              :columns="disputeColumns"
              :data="allDisputes"
              :pagination="pagination"
              :bordered="false"
              :single-line="false"
              :row-key="(row) => row.id"
            />
          </n-card>
        </div>

        <!-- Violation Types Table -->
        <div>
          <h2 class="mb-6 text-2xl font-medium">Violation Types</h2>
          <n-card>
            <n-data-table
              :columns="violationTypeColumns"
              :data="violationTypes"
              :pagination="pagination"
              :bordered="false"
              :single-line="false"
              :row-key="(row) => row.id"
            />
          </n-card>
        </div>
      </div>
    </template>

    <!-- User Dashboard -->
    <template v-else>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-medium">Violations</h1>
      </div>

      <!-- Mobile View -->
      <div class="md:hidden">
        <div class="flex justify-between items-center mb-4">
          <div class="text-lg font-medium">Your Violations</div>
        </div>
        
        <!-- Mobile List View -->
        <div class="space-y-4">
          <n-card 
            v-for="violation in violations" 
            :key="violation.id" 
            class="cursor-pointer" 
            :class="[
              'mobile-violation-card',
              { 
                'disputed-card': violation.status === 'disputed',
                'paid-card': violation.status === 'paid',
                'pending-card': violation.status === 'pending'
              }
            ]"
            @click="toggleViolationDetails(violation.id)"
          >
            <div class="flex justify-between items-center">
              <div>
                <div class="font-medium">{{ violation.vehicle.vrn }}</div>
                <div class="text-sm text-gray-600">
                  {{ new Date(violation.violation_date).toLocaleDateString() }}
                </div>
              </div>
              <div class="flex gap-2 items-center">
                <n-tag :type="getStatusType(violation.status)">
                  {{ violation.status }}
                </n-tag>
                <n-checkbox v-if="violation.status !== 'paid' && violation.status !== 'disputed'"
                          :checked="checkedRowKeys.includes(violation.id.toString())"
                          @update:checked="handleMobileSelection(violation.id)" />
              </div>
            </div>

            <!-- Expandable Details -->
            <div v-if="expandedViolation === violation.id" 
                 class="pt-4 mt-4 border-t border-gray-200">
              <div class="space-y-2">
                <div>
                  <span class="text-gray-600">Violation:</span> 
                  {{ violation.violation_type.name }}
                </div>
                <div>
                  <span class="text-gray-600">Vehicle:</span>
                  {{ violation.vehicle.make }} {{ violation.vehicle.model }}
                </div>
                <div>
                  <span class="text-gray-600">Penalty Fee:</span>
                  ZWG {{ formatCurrency(violation.violation_type.penalty_fee) }}
                </div>
                <div class="flex gap-2">
                  <n-button 
                    v-if="violation.status !== 'paid' && violation.status !== 'disputed'"
                    size="small" 
                    type="primary" 
                    @click="handleSinglePayment(violation)"
                    :style="{
                      backgroundColor: '#F4B183',
                      color: '#000000'
                    }">
                    Pay Now
                  </n-button>
                </div>
              </div>
            </div>
          </n-card>
        </div>

        <!-- Mobile Total and Pay Button -->
        <div v-if="checkedRowKeys.length > 0" 
             class="fixed right-0 bottom-0 left-0 p-4 bg-white border-t shadow-lg">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-sm text-gray-600">Selected: {{ checkedRowKeys.length }}</div>
              <div class="font-medium">Total: ZWG {{ totalPayment.toFixed(2) }}</div>
            </div>
            <n-button type="primary" @click="handlePayment"
                      :style="{
                        backgroundColor: '#F4B183',
                        borderRadius: '50px',
                      }">
              Pay Selected
            </n-button>
          </div>
        </div>
      </div>

      <!-- Desktop View -->
      <div class="hidden md:block">
        <n-card>
          <!-- Payment button section -->
          <div class="flex justify-between items-center mb-4">
            <div class="text-sm text-gray-600">
              <template v-if="checkedRowKeys.length > 0">
                Selected: {{ checkedRowKeys.length }} | 
                Total: ZWG {{ totalPayment.toFixed(2) }}
              </template>
            </div>
            <n-button
              v-if="checkedRowKeys.length > 0"
              type="primary"
              @click="handlePayment"
              :style="{
                backgroundColor: '#F4B183',
                borderRadius: '50px',
                color: '#000000'
              }"
            >
              Pay Selected ({{ checkedRowKeys.length }})
            </n-button>
          </div>

          <!-- Updated table with row-key -->
          <n-data-table 
            :loading="loading"
            :columns="columns" 
            :data="violations" 
            :pagination="pagination"
            :row-props="getRowProps"
            :row-key="(row) => row.id"
            @update:checked-row-keys="handleSelectionChange"
          />
        </n-card>
      </div>
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
import { NCard, NDataTable, NButton, NButtonGroup, NIcon, NSelect, NTag, NSpace, NModal, NInput, NRadioGroup, NRadio, NTabs, NTabPane } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
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
        disabled: (row: Violation) => row.status === 'paid' || row.status === 'disputed',
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

const checkedRowKeys = ref<(string | number)[]>([])

const totalPayment = computed(() => {
    return violations.value
        .filter(v => checkedRowKeys.value.includes(v.id.toString()))
        .reduce((sum, v) => {
            const fee = parseFloat(v.violation_type.penalty_fee)
            return sum + (isNaN(fee) ? 0 : fee)
        }, 0)
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
    const selectedViolations = violations.value.filter(v => 
        checkedRowKeys.value.includes(v.id.toString())
    )
    
    if (selectedViolations.some(v => v.status === 'paid' || v.status === 'disputed')) {
        notification.showError('Error', 'Cannot process payment for violations that are paid or under dispute')
        return
    }
    
    router.push({
        path: '/payment',
        query: {
            amount: totalPayment.value.toString(),
            count: checkedRowKeys.value.length,
            violations: checkedRowKeys.value.join(',')
        }
    })
}

const handleSelectionChange = (keys: (string | number)[]) => {
    checkedRowKeys.value = keys
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

// Add these new refs and functions
const expandedViolation = ref<number | null>(null)

const toggleViolationDetails = (id: number) => {
  expandedViolation.value = expandedViolation.value === id ? null : id
}

const handleMobileSelection = (id: number) => {
  const idString = id.toString()
  const currentIndex = checkedRowKeys.value.indexOf(idString)
  
  if (currentIndex === -1) {
    checkedRowKeys.value.push(idString)
  } else {
    checkedRowKeys.value.splice(currentIndex, 1)
  }
}

const getStatusType = (status: string) => {
  switch (status) {
    case 'PAID':
      return 'success'
    case 'PENDING':
      return 'warning'
    default:
      return 'default'
  }
}

const handleSinglePayment = (violation: Violation) => {
  if (violation.status === 'paid') {
    notification.showError('Error', 'This violation has already been paid')
    return
  }
  if (violation.status === 'disputed') {
    notification.showError('Error', 'This violation is currently under dispute')
    return
  }
    
  // Parse the penalty fee as a number
  const amount = parseFloat(violation.violation_type.penalty_fee)
  
  router.push({
    path: '/payment',
    query: {
      amount: amount.toString(), // Convert back to string for URL
      count: 1,
      violations: violation.id.toString()
    }
  })
}

const hasUnpaidSelectedViolations = computed(() => {
    return checkedRowKeys.value.length > 0 && 
           violations.value
               .filter(v => checkedRowKeys.value.includes(v.id.toString()))
               .some(v => v.status !== 'paid' && v.status !== 'disputed')
})

const getRowProps = (row: any) => {
  return {
    class: row.status,
    style: {
      cursor: 'pointer'
    }
  }
}

// Add a helper function if you need to handle null/undefined values
const formatCurrency = (amount: string | number) => {
  const value = parseFloat(amount as string)
  return isNaN(value) ? '0.00' : value.toFixed(2)
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

.mobile-violation-card {
  transition: all 0.3s ease;
}

.mobile-violation-card:active {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Bottom payment bar for mobile */
@media (max-width: 768px) {
  .space-y-6 {
    padding-bottom: 80px; /* Add space for fixed payment bar */
  }
}

:deep(.n-button:not([type="primary"])) {
  /* For non-primary buttons like Dispute */
  color: var(--text-color) !important;
  border: 1px solid #e5e7eb !important;
}

:deep(.n-button[type="primary"]) {
  /* For primary buttons like Pay Now */
  color: #000000 !important;
  background-color: #F4B183 !important;
}

/* Hover states */
:deep(.n-button:not([type="primary"]):hover) {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

:deep(.n-button[type="primary"]:hover) {
  background-color: #f3a46d !important;
}

.disputed-card {
  background-color: rgba(244, 177, 131, 0.1) !important; /* Light orange background */
  border: 1px solid #F4B183 !important; /* Orange border */
}

.paid-card {
  background-color: rgba(34, 197, 94, 0.1) !important; /* Light green background */
  border: 1px solid #22c55e !important; /* Green border */
}

.pending-card {
  background-color: rgba(239, 68, 68, 0.1) !important; /* Light red background */
  border: 1px solid #ef4444 !important; /* Red border */
}

/* Update table row styles to target specific combinations */
:deep(.n-data-table-tr.paid) {
  background-color: rgba(34, 197, 94, 0.1) !important;
}

:deep(.n-data-table-tr.disputed) {
  background-color: rgba(244, 177, 131, 0.1) !important;
}

:deep(.n-data-table-tr.pending) {
  background-color: rgba(239, 68, 68, 0.1) !important;
}

/* Hover states */
:deep(.n-data-table-tr.paid:hover) {
  background-color: rgba(34, 197, 94, 0.15) !important;
}

:deep(.n-data-table-tr.disputed:hover) {
  background-color: rgba(244, 177, 131, 0.15) !important;
}

:deep(.n-data-table-tr.pending:hover) {
  background-color: rgba(239, 68, 68, 0.15) !important;
}

/* Add these styles for the tabs */
:deep(.n-tabs-nav) {
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

:deep(.n-tabs-nav::before) {
  border-bottom: 1px solid #e5e7eb !important;
}
</style>