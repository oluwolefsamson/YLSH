import { get, patch, post, del } from '@/services/axios'
import type { User } from '../users/users'

export type SessionStatus = 'scheduled' | 'completed' | 'cancelled'

export interface MentorSession {
  _id: string
  mentor: User
  mentee: User
  topic: string
  scheduledAt: string
  duration: number
  status: SessionStatus
  meetLink: string
  outcome: string
  rating: number | null
  createdAt: string
}

export const getMySessions = () => get<MentorSession[]>('/api/sessions/me')

export const getSessionById = (id: string) => get<MentorSession>(`/api/sessions/${id}`)

export const updateSessionStatus = (id: string, status: SessionStatus, outcome?: string) =>
  patch<MentorSession>(`/api/sessions/${id}/status`, { status, outcome })

export const addOutcome = (id: string, outcome: string) =>
  patch<MentorSession>(`/api/sessions/${id}/outcome`, { outcome })

export const rateSession = (id: string, rating: number) =>
  post<MentorSession>(`/api/sessions/${id}/rate`, { rating })

export const cancelSession = (id: string) => del<{ message: string }>(`/api/sessions/${id}`)
