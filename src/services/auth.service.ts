import api from './api'

export interface LoginCredentials {
    email: string
    password: string
}

export interface AuthResponse {
    token: string
    user: {
        id: number
        email: string
        firstName: string
        lastName: string
        mobile?: string
        role: string
    }
}

interface UpdateProfileData {
    firstName: string
    lastName: string
    email: string
}

interface UpdateMobileData {
    mobile: string
}

interface RegisterData {
    firstName: string
    lastName: string
    email: string
    mobile: string
    password: string
}

const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    const response = await api.post('/auth/refresh-token', { refreshToken })
    return response.data
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>('/auth/login', credentials, {
                headers: {
                    'X-Login-Request': 'true'
                }
            })
            if (response.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken)
            }
            return response.data
        } catch (error) {
            throw error
        }
    },

    updateProfile: async (data: UpdateProfileData) => {
        const response = await api.put('/auth/update-profile', data)
        return response.data
    },

    updateMobile: async (data: UpdateMobileData) => {
        const response = await api.put('/auth/update-mobile', data)
        return response.data
    },

    refreshToken,

    register: async (data: RegisterData) => {
        const response = await api.post('/auth/register', {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            mobile: data.mobile,
            password: data.password
        })
        return response.data
    },
} 