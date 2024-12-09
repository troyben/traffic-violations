import api from './api'

export interface Violation {
    id: number
    location: string
    violation_date: string
    due_date: string
    status: string
    violation_type: {
        id: number
        name: string
        penalty_fee: number
    }
    vehicle: {
        id: number
        vrn: string
        make: string
        model: string
    }
}

export const violationService = {
    getUserViolations: async () => {
        const response = await api.get('/violations/my-violations')
        return response.data
    },
    getAllViolations: async () => {
        const response = await api.get('/admin/violations')
        return response.data
    }
} 