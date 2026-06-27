import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listOpportunities, getOpportunityById, createOpportunity, updateOpportunity,
  deleteOpportunity, applyForOpportunity, getMyApplications, getApplicationsForOpportunity,
  updateApplicationStatus,
  type CreateOpportunityPayload, type ApplicationStatus, type PaginatedApplications,
} from '@/services/endpoints/opportunities/opportunities'

export const useOpportunities = (params?: { type?: string; page?: number; limit?: number }) =>
  useQuery({ queryKey: ['opportunities', params], queryFn: () => listOpportunities(params) })

export const useOpportunity = (id: string) =>
  useQuery({ queryKey: ['opportunity', id], queryFn: () => getOpportunityById(id), enabled: !!id })

export const useMyApplications = () =>
  useQuery({ queryKey: ['applications-me'], queryFn: getMyApplications })

export const useApplyForOpportunity = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, coverLetter }: { id: string; coverLetter: string }) =>
      applyForOpportunity(id, coverLetter),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['applications-me'] }) },
  })
}

export const useCreateOpportunity = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateOpportunityPayload) => createOpportunity(payload),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['opportunities'] }) },
  })
}

export const useUpdateOpportunity = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateOpportunityPayload> }) =>
      updateOpportunity(id, payload),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['opportunities'] }) },
  })
}

export const useDeleteOpportunity = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteOpportunity(id),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['opportunities'] }) },
  })
}

export const useApplicationsForOpportunity = (id: string) =>
  useQuery<PaginatedApplications, Error>({
    queryKey: ['opp-applications', id],
    queryFn: () => getApplicationsForOpportunity(id),
    enabled: Boolean(id),
  })

export const useUpdateApplicationStatus = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      updateApplicationStatus(id, status),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['applications-me'] })
      void qc.invalidateQueries({ queryKey: ['opp-applications'] })
    },
  })
}
