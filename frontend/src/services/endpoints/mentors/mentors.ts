import { get, post, put } from '@/services/axios'
import type { User } from '../users/users'

export interface MentorProfile {
  _id: string
  user: User | string
  headline: string
  category: string
  yearsExperience: number
  rating: number
  totalSessions: number
  bio: string
  skills: string[]
  availability: string
  availableDays: string[]
  startTime: string
  endTime: string
  sessionDuration: number
  maxPerWeek: number
  isPublic: boolean
  meetLink: string
}

export interface PaginatedMentors {
  data: MentorProfile[]
  total: number
  page: number
  limit: number
}

export interface MenteeEntry {
  user: User
  totalSessions: number
  completedSessions: number
  lastSession: string
  status: 'active' | 'completed'
}

export interface MentorStats {
  totalMentees: number
  sessionsThisMonth: number
  rating: number
  totalCompleted: number
}

export interface UpdateMentorProfilePayload {
  headline?: string
  category?: string
  yearsExperience?: number
  bio?: string
  skills?: string[]
  availability?: string
  meetLink?: string
}

export interface UpdateAvailabilityPayload {
  availableDays?: string[]
  startTime?: string
  endTime?: string
  sessionDuration?: number
  maxPerWeek?: number
}

export const listMentors = (params?: { category?: string; page?: number; limit?: number }) =>
  get<PaginatedMentors>('/api/mentors', params)

export const getMentorById = (id: string) => get<MentorProfile>(`/api/mentors/${id}`)

export const getMyMentorProfile = () => get<MentorProfile>('/api/mentors/me/profile')

export const updateMyMentorProfile = (payload: UpdateMentorProfilePayload) =>
  put<MentorProfile>('/api/mentors/me/profile', payload)

export const updateAvailability = (payload: UpdateAvailabilityPayload) =>
  put<MentorProfile>('/api/mentors/me/availability', payload)

export const getMyMentees = () => get<MenteeEntry[]>('/api/mentors/me/mentees')

export const getMentorStats = () => get<MentorStats>('/api/mentors/me/stats')

export const requestSession = (mentorId: string, payload: { topic: string; scheduledAt: string }) =>
  post<{ _id: string }>(`/api/mentors/${mentorId}/request`, payload)
