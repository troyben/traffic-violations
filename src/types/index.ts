import type { Ref } from 'vue'

export interface Vehicle {
    make: string
    model: string
    color: string
    vrn: string
}

export interface Violation {
    reference: string
    vrn: string
    date: string
    violation: string
    fee: number
    status: 'Paid' | 'Pending'
    paymentRef: string
    selected: boolean
}

export type RowKey = string | number

export type ThemeRef = Ref<boolean>
