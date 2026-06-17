import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listUsers, getUserById, getMyProfile, updateMyProfile,
  updateUserStatus, updateUserRole, deleteUser,
  listPendingMentors, approveMentor, declineMentor, createAdmin,
  type User, type PaginatedUsers, type UpdateProfilePayload, type CreateAdminPayload,
} from '@/services/endpoints/users/users'

const K = { LIST: 'users-list', DETAIL: 'users-detail', ME: 'users-me' }

export const useUsers = (params?: { page?: number; limit?: number; search?: string; status?: string; role?: string }) =>
  useQuery<PaginatedUsers, Error>({
    queryKey: [K.LIST, params],
    queryFn: () => listUsers(params),
    placeholderData: (prev) => prev,
  })

export const useUser = (id: string) =>
  useQuery<User, Error>({
    queryKey: [K.DETAIL, id],
    queryFn: () => getUserById(id),
    enabled: Boolean(id),
  })

export const useMyProfile = () =>
  useQuery<User, Error>({
    queryKey: [K.ME],
    queryFn: getMyProfile,
  })

export const useUpdateMyProfile = () => {
  const qc = useQueryClient()
  return useMutation<User, Error, UpdateProfilePayload>({
    mutationFn: updateMyProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: [K.ME] }),
  })
}

export const useUpdateUserStatus = () => {
  const qc = useQueryClient()
  return useMutation<User, Error, { id: string; status: 'verified' | 'pending' | 'suspended' }>({
    mutationFn: ({ id, status }) => updateUserStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: [K.LIST] }),
  })
}

export const useUpdateUserRole = () => {
  const qc = useQueryClient()
  return useMutation<User, Error, { id: string; role: string }>({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: [K.LIST] }),
  })
}

export const useDeleteUser = () => {
  const qc = useQueryClient()
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: [K.LIST] }),
  })
}

export const usePendingMentors = (params?: { page?: number; limit?: number }) =>
  useQuery<PaginatedUsers, Error>({
    queryKey: ['mentors-pending', params],
    queryFn: () => listPendingMentors(params),
    placeholderData: (prev) => prev,
  })

export const useApproveMentor = () => {
  const qc = useQueryClient()
  return useMutation<User, Error, string>({
    mutationFn: approveMentor,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mentors-pending'] })
      qc.invalidateQueries({ queryKey: [K.LIST] })
    },
  })
}

export const useDeclineMentor = () => {
  const qc = useQueryClient()
  return useMutation<User, Error, { id: string; note?: string }>({
    mutationFn: ({ id, note }) => declineMentor(id, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mentors-pending'] })
      qc.invalidateQueries({ queryKey: [K.LIST] })
    },
  })
}

export const useCreateAdmin = () => {
  const qc = useQueryClient()
  return useMutation<User, Error, CreateAdminPayload>({
    mutationFn: createAdmin,
    onSuccess: () => qc.invalidateQueries({ queryKey: [K.LIST] }),
  })
}
