import { get, post, put, del } from '@/services/axios'

export type ResourceType = 'video' | 'pdf' | 'article'

export interface LearningResource {
  _id: string
  title: string
  type: ResourceType
  category: string
  duration: string
  url: string
  videoId: string
  excerpt: string
  isPublic: boolean
  progress: number
  completed: boolean
  createdAt: string
}

export interface PaginatedResources {
  data: LearningResource[]
  total: number
  page: number
  limit: number
}

export interface UserProgress {
  _id: string
  user: string
  resource: string
  progress: number
  completed: boolean
  lastAccessedAt: string
}

export interface CreateResourcePayload {
  title: string
  type: ResourceType
  category: string
  duration?: string
  url?: string
  videoId?: string
  excerpt?: string
}

export const listResources = (params?: { type?: string; category?: string; page?: number; limit?: number }) =>
  get<PaginatedResources>('/api/learning', params)

export const getResourceById = (id: string) => get<LearningResource>(`/api/learning/${id}`)

export const createResource = (payload: CreateResourcePayload) => post<LearningResource>('/api/learning', payload)

export const updateResource = (id: string, payload: Partial<CreateResourcePayload>) =>
  put<LearningResource>(`/api/learning/${id}`, payload)

export const deleteResource = (id: string) => del<{ message: string }>(`/api/learning/${id}`)

export const updateProgress = (id: string, progress: number) =>
  post<UserProgress>(`/api/learning/${id}/progress`, { progress })
