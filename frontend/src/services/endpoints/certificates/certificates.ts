import { get, post } from '@/services/axios'

export interface Certificate {
  _id: string
  user: string
  event: { _id: string; title: string; date: string; venue: string; category: string }
  type: 'Attendance' | 'Completion' | 'Participation'
  verifyCode: string | null
  status: 'issued' | 'pending' | 'revoked'
  issuedDate: string | null
  createdAt: string
}

export interface VerifyResult {
  verified: boolean
  certificate?: Certificate & { user: { firstName: string; lastName: string } }
  message?: string
}

export const getMyCertificates = () => get<Certificate[]>('/api/certificates/me')

export const verifyCertificate = (code: string) =>
  get<VerifyResult>(`/api/certificates/verify/${code}`)

export const generateCertificate = (registrationId: string, type?: string) =>
  post<Certificate>(`/api/certificates/generate/${registrationId}`, { type })

export const batchGenerateCertificates = (eventId: string, type?: string) =>
  post<{ issued: number; skipped: number }>(`/api/certificates/batch/${eventId}`, { type })
