import api from './api'

export interface PaymentData {
    violation_id: number
    payment_method: 'mastercard' | 'ecocash'
    transaction_reference: string
}

export const paymentService = {
    createPayment: async (data: PaymentData) => {
        
        console.log(data)
        const response = await api.post('/payments/create', data)
        return response.data
    }
}
