import api from './api'

export interface Dispute {
    id: number
    violation_id: number
    reason: string
    status: string
    created_at: string
}

export const disputeService = {
    createDispute: async (violation_id: number, reason: string) => {
        const response = await api.post('/disputes/create', {
            violation_id,
            reason
        })
        return response.data
    },

    getAllDisputes: async () => {
        const response = await api.get('/admin/disputes')
        return response.data
    },

    updateDisputeStatus: async (disputeId: number, data: {
        action: 'approve' | 'reject',
        admin_response: string
    }) => {
        const response = await api.put(`/admin/disputes/${disputeId}`, data)
        return response.data
    }
} 