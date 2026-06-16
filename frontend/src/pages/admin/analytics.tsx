import React from 'react'
import { BarChart2, Users, CalendarCheck, Award, ShieldCheck, GraduationCap, TrendingUp } from 'lucide-react'
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
  { label: 'Attendance rate', value: '78%', change: 'Across all events', icon: <TrendingUp size={20} />, pct: 78 },
]

const topEvents = [
  { title: 'Youth Leadership Summit 2025', attendees: 468, capacity: 500, certificates: 462 },
  { title: 'Digital Skills Bootcamp', attendees: 148, capacity: 150, certificates: 148 },
  { title: 'Entrepreneurship Masterclass', attendees: 289, capacity: 300, certificates: 280 },
  { title: 'Climate Action Workshop', attendees: 175, capacity: 200, certificates: 170 },
]

const userGrowth = [
  { month: 'Jan 2026', count: 3200 },
  { month: 'Feb 2026', count: 3410 },
  { month: 'Mar 2026', count: 3680 },
  { month: 'Apr 2026', count: 3890 },
  { month: 'May 2026', count: 4120 },
  { month: 'Jun 2026', count: 4821 },
]

const AdminAnalyticsPage: NextPageWithLayout = () => {
  const maxCount = Math.max(...userGrowth.map((d) => d.count))

  return (
    <div>
      <PageHeader eyebrow="Analytics" title="Platform Analytics" subtitle="User growth, verification rate, event attendance, certificate issuance, and engagement metrics across the YLSH platform." icon={<BarChart2 size={14} />} />

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={CARD} style={CARD_STYLE}>
          <h2 className="text-xl font-bold mb-4">User Growth (2026)</h2>
          <div className="flex flex-col gap-3">
            {userGrowth.map((row) => (
              <div key={row.month}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">{row.month}</span>
                  <span className="text-sm font-bold">{row.count.toLocaleString()}</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(148,163,184,0.18)' }}>
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(row.count / maxCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={CARD} style={CARD_STYLE}>
          <h2 className="text-xl font-bold mb-4">Top Events by Attendance</h2>
          <div className="flex flex-col gap-4">
            {topEvents.map((event, i) => (
              <div key={event.title}>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <p className="text-sm font-semibold flex-1 pr-2">{event.title}</p>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{event.attendees}/{event.capacity}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-1" style={{ backgroundColor: 'rgba(148,163,184,0.18)' }}>
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(event.attendees / event.capacity) * 100}%` }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">{Math.round((event.attendees / event.capacity) * 100)}% attendance</span>
                  <span className="text-xs text-muted-foreground">{event.certificates} certificates issued</span>
                </div>
                {i < topEvents.length - 1 && <hr className="border-border mt-3" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

AdminAnalyticsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>
export default AdminAnalyticsPage
