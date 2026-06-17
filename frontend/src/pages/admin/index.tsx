import React from "react"
import NextLink from "next/link"
import { ShieldCheck, Users, CalendarCheck, Award, CheckCircle, Clock, TrendingUp } from "lucide-react"
import { AdminLayout } from "@/components/layout"
import { PageHeader, StatCard } from "@/components/dashboard"
import { NextPageWithLayout } from "@/interfaces/layout"
import { cn } from "@/utils"
import { useDashboardStats } from "@/services/hooks/analytics/analytics"
import { useUsers } from "@/services/hooks/users/users"
import { useEvents } from "@/services/hooks/events/events"

const statusStyles: Record<string, string> = {
  verified: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  suspended: "bg-red-100 text-red-700",
}

const CARD = "p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16"
const CARD_STYLE = { backgroundColor: "rgba(255,255,255,0.88)", boxShadow: "0 12px 30px rgba(15,23,42,0.06)" }

const AdminOverviewPage: NextPageWithLayout = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: usersData, isLoading: usersLoading } = useUsers({ limit: 5 })
  const { data: eventsData, isLoading: eventsLoading } = useEvents({ limit: 4 })

  const recentUsers = usersData?.data ?? []
  const recentEvents = eventsData?.data ?? []

  const statCards = [
    { label: "Total users", value: statsLoading ? "..." : String(stats?.totalUsers ?? 0), progress: 48, icon: <Users size={20} /> },
    { label: "Active events", value: statsLoading ? "..." : String(stats?.activeEvents ?? 0), progress: 80, icon: <CalendarCheck size={20} /> },
    { label: "Certificates issued", value: statsLoading ? "..." : String(stats?.totalCertificates ?? 0), progress: 62, icon: <Award size={20} /> },
    { label: "NIN verified users", value: statsLoading ? "..." : String(stats?.verifiedUsers ?? 0), progress: 82, icon: <ShieldCheck size={20} /> },
  ]

  return (
    <div>
      <PageHeader eyebrow="Admin Portal" title="Admin Overview" subtitle="Monitor platform health, manage users, events, and certificates across the YLSH ecosystem." icon={<ShieldCheck size={14} />} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (<StatCard key={card.label} label={card.label} value={card.value} icon={card.icon} progress={card.progress} />))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-5">
        <div className={CARD} style={CARD_STYLE}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Users</h2>
            <NextLink href="/admin/users" className="text-xs font-semibold px-3 py-1 rounded-full border border-border hover:bg-muted transition-colors">View all</NextLink>
          </div>
          {usersLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : (
            <div className="flex flex-col gap-3">
              {recentUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200/18 flex-wrap">
                  <div>
                    <p className="font-bold text-sm">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-muted-foreground">{user.email} · {user.role}</p>
                    <p className="text-xs text-muted-foreground">Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize", statusStyles[user.verificationStatus])}>
                    {user.verificationStatus === "verified" ? <CheckCircle size={11} /> : user.verificationStatus === "pending" ? <Clock size={11} /> : null}
                    {user.verificationStatus}
                  </span>
                </div>
              ))}
              {recentUsers.length === 0 && <p className="text-sm text-muted-foreground">No users yet.</p>}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className={CARD} style={CARD_STYLE}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Events</h2>
              <NextLink href="/admin/events" className="text-xs font-semibold px-3 py-1 rounded-full border border-border hover:bg-muted transition-colors">Manage</NextLink>
            </div>
            {eventsLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : (
              <div className="flex flex-col gap-3">
                {recentEvents.map((event) => (
                  <div key={event._id} className="p-3 rounded-xl border border-slate-200/18">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="font-bold text-sm flex-1 pr-2">{event.title}</p>
                      <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", event.status === "upcoming" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground")}>{event.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    <div className="h-[5px] rounded-full overflow-hidden bg-slate-200/50 mb-1">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground">{event.registeredCount}/{event.capacity} registered</p>
                  </div>
                ))}
                {recentEvents.length === 0 && <p className="text-sm text-muted-foreground">No events yet.</p>}
              </div>
            )}
          </div>

          <div className="p-5 rounded-2xl text-white" style={{ background: "linear-gradient(135deg, rgba(8,47,73,0.98) 0%, rgba(18,124,113,0.98) 100%)", boxShadow: "0 12px 30px rgba(15,23,42,0.06)" }}>
            <div className="flex items-center gap-2 mb-3"><TrendingUp size={18} /><h2 className="font-bold text-lg">Growth this month</h2></div>
            {[
              { label: "New registrations", value: statsLoading ? "..." : `+${stats?.growth?.newUsers ?? 0}` },
              { label: "Verifications completed", value: statsLoading ? "..." : `+${stats?.growth?.newVerifications ?? 0}` },
              { label: "Certificates issued", value: statsLoading ? "..." : `+${stats?.growth?.newCertificates ?? 0}` },
              { label: "Total attendance", value: statsLoading ? "..." : String(stats?.totalAttendance ?? 0) },
            ].map((row) => (
              <div key={row.label} className="flex justify-between mt-3">
                <p className="text-sm text-white/90">{row.label}</p>
                <p className="text-sm font-bold" style={{ color: "rgba(134,239,172,0.9)" }}>{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

AdminOverviewPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>
export default AdminOverviewPage
