import { get } from '@/services/axios'

export interface DashboardStats {
  totalUsers: number
  verifiedUsers: number
  activeEvents: number
  totalCertificates: number
  totalAttendance: number
  growth: {
    newUsers: number
    newVerifications: number
    newCertificates: number
  }
}

export interface GrowthPoint {
  month: string
  count: number
}

export interface EventStat {
  title: string
  capacity: number
  registered: number
  attendees: number
  certificates: number
}

export interface AuditEntry {
  _id: string
  action: string
  actorName?: string
  actorEmail?: string
  createdAt: string
}

export const getDashboardStats = () => get<DashboardStats>('/api/analytics/dashboard')

export const getUserGrowth = () => get<GrowthPoint[]>('/api/analytics/growth')

export const getEventStats = () => get<EventStat[]>('/api/analytics/events')

export const getAuditLog = (page = 1, limit = 20) =>
  get<{ data: AuditEntry[]; total: number; page: number; limit: number }>(
    '/api/analytics/audit-log',
    { page, limit }
  )
