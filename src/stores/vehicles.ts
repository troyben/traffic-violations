import { ref, computed } from 'vue'

interface Vehicle {
    id: string
    make: string
    model: string
    color: string
    vrn: string
}

const vehicles = ref<Vehicle[]>([
    {
        id: '1',
        make: 'Toyota',
        model: 'Camry',
        color: 'Silver',
        vrn: 'ABC1234'
    },
    {
        id: '2',
        make: 'Honda',
        model: 'Civic',
        color: 'Black',
        vrn: 'XYZ9876'
    },
    {
        id: '3',
        make: 'BMW',
        model: 'X5',
        color: 'White',
        vrn: 'DEF5678'
    },
    {
        id: '4',
        make: 'Mercedes',
        model: 'C200',
        color: 'Blue',
        vrn: 'GHI9012'
    },
    {
        id: '5',
        make: 'Audi',
        model: 'A4',
        color: 'Red',
        vrn: 'AFC1234'
    }
])

export const useVehicles = () => {
    const vehicleOptions = computed(() => {
        return vehicles.value.map(v => ({
            label: `${v.make} ${v.model} (${v.vrn})`,
            value: v.id
        }))
    })

    const getVehicleById = (id: string) => {
        return vehicles.value.find(v => v.id === id)
    }

    return {
        vehicles,
        vehicleOptions,
        getVehicleById
    }
} 