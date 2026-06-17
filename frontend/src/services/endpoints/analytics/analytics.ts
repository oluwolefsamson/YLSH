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

export interface RoleDistributionRow {
  role: string
  count: number
  pct: number
}

export interface TopStateRow {
  state: string
  users: number
}

export interface SuperDashboardStats {
  totalUsers: number
  verifiedUsers: number
  activeEvents: number
  totalCertificates: number
  totalAttendance: number
  totalSessions: number
  adminCount: number
  newUsersThisMonth: number
}

export interface AdminAccount {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  verificationStatus: string
  lastActive: string
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

export const getRoleDistribution = () => get<RoleDistributionRow[]>('/api/analytics/role-distribution')

export const getTopStates = () => get<TopStateRow[]>('/api/analytics/top-states')

export const getSuperDashboard = () => get<SuperDashboardStats>('/api/analytics/super-dashboard')

export const listAdmins = () => get<AdminAccount[]>('/api/analytics/admins')
