import type { TableColumn } from 'naive-ui'

declare module 'naive-ui' {
    export type DataTableColumns<T = any> = TableColumn<T>[]
} 