import api from './api'

export interface Vehicle {
    id: number
    vrn: string
    make: string
    model: string
}

export const vehicleService = {
    getVehicles: async () => {
        const response = await api.get('/vehicles/my-vehicles')
        return response.data
    },

    addVehicle: async (data: { vrn: string, make: string, model: string }) => {
        const response = await api.post('/vehicles/add', data)
        return response.data
    },

    updateVehicle: async (data: { vehicleId: number, vrn: string, make: string, model: string }) => {
        const response = await api.put('/vehicles/update', data)
        return response.data
    },

    deleteVehicle: async (vehicleId: number) => {
        const response = await api.delete(`/vehicles/${vehicleId}`)
        return response.data
    }
} 