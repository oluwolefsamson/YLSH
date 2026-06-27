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
import { CARD, CARD_STYLE, ACCENT_CARD, ACCENT_CARD_STYLE } from '@/utils/card-styles'

const verificationDot: Record<string, string> = {
  verified: 'bg-emerald-500',
  pending: 'bg-amber-500',
  suspended: 'bg-red-500',
}
const verificationBadge: Record<string, string> = {
  verified: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  suspended: 'bg-red-50 text-red-700',
}

const AdminOverviewPage: NextPageWithLayout = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: usersData, isLoading: usersLoading } = useUsers({ limit: 5 })
  const { data: eventsData, isLoading: eventsLoading } = useEvents({ limit: 4 })

  const recentUsers = usersData?.data ?? []
  const recentEvents = eventsData?.data ?? []

  const totalUsers = stats?.totalUsers ?? 0
  const verifiedUsers = stats?.verifiedUsers ?? 0
  const totalCerts = stats?.totalCertificates ?? 0

  const statCards = [
    { label: "Total users", value: statsLoading ? "..." : String(totalUsers), progress: totalUsers ? (verifiedUsers / totalUsers) * 100 : 0, icon: <Users size={20} />, change: `${verifiedUsers} verified` },
    { label: "Active events", value: statsLoading ? "..." : String(stats?.activeEvents ?? 0), progress: undefined, icon: <CalendarCheck size={20} /> },
    { label: "Certificates issued", value: statsLoading ? "..." : String(totalCerts), progress: totalUsers ? Math.min((totalCerts / totalUsers) * 100, 100) : 0, icon: <Award size={20} />, change: `of ${totalUsers} users`, accent: "#f59e0b" },
    { label: "NIN verified", value: statsLoading ? "..." : String(verifiedUsers), progress: totalUsers ? (verifiedUsers / totalUsers) * 100 : 0, icon: <ShieldCheck size={20} />, change: totalUsers ? `${Math.round((verifiedUsers / totalUsers) * 100)}% rate` : undefined, accent: "#22c55e" },
  ]

  const userSkeleton = (
    <div className="divide-y divide-slate-100">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 py-3.5 animate-pulse">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex-shrink-0" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-slate-100 rounded-lg mb-1.5" />
            <div className="h-3 w-48 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-6 w-16 bg-slate-100 rounded-lg flex-shrink-0" />
        </div>
      ))}
    </div>
  )

  const eventSkeleton = (
    <div className="divide-y divide-slate-100">
      {[1, 2, 3].map((i) => (
        <div key={i} className="py-3.5 animate-pulse">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="h-4 w-36 bg-slate-100 rounded-lg flex-1" />
            <div className="h-5 w-16 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-2 rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <PageHeader
        eyebrow="Admin Portal"
        title="Admin Overview"
        subtitle="Monitor platform health, manage users, events, and certificates."
        icon={<ShieldCheck size={14} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} icon={card.icon} progress={card.progress} change={card.change} accent={card.accent} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-5">
        {/* Recent Users */}
        <div className={CARD} style={CARD_STYLE}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-bold text-slate-800">Recent Users</p>
            <NextLink href="/admin/users" className="text-xs font-semibold text-slate-400 hover:text-brand-teal transition-colors">View all →</NextLink>
          </div>
          {usersLoading ? userSkeleton : (
            <div className="divide-y divide-slate-100">
              {recentUsers.map((user) => {
                const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
                return (
                  <div key={user._id} className="flex items-center gap-3 py-3.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 text-white grid place-items-center text-xs font-bold flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{user.email} · {user.role}</p>
                    </div>
                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0", verificationBadge[user.verificationStatus] ?? 'bg-slate-50 text-slate-500')}>
                      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", verificationDot[user.verificationStatus] ?? 'bg-slate-400')} />
                      <span className="capitalize">{user.verificationStatus === 'verified' ? 'Verified' : user.verificationStatus}</span>
                    </span>
                  </div>
                )
              })}
              {recentUsers.length === 0 && <p className="text-sm text-slate-400 py-4">No users yet.</p>}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          {/* Events */}
          <div className={CARD} style={CARD_STYLE}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-bold text-slate-800">Events</p>
              <NextLink href="/admin/events" className="text-xs font-semibold text-slate-400 hover:text-brand-teal transition-colors">Manage →</NextLink>
            </div>
            {eventsLoading ? eventSkeleton : (
              <div className="divide-y divide-slate-100">
                {recentEvents.map((event) => (
                  <div key={event._id} className="py-3.5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-semibold text-sm text-slate-800 flex-1 pr-2 leading-snug">{event.title}</p>
                      <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0", event.status === "upcoming" ? "bg-brand-teal/10 text-brand-teal" : "bg-slate-100 text-slate-500")}>
                        {event.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    {event.capacity ? (
                      <>
                        <div className="h-1.5 rounded-full overflow-hidden bg-slate-100 mb-1">
                          <div className="h-full rounded-full bg-brand-teal" style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }} />
                        </div>
                        <p className="text-xs text-slate-400">{event.registeredCount}/{event.capacity} registered</p>
                      </>
                    ) : (
                      <p className="text-xs text-slate-400">{event.registeredCount} registered · Unlimited</p>
                    )}
                  </div>
                ))}
                {recentEvents.length === 0 && <p className="text-sm text-slate-400 py-4">No events yet.</p>}
              </div>
            )}
          </div>

          {/* Growth this month — accent panel */}
          <div className={ACCENT_CARD} style={ACCENT_CARD_STYLE}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-white/15 grid place-items-center"><TrendingUp size={16} /></div>
              <p className="font-bold text-base">Growth this month</p>
            </div>
            {[
              { label: "New registrations", value: statsLoading ? "..." : `+${stats?.growth?.newUsers ?? 0}` },
              { label: "Verifications", value: statsLoading ? "..." : `+${stats?.growth?.newVerifications ?? 0}` },
              { label: "Certificates issued", value: statsLoading ? "..." : `+${stats?.growth?.newCertificates ?? 0}` },
              { label: "Total attendance", value: statsLoading ? "..." : String(stats?.totalAttendance ?? 0) },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-white/10 last:border-0">
                <p className="text-sm text-white/80">{row.label}</p>
                <p className="text-sm font-bold text-white">{row.value}</p>
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
