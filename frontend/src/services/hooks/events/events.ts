import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listEvents, getEventById, createEvent, updateEvent, deleteEvent,
  registerForEvent, cancelRegistration, getEventAttendees,
  type Event, type PaginatedEvents, type CreateEventPayload, type PaginatedAttendees,
} from '@/services/endpoints/events/events'

const K = { LIST: 'events-list', DETAIL: 'events-detail' }

export const useEvents = (params?: { status?: string; category?: string; page?: number; limit?: number }) =>
  useQuery<PaginatedEvents, Error>({
    queryKey: [K.LIST, params],
    queryFn: () => listEvents(params),
    placeholderData: (prev) => prev,
  })

export const useEvent = (id: string) =>
  useQuery<Event, Error>({
    queryKey: [K.DETAIL, id],
    queryFn: () => getEventById(id),
    enabled: Boolean(id),
  })

export const useCreateEvent = () => {
  const qc = useQueryClient()
  return useMutation<Event, Error, CreateEventPayload>({
    mutationFn: createEvent,
    onSuccess: () => qc.invalidateQueries({ queryKey: [K.LIST] }),
  })
}

export const useUpdateEvent = () => {
  const qc = useQueryClient()
  return useMutation<Event, Error, { id: string; payload: Partial<CreateEventPayload> }>({
    mutationFn: ({ id, payload }) => updateEvent(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: [K.LIST] })
      qc.invalidateQueries({ queryKey: [K.DETAIL, id] })
    },
  })
}

export const useDeleteEvent = () => {
  const qc = useQueryClient()
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteEvent,
    onSuccess: () => qc.invalidateQueries({ queryKey: [K.LIST] }),
  })
}

export const useEventAttendees = (eventId: string) =>
  useQuery<PaginatedAttendees, Error>({
    queryKey: ['event-attendees', eventId],
    queryFn: () => getEventAttendees(eventId),
    enabled: Boolean(eventId),
  })

export const useRegisterForEvent = () => {
  const qc = useQueryClient()
  return useMutation<{ registration: object; status: string }, Error, string>({
    mutationFn: registerForEvent,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [K.LIST] })
      qc.invalidateQueries({ queryKey: ['registrations-me'] })
    },
  })
}

export const useCancelRegistration = () => {
  const qc = useQueryClient()
  return useMutation<{ message: string }, Error, string>({
    mutationFn: cancelRegistration,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [K.LIST] })
      qc.invalidateQueries({ queryKey: ['registrations-me'] })
    },
  })
}
