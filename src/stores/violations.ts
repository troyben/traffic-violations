import { ref, computed } from 'vue'

interface Violation {
    reference: string
    vrn: string
    date: string
    violation: string
    fee: number
    status: 'Paid' | 'Pending'
    paymentRef: string
    selected: boolean
}

const violations = ref<Violation[]>([
    {
        reference: '0001',
        vrn: 'AFC1234',
        date: '2024-10-13 13:53',
        violation: 'Running Red Traffic Light Code A',
        fee: 40.00,
        status: 'Paid',
        paymentRef: '1234',
        selected: false
    },
    {
        reference: '0002',
        vrn: 'ABC1234',
        date: '2024-09-25 11:21',
        violation: 'Running Red Traffic Light Code A',
        fee: 40.00,
        status: 'Pending',
        paymentRef: '',
        selected: false
    },
    {
        reference: '0003',
        vrn: 'ABC4321',
        date: '2024-09-21 10:53',
        violation: 'Running Red Traffic Light Code A',
        fee: 40.00,
        status: 'Pending',
        paymentRef: '',
        selected: false
    },
    {
        reference: '0004',
        vrn: 'ABC1234',
        date: '2024-07-14 20:23',
        violation: 'Over Speeding Code B',
        fee: 75.00,
        status: 'Pending',
        paymentRef: '',
        selected: false
    },
    {
        reference: '0005',
        vrn: 'ABC1234',
        date: '2024-07-14 20:23',
        violation: 'Over Speeding Code B',
        fee: 75.00,
        status: 'Pending',
        paymentRef: '',
        selected: false
    },
    {
        reference: '0006',
        vrn: 'XYZ9876',
        date: '2024-07-10 15:30',
        violation: 'Illegal Parking Code C',
        fee: 30.00,
        status: 'Pending',
        paymentRef: '',
        selected: false
    },
    {
        reference: '0007',
        vrn: 'DEF5678',
        date: '2024-07-08 09:15',
        violation: 'Over Speeding Code A',
        fee: 50.00,
        status: 'Paid',
        paymentRef: '1235',
        selected: false
    },
    {
        reference: '0008',
        vrn: 'GHI9012',
        date: '2024-07-05 14:45',
        violation: 'Running Red Traffic Light Code A',
        fee: 40.00,
        status: 'Paid',
        paymentRef: '1234',
        selected: false
    }
])

export const useViolations = () => {
    const unpaidViolations = computed(() => {
        return violations.value
            .filter(v => v.status === 'Pending')
            .map(v => ({
                label: `${v.reference} - ${v.violation} (${v.date})`,
                value: v.reference
            }))
    })

    return {
        violations,
        unpaidViolations
    }
}
