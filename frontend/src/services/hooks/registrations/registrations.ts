import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getMyRegistrations, getEventRegistrations, checkIn,
  type Registration,
} from '@/services/endpoints/registrations/registrations'

export const useMyRegistrations = () =>
  useQuery<Registration[], Error>({
    queryKey: ['registrations-me'],
    queryFn: getMyRegistrations,
  })

export const useEventRegistrations = (eventId: string, page = 1, limit = 50) =>
  useQuery({
    queryKey: ['registrations-event', eventId, page],
    queryFn: () => getEventRegistrations(eventId, page, limit),
    enabled: Boolean(eventId),
  })

export const useCheckIn = () => {
  const qc = useQueryClient()
  return useMutation<{ message: string; registration: Registration }, Error, string>({
    mutationFn: checkIn,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['registrations-event'] }),
  })
}
