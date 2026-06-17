import { get, put, patch, del, post } from '@/services/axios'

export interface User {
  _id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone?: string
  role: 'participant' | 'mentor' | 'admin' | 'super-admin'
  verificationStatus: 'verified' | 'pending' | 'suspended'
  approvalStatus: 'pending' | 'approved' | 'declined'
  approvalNote?: string
  ninVerified: boolean
  emailVerified: boolean
  organization?: string
  state?: string
  bio?: string
  username?: string
  profilePhoto?: string
  createdAt: string
}

export interface PaginatedUsers {
  data: User[]
  total: number
  page: number
  limit: number
}

export interface UpdateProfilePayload {
  firstName?: string
  lastName?: string
  phone?: string
  organization?: string
  state?: string
  bio?: string
  username?: string
  profilePhoto?: string
}

export const listUsers = (params?: { page?: number; limit?: number; search?: string; status?: string; role?: string }) =>
  get<PaginatedUsers>('/api/users', params)

export const getUserById = (id: string) => get<User>(`/api/users/${id}`)

export const getMyProfile = () => get<User>('/api/users/me')

export const updateMyProfile = (payload: UpdateProfilePayload) => put<User>('/api/users/me', payload)

export const updateUserStatus = (id: string, status: 'verified' | 'pending' | 'suspended') =>
  patch<User>(`/api/users/${id}/status`, { status })

export const updateUserRole = (id: string, role: string) =>
  patch<User>(`/api/users/${id}/role`, { role })

export const deleteUser = (id: string) => del<{ message: string }>(`/api/users/${id}`)

export const listPendingMentors = (params?: { page?: number; limit?: number }) =>
  get<PaginatedUsers>('/api/users/mentors/pending', params)

export const approveMentor = (id: string) => patch<User>(`/api/users/${id}/approve`, {})

export const declineMentor = (id: string, note?: string) =>
  patch<User>(`/api/users/${id}/decline`, { note })

export interface CreateAdminPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

export const createAdmin = (payload: CreateAdminPayload) => post<User>('/api/users/admin', payload)
