import api from './api'

interface ViolationType {
    name: string
    penaltyFee: number
}

export const violationTypeService = {
    addViolationType: async (data: { name: string, penaltyFee: number }) => {
        const response = await api.post('/violation-types/add', data)
        return response.data
    },

    getViolationTypes: async () => {
        const response = await api.get('/violation-types')
        return response.data
    },

    deleteViolationType: async (id: number) => {
        const response = await api.delete(`/violation-types/${id}`)
        return response.data
    }
} 