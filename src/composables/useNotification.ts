import { useNotification as useNaiveNotification } from 'naive-ui'
import type { NotificationProviderInst } from 'naive-ui'

export const useNotification = () => {
    const notification: NotificationProviderInst = useNaiveNotification()

    const showSuccess = (title: string, description: string) => {
        notification.success({
            title,
            description,
            duration: 3000,
            keepAliveOnHover: true,
            closable: true
        })
    }

    const showError = (title: string, description: string) => {
        notification.error({
            title,
            description,
            duration: 3000,
            keepAliveOnHover: true,
            closable: true
        })
    }

    const showWarning = (title: string, description: string) => {
        notification.warning({
            title,
            description,
            duration: 3000,
            keepAliveOnHover: true,
            closable: true
        })
    }

    return {
        showSuccess,
        showError,
        showWarning
    }
}
