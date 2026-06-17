import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getMySessions, getSessionById, updateSessionStatus, addOutcome, rateSession, cancelSession,
  type SessionStatus,
} from '@/services/endpoints/sessions/sessions'

export const useMySessions = () =>
  useQuery({ queryKey: ['sessions-me'], queryFn: getMySessions })

export const useSession = (id: string) =>
  useQuery({ queryKey: ['session', id], queryFn: () => getSessionById(id), enabled: !!id })

export const useUpdateSessionStatus = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, outcome }: { id: string; status: SessionStatus; outcome?: string }) =>
      updateSessionStatus(id, status, outcome),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['sessions-me'] })
      void qc.invalidateQueries({ queryKey: ['mentor-stats'] })
    },
  })
}

export const useAddOutcome = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, outcome }: { id: string; outcome: string }) => addOutcome(id, outcome),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['sessions-me'] }) },
  })
}

export const useRateSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, rating }: { id: string; rating: number }) => rateSession(id, rating),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['sessions-me'] }) },
  })
}

export const useCancelSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cancelSession(id),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['sessions-me'] }) },
  })
}
