import React from 'react'
import { BarChart2, Users, CalendarCheck, Award, ShieldCheck, GraduationCap, ShieldAlert } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const kpis = [
  { label: 'Total users', value: '4,821', change: '+318 this month', icon: <Users size={20} />, pct: 48 },
  { label: 'Verified users', value: '3,940', change: '81.7% verification rate', icon: <ShieldCheck size={20} />, pct: 82 },
  { label: 'Events hosted', value: '28', change: '+4 this quarter', icon: <CalendarCheck size={20} />, pct: 70 },
  { label: 'Certificates issued', value: '3,104', change: '+87 this month', icon: <Award size={20} />, pct: 62 },
  { label: 'Mentorship sessions', value: '891', change: '+43 this month', icon: <GraduationCap size={20} />, pct: 55 },
  { label: 'Admin accounts', value: '6', change: '1 Super Admin · 5 Admins', icon: <ShieldAlert size={20} />, pct: 30 },
]

const roleDistribution = [
  { role: 'Participant', count: 4727, pct: 98 },
  { role: 'Mentor', count: 47, pct: 1 },
  { role: 'Admin', count: 5, pct: 0.1 },
  { role: 'Super Admin', count: 1, pct: 0.02 },
]

const userGrowth = [
  { month: 'Jan 2026', count: 3200 },
  { month: 'Feb 2026', count: 3410 },
  { month: 'Mar 2026', count: 3680 },
  { month: 'Apr 2026', count: 3890 },
  { month: 'May 2026', count: 4120 },
  { month: 'Jun 2026', count: 4821 },
]

const topStates = [
  { state: 'Lagos', users: 1241 },
  { state: 'Abuja (FCT)', users: 892 },
  { state: 'Kano', users: 634 },
  { state: 'Rivers', users: 521 },
  { state: 'Kaduna', users: 488 },
]

const SuperAdminAnalyticsPage: NextPageWithLayout = () => {
  const maxCount = Math.max(...userGrowth.map((d) => d.count))
  const maxState = Math.max(...topStates.map((s) => s.users))

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
          <h2 className="text-xl font-bold mb-4">User Growth (2026)</h2>
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
        </div>

        <div className={CARD} style={CARD_STYLE}>
          <h2 className="text-xl font-bold mb-4">Role Distribution</h2>
          <div className="flex flex-col gap-4">
            {roleDistribution.map((r, i) => (
              <div key={r.role}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">{r.role}</span>
                  <span className="text-sm text-muted-foreground">{r.count.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(148,163,184,0.18)' }}>
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(r.pct, 2)}%` }} />
                </div>
                {i < roleDistribution.length - 1 && <hr className="border-border mt-3" />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 md:p-6 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, rgba(8,47,73,0.98) 0%, rgba(18,124,113,0.98) 100%)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }}>
          <h2 className="text-xl font-bold mb-4">Top States</h2>
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
        </div>
      </div>
    </div>
  )
}

SuperAdminAnalyticsPage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>
export default SuperAdminAnalyticsPage
