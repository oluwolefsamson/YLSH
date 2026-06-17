import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listResources, getResourceById, createResource, updateResource, deleteResource, updateProgress,
  type CreateResourcePayload,
} from '@/services/endpoints/learning/learning'

export const useResources = (params?: { type?: string; category?: string; page?: number; limit?: number }) =>
  useQuery({ queryKey: ['learning', params], queryFn: () => listResources(params) })

export const useResource = (id: string) =>
  useQuery({ queryKey: ['learning-resource', id], queryFn: () => getResourceById(id), enabled: !!id })

export const useUpdateProgress = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: number }) => updateProgress(id, progress),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['learning'] }) },
  })
}

export const useCreateResource = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateResourcePayload) => createResource(payload),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['learning'] }) },
  })
}

export const useUpdateResource = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateResourcePayload> }) =>
      updateResource(id, payload),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['learning'] }) },
  })
}

export const useDeleteResource = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteResource(id),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['learning'] }) },
  })
}
