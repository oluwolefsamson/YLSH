import { get, post, put, del } from '@/services/axios'

export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface PaginatedUsers {
  data: User[]
  total: number
  page: number
  limit: number
}

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  role?: string
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  role?: string
}

export const listUsers = (page = 1, limit = 10) =>
  get<PaginatedUsers>('/api/users', { page, limit })

export const getUserById = (id: string) => get<User>(`/api/users/${id}`)

export const createUser = (payload: CreateUserPayload) => post<User>('/api/users', payload)

export const updateUser = (id: string, payload: UpdateUserPayload) =>
  put<User>(`/api/users/${id}`, payload)

export const deleteUser = (id: string) => del<{ message: string }>(`/api/users/${id}`)
