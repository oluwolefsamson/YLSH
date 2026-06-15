import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/services/constants/users'
import {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  type PaginatedUsers,
  type User,
  type CreateUserPayload,
  type UpdateUserPayload,
} from '@/services/endpoints/users/users'

export const useUsers = (page = 1, limit = 10) =>
  useQuery<PaginatedUsers, Error>({
    queryKey: [QUERY_KEYS.LIST, page, limit],
    queryFn: () => listUsers(page, limit),
    placeholderData: (prev) => prev,
  })

export const useUser = (id: string) =>
  useQuery<User, Error>({
    queryKey: [QUERY_KEYS.DETAIL, id],
    queryFn: () => getUserById(id),
    enabled: Boolean(id),
  })

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation<User, Error, CreateUserPayload>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LIST] })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation<User, Error, { id: string; payload: UpdateUserPayload }>({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LIST] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DETAIL, id] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LIST] })
    },
  })
}
