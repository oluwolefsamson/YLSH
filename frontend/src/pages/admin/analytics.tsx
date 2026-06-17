import React from "react"
import { BarChart2, Users, CalendarCheck, Award, ShieldCheck, GraduationCap, TrendingUp } from "lucide-react"
import { AdminLayout } from "@/components/layout"
import { PageHeader } from "@/components/dashboard"
import { NextPageWithLayout } from "@/interfaces/layout"
import { useDashboardStats, useUserGrowth, useEventStats } from "@/services/hooks/analytics/analytics"

const CARD = "p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16"
const CARD_STYLE = { backgroundColor: "rgba(255,255,255,0.88)", boxShadow: "0 12px 30px rgba(15,23,42,0.06)" }

const AdminAnalyticsPage: NextPageWithLayout = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: growth = [], isLoading: growthLoading } = useUserGrowth()
  const { data: eventStats = [], isLoading: eventsLoading } = useEventStats()

  const kpis = [
    { label: "Total users", value: statsLoading ? "..." : stats?.totalUsers.toLocaleString() ?? "0", change: `+${stats?.growth?.newUsers ?? 0} this month`, icon: <Users size={20} />, pct: 48 },
    { label: "Verified users", value: statsLoading ? "..." : stats?.verifiedUsers.toLocaleString() ?? "0", change: stats ? `${Math.round((stats.verifiedUsers / Math.max(stats.totalUsers, 1)) * 100)}% verification rate` : "...", icon: <ShieldCheck size={20} />, pct: 82 },
    { label: "Active events", value: statsLoading ? "..." : String(stats?.activeEvents ?? 0), change: "Upcoming events", icon: <CalendarCheck size={20} />, pct: 70 },
    { label: "Certificates issued", value: statsLoading ? "..." : stats?.totalCertificates.toLocaleString() ?? "0", change: `+${stats?.growth?.newCertificates ?? 0} this month`, icon: <Award size={20} />, pct: 62 },
    { label: "Total attendance", value: statsLoading ? "..." : stats?.totalAttendance.toLocaleString() ?? "0", change: "Checked-in participants", icon: <GraduationCap size={20} />, pct: 55 },
    { label: "Verifications", value: statsLoading ? "..." : `+${stats?.growth?.newVerifications ?? 0}`, change: "This month", icon: <TrendingUp size={20} />, pct: 78 },
  ]

  const maxGrowth = Math.max(...growth.map((d) => d.count), 1)
  const maxAttendance = Math.max(...eventStats.map((e) => e.capacity), 1)

  return (
    <div>
      <PageHeader eyebrow="Analytics" title="Platform Analytics" subtitle="User growth, verification rate, event attendance, certificate issuance, and engagement metrics across the YLSH platform." icon={<BarChart2 size={14} />} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={CARD} style={CARD_STYLE}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl grid place-items-center text-white flex-shrink-0 bg-primary">{kpi.icon}</div>
              <div><p className="text-xs text-muted-foreground">{kpi.label}</p><p className="text-2xl font-bold">{kpi.value}</p></div>
            </div>
            <div className="h-[6px] rounded-full overflow-hidden mb-1.5" style={{ backgroundColor: "rgba(148,163,184,0.18)" }}>
              <div className="h-full rounded-full bg-primary" style={{ width: `${kpi.pct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={CARD} style={CARD_STYLE}>
          <h2 className="text-xl font-bold mb-4">User Growth</h2>
          {growthLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : (
            <div className="flex flex-col gap-3">
              {growth.map((row) => (
                <div key={row.month}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">{row.month}</span>
                    <span className="text-sm font-bold">{row.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(148,163,184,0.18)" }}>
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(row.count / maxGrowth) * 100}%` }} />
                  </div>
                </div>
              ))}
              {growth.length === 0 && <p className="text-sm text-muted-foreground">No growth data yet.</p>}
            </div>
          )}
        </div>

        <div className={CARD} style={CARD_STYLE}>
          <h2 className="text-xl font-bold mb-4">Top Events by Attendance</h2>
          {eventsLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : (
            <div className="flex flex-col gap-4">
              {eventStats.map((event, i) => (
                <div key={event.title}>
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <p className="text-sm font-semibold flex-1 pr-2">{event.title}</p>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{event.attendees}/{event.capacity}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden mb-1" style={{ backgroundColor: "rgba(148,163,184,0.18)" }}>
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((event.attendees / Math.max(event.capacity, 1)) * 100, 100)}%` }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">{Math.round((event.attendees / Math.max(event.capacity, 1)) * 100)}% attendance</span>
                    <span className="text-xs text-muted-foreground">{event.certificates} certificates issued</span>
                  </div>
                  {i < eventStats.length - 1 && <hr className="border-border mt-3" />}
                </div>
              ))}
              {eventStats.length === 0 && <p className="text-sm text-muted-foreground">No event data yet.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

AdminAnalyticsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>
export default AdminAnalyticsPage
