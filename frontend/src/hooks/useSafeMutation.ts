import { useTransition } from 'react'
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query'
import { toast } from 'sonner'

type SafeMutationOptions<TData, TError extends Error, TVariables> = UseMutationOptions<
  TData,
  TError,
  TVariables
> & {
  invalidateQueries?: readonly (readonly unknown[])[]
  successMessage?: string
  errorMessage?: string
}

export function useSafeMutation<TData, TError extends Error = Error, TVariables = void>(
  options: SafeMutationOptions<TData, TError, TVariables>,
) {
  const queryClient = useQueryClient()
  const [isTransitionPending, startTransition] = useTransition()

  const { invalidateQueries, successMessage, errorMessage, onSuccess, onError, ...rest } = options

  const mutation = useMutation<TData, TError, TVariables>({
    ...rest,
    onSuccess: (data, variables, context) => {
      startTransition(() => {
        invalidateQueries?.forEach((key) =>
          queryClient.invalidateQueries({ queryKey: key as unknown[] }),
        )
        if (successMessage) toast.success(successMessage)
      })
      onSuccess?.(data, variables, context)
    },
    onError: (error, variables, context) => {
      toast.error(errorMessage ?? error.message)
      onError?.(error, variables, context)
    },
  })

  const safeMutateAsync = (variables: TVariables): Promise<TData> =>
    new Promise((resolve, reject) => {
      startTransition(() => {
        mutation.mutateAsync(variables).then(resolve).catch(reject)
      })
    })

  return {
    ...mutation,
    safeMutateAsync,
    isTransitionPending,
    isPending: mutation.isPending || isTransitionPending,
  }
}
