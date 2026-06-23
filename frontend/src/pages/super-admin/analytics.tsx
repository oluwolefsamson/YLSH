import React from 'react'
import { BarChart2, Users, CalendarCheck, Award, ShieldCheck, GraduationCap, ShieldAlert, Loader2 } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { useSuperDashboard, useUserGrowth, useRoleDistribution, useTopStates } from '@/services/hooks/analytics/analytics'
import { CARD, CARD_STYLE } from '@/utils/card-styles'


const SuperAdminAnalyticsPage: NextPageWithLayout = () => {
  const { data: dashboard, isLoading: loadingDash } = useSuperDashboard()
  const { data: userGrowth = [], isLoading: loadingGrowth } = useUserGrowth()
  const { data: roleDistribution = [], isLoading: loadingRoles } = useRoleDistribution()
  const { data: topStates = [], isLoading: loadingStates } = useTopStates()

  const maxCount = userGrowth.length ? Math.max(...userGrowth.map((d) => d.count)) : 1
  const maxState = topStates.length ? Math.max(...topStates.map((s) => s.users)) : 1

  const v = (x?: number) => (loadingDash ? '—' : (x ?? 0).toLocaleString())

  const kpis = [
    { label: 'Total users', value: v(dashboard?.totalUsers), icon: <Users size={20} />, pct: Math.min(((dashboard?.totalUsers ?? 0) / 10000) * 100, 100), change: `+${v(dashboard?.newUsersThisMonth)} this month` },
    { label: 'Verified users', value: v(dashboard?.verifiedUsers), icon: <ShieldCheck size={20} />, pct: dashboard?.totalUsers ? (dashboard.verifiedUsers / dashboard.totalUsers) * 100 : 0, change: `${dashboard?.totalUsers ? Math.round((dashboard.verifiedUsers / dashboard.totalUsers) * 100) : 0}% verification rate` },
    { label: 'Events hosted', value: v(dashboard?.activeEvents), icon: <CalendarCheck size={20} />, pct: 70, change: 'Active events' },
    { label: 'Certificates issued', value: v(dashboard?.totalCertificates), icon: <Award size={20} />, pct: 62, change: 'Total certificates' },
    { label: 'Mentorship sessions', value: v(dashboard?.totalSessions), icon: <GraduationCap size={20} />, pct: 55, change: 'All time sessions' },
    { label: 'Admin accounts', value: v(dashboard?.adminCount), icon: <ShieldAlert size={20} />, pct: 30, change: 'Admin & super-admin' },
  ]

  return (
    <div>
      <PageHeader eyebrow="System Analytics" title="Platform Analytics" subtitle="Full system-wide metrics — user growth, role distribution, verification rates, event performance, and geographic reach." icon={<BarChart2 size={14} />} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={CARD} style={CARD_STYLE}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl grid place-items-center text-white flex-shrink-0 bg-primary">{kpi.icon}</div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
            </div>
            <div className="h-[6px] rounded-full overflow-hidden mb-1.5" style={{ backgroundColor: 'rgba(148,163,184,0.18)' }}>
              <div className="h-full rounded-full bg-primary" style={{ width: `${kpi.pct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className={CARD} style={CARD_STYLE}>
          <h2 className="text-xl font-bold mb-4">User Growth</h2>
          {loadingGrowth ? (
            <div className="flex items-center justify-center py-8"><Loader2 size={20} className="animate-spin text-primary" /></div>
          ) : userGrowth.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No growth data yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {userGrowth.map((row) => (
                <div key={row.month}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">{row.month}</span>
                    <span className="text-sm font-bold">{row.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(148,163,184,0.18)' }}>
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(row.count / maxCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={CARD} style={CARD_STYLE}>
          <h2 className="text-xl font-bold mb-4">Role Distribution</h2>
          {loadingRoles ? (
            <div className="flex items-center justify-center py-8"><Loader2 size={20} className="animate-spin text-primary" /></div>
          ) : roleDistribution.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No data yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {roleDistribution.map((r, i) => (
                <div key={r.role}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold capitalize">{r.role}</span>
                    <span className="text-sm text-muted-foreground">{r.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(148,163,184,0.18)' }}>
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(r.pct, 2)}%` }} />
                  </div>
                  {i < roleDistribution.length - 1 && <hr className="border-border mt-3" />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 md:p-6 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, rgba(6,30,53,0.98) 0%, rgba(8,47,73,0.98) 100%)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }}>
          <h2 className="text-xl font-bold mb-4">Top States</h2>
          {loadingStates ? (
            <div className="flex items-center justify-center py-8"><Loader2 size={20} className="animate-spin" style={{ color: 'rgba(255,255,255,0.7)' }} /></div>
          ) : topStates.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>No state data yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {topStates.map((s, i) => (
                <div key={s.state}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>#{i + 1}</span>
                      <span className="text-sm font-semibold">{s.state}</span>
                    </div>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{s.users.toLocaleString()}</span>
                  </div>
                  <div className="h-[5px] rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(s.users / maxState) * 100}%`, backgroundColor: 'rgba(134,239,172,0.8)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

SuperAdminAnalyticsPage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>
export default SuperAdminAnalyticsPage
