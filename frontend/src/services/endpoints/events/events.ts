import { get, post, put, del } from '@/services/axios'

export interface Event {
  _id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  category: 'Summit' | 'Workshop' | 'Masterclass' | 'Bootcamp' | 'Conference'
  capacity: number
  registeredCount: number
  status: 'upcoming' | 'ongoing' | 'past'
  speakers: Array<{ _id: string; name: string; photo?: string; topic?: string }>
  tags?: string[]
  createdAt: string
}

export interface PaginatedEvents {
  data: Event[]
  total: number
  page: number
  limit: number
}

export interface CreateEventPayload {
  title: string
  description?: string
  date: string
  time?: string
  venue: string
  category?: string
  capacity: number
}

export const listEvents = (params?: { status?: string; category?: string; page?: number; limit?: number }) =>
  get<PaginatedEvents>('/api/events', params)

export const getEventById = (id: string) => get<Event>(`/api/events/${id}`)

export const createEvent = (payload: CreateEventPayload) => post<Event>('/api/events', payload)

export const updateEvent = (id: string, payload: Partial<CreateEventPayload>) =>
  put<Event>(`/api/events/${id}`, payload)

export const deleteEvent = (id: string) => del<{ message: string }>(`/api/events/${id}`)

export const registerForEvent = (id: string) =>
  post<{ registration: object; status: string }>(`/api/events/${id}/register`)

export const cancelRegistration = (id: string) =>
  del<{ message: string }>(`/api/events/${id}/register`)
