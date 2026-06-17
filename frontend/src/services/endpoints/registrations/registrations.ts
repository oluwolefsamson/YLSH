import { get, post } from '@/services/axios'

export interface Registration {
  _id: string
  user: string
  event: {
    _id: string
    title: string
    date: string
    time: string
    venue: string
    category: string
    status: string
  }
  qrToken: string
  status: 'registered' | 'waitlisted' | 'attended' | 'cancelled'
  checkedInAt?: string
  createdAt: string
}

export const getMyRegistrations = () => get<Registration[]>('/api/registrations/me')

export const getEventRegistrations = (eventId: string, page = 1, limit = 50) =>
  get<{ data: Registration[]; total: number; page: number; limit: number }>(
    `/api/registrations/event/${eventId}`,
    { page, limit }
  )

export const checkIn = (qrToken: string) =>
  post<{ message: string; registration: Registration }>('/api/registrations/checkin', { qrToken })
