import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getMyCertificates, verifyCertificate, generateCertificate, batchGenerateCertificates,
  type Certificate, type VerifyResult,
} from '@/services/endpoints/certificates/certificates'

export const useMyCertificates = () =>
  useQuery<Certificate[], Error>({
    queryKey: ['certificates-me'],
    queryFn: getMyCertificates,
  })

export const useVerifyCertificate = (code: string) =>
  useQuery<VerifyResult, Error>({
    queryKey: ['certificate-verify', code],
    queryFn: () => verifyCertificate(code),
    enabled: Boolean(code),
  })

export const useGenerateCertificate = () => {
  const qc = useQueryClient()
  return useMutation<Certificate, Error, { registrationId: string; type?: string }>({
    mutationFn: ({ registrationId, type }) => generateCertificate(registrationId, type),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['certificates-me'] }),
  })
}

export const useBatchGenerateCertificates = () => {
  const qc = useQueryClient()
  return useMutation<{ issued: number; skipped: number }, Error, { eventId: string; type?: string }>({
    mutationFn: ({ eventId, type }) => batchGenerateCertificates(eventId, type),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['certificates-me'] }),
  })
}
