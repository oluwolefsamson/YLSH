import { useQuery } from '@tanstack/react-query'
import {
  getDashboardStats, getUserGrowth, getEventStats, getAuditLog,
  type DashboardStats, type GrowthPoint, type EventStat, type AuditEntry,
} from '@/services/endpoints/analytics/analytics'

export const useDashboardStats = () =>
  useQuery<DashboardStats, Error>({
    queryKey: ['analytics-dashboard'],
    queryFn: getDashboardStats,
    staleTime: 60_000,
  })

export const useUserGrowth = () =>
  useQuery<GrowthPoint[], Error>({
    queryKey: ['analytics-growth'],
    queryFn: getUserGrowth,
    staleTime: 60_000,
  })

export const useEventStats = () =>
  useQuery<EventStat[], Error>({
    queryKey: ['analytics-events'],
    queryFn: getEventStats,
    staleTime: 60_000,
  })

export const useAuditLog = (page = 1, limit = 20) =>
  useQuery<{ data: AuditEntry[]; total: number; page: number; limit: number }, Error>({
    queryKey: ['analytics-audit', page],
    queryFn: () => getAuditLog(page, limit),
    placeholderData: (prev) => prev,
  })
