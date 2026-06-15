import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error('[API Error]', error?.response?.data ?? error.message)
    return Promise.reject(error)
  },
)

export const get = <T>(url: string, params?: object) =>
  api.get<T>(url, { params }).then((r) => r.data)

export const post = <T>(url: string, data?: unknown) =>
  api.post<T>(url, data).then((r) => r.data)

export const put = <T>(url: string, data?: unknown) =>
  api.put<T>(url, data).then((r) => r.data)

export const patch = <T>(url: string, data?: unknown) =>
  api.patch<T>(url, data).then((r) => r.data)

export const del = <T>(url: string) => api.delete<T>(url).then((r) => r.data)

export default api
