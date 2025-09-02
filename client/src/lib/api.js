import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

export const api = axios.create({ baseURL, timeout: 15000 })

api.interceptors.response.use(
    (res) => res,
    (err) => Promise.reject(new Error(err.response?.data?.error || err.message || 'Network error'))
)
