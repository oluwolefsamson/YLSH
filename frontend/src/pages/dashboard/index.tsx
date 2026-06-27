import React from "react"
import NextLink from "next/link"
import { LayoutDashboard, CalendarCheck, Award, GraduationCap, Trophy, Users, ArrowRight, CheckCircle, Calendar } from "lucide-react"
import { DashboardLayout } from "@/components/layout"
import { PageHeader, StatCard } from "@/components/dashboard"
import { NextPageWithLayout } from "@/interfaces/layout"
import { useAuth } from "@/contexts/AuthContext"
import { useEvents } from "@/services/hooks/events/events"
import { useMyRegistrations } from "@/services/hooks/registrations/registrations"
import { useMyCertificates } from "@/services/hooks/certificates/certificates"
import { useMyApplications } from "@/services/hooks/opportunities/opportunities"
import { CARD, CARD_STYLE, ROW } from '@/utils/card-styles'
import type { QuickAction } from "@/types"

const quickActions: QuickAction[] = [
  { label: "Browse Events", href: "/dashboard/events", icon: <CalendarCheck size={20} />, color: "#127C71" },
  { label: "Certificates", href: "/dashboard/certificates", icon: <Award size={20} />, color: "#f59e0b" },
  { label: "Find a Mentor", href: "/dashboard/mentorship", icon: <Users size={20} />, color: "#8b5cf6" },
  { label: "Opportunities", href: "/dashboard/opportunities", icon: <Trophy size={20} />, color: "#3b82f6" },
]

const statusDot: Record<string, string> = {
  attended: 'bg-emerald-500',
  registered: 'bg-brand-teal',
  waitlisted: 'bg-amber-500',
  cancelled: 'bg-slate-400',
}

const DashboardOverviewPage: NextPageWithLayout = () => {
  const { user } = useAuth()
  const { data: eventsData, isLoading: eventsLoading } = useEvents({ status: "upcoming", limit: 3 })
  const { data: registrations = [], isLoading: regsLoading } = useMyRegistrations()
  const { data: certificates = [] } = useMyCertificates()
  const { data: applications = [] } = useMyApplications()

  const upcomingCount = registrations.filter((r) => r.event?.status === "upcoming").length
  const attendedCount = registrations.filter((r) => r.status === "attended").length
  const issuedCerts = certificates.filter((c) => c.status === "issued").length
  const pendingCerts = certificates.filter((c) => c.status === "pending").length

  const upcomingEvents = eventsData?.data?.slice(0, 3) ?? []
  const recentRegs = registrations.slice(0, 4)

  const eventsSkeleton = (
    <div className="flex flex-col divide-y divide-slate-100">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-3.5 animate-pulse">
          <div className="flex-1">
            <div className="h-4 w-40 bg-slate-100 rounded-lg mb-2" />
            <div className="h-3 w-32 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-6 w-20 bg-slate-100 rounded-lg" />
        </div>
      ))}
    </div>
  )

  const regsSkeleton = (
    <div className="flex flex-col divide-y divide-slate-100">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start gap-3 py-3.5 animate-pulse">
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex-shrink-0" />
          <div className="flex-1">
            <div className="h-4 w-48 bg-slate-100 rounded-lg mb-1.5" />
            <div className="h-3 w-28 bg-slate-100 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <PageHeader
        eyebrow="Participant Dashboard"
        title={`Welcome back, ${user?.firstName ?? "..."}!`}
        subtitle="Track your events, certificates, learning progress, and opportunities."
        icon={<LayoutDashboard size={14} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Events Registered" value={String(registrations.length)} icon={<CalendarCheck size={20} />} progress={Math.min(registrations.length * 20, 100)} change={`${upcomingCount} upcoming`} />
        <StatCard label="Certificates Earned" value={String(issuedCerts)} icon={<Award size={20} />} progress={issuedCerts > 0 ? 60 : 0} change={pendingCerts > 0 ? `${pendingCerts} pending` : "All issued"} accent="#f59e0b" />
        <StatCard label="Events Attended" value={String(attendedCount)} icon={<GraduationCap size={20} />} progress={attendedCount > 0 ? 68 : 0} change={`${attendedCount} checked in`} accent="#8b5cf6" />
        <StatCard label="Applications" value={String(applications.length)} icon={<Trophy size={20} />} progress={Math.min(applications.length * 20, 100)} change={applications.length === 0 ? "None yet" : `${applications.length} submitted`} accent="#3b82f6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-5 mb-5">
        {/* Quick Actions */}
        <div className={CARD} style={CARD_STYLE}>
          <p className="text-base font-bold text-slate-800 mb-4">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <NextLink key={a.label} href={a.href}>
                <div
                  className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border border-slate-100 text-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  style={{ backgroundColor: `${a.color}08` }}
                >
                  <div className="w-10 h-10 rounded-xl grid place-items-center" style={{ backgroundColor: `${a.color}15`, color: a.color }}>
                    {a.icon}
                  </div>
                  <p className="text-xs font-semibold text-slate-700">{a.label}</p>
                </div>
              </NextLink>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className={CARD} style={CARD_STYLE}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-bold text-slate-800">Upcoming Events</p>
            <NextLink href="/dashboard/events" className="flex items-center gap-1 text-xs font-semibold text-brand-teal hover:underline">
              View all <ArrowRight size={13} />
            </NextLink>
          </div>
          {eventsLoading ? eventsSkeleton : (
            <div className="divide-y divide-slate-100">
              {upcomingEvents.length === 0 && <p className="text-sm text-slate-400 py-4">No upcoming events right now.</p>}
              {upcomingEvents.map((e) => {
                const reg = registrations.find((r) => r.event?._id === e._id)
                return (
                  <div key={e._id} className="flex items-center justify-between gap-4 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-brand-teal/10 text-brand-teal grid place-items-center flex-shrink-0">
                        <Calendar size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-800 truncate">{e.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {e.venue}
                        </p>
                      </div>
                    </div>
                    {reg ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-teal/10 text-brand-teal text-xs font-semibold flex-shrink-0">
                        <CheckCircle size={11} /> Registered
                      </span>
                    ) : (
                      <NextLink href="/dashboard/events" className="px-2.5 py-1 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors flex-shrink-0">
                        Register
                      </NextLink>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-5">
        {/* Profile Completion */}
        <div className={CARD} style={CARD_STYLE}>
          <p className="text-base font-bold text-slate-800 mb-0.5">Profile Completion</p>
          <p className="text-sm text-slate-400 mb-4">A complete profile gets more visibility with mentors and organisers.</p>
          {(() => {
            const fields = [user?.profilePhoto, user?.bio, user?.organization, user?.phone, user?.username]
            const filled = fields.filter(Boolean).length
            const pct = Math.round(((filled + 2) / (fields.length + 2)) * 100)
            const missing = [
              !user?.profilePhoto && "Add profile photo",
              !user?.bio && "Complete bio",
              !user?.organization && "Add organization",
            ].filter(Boolean)
            return (
              <>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-800">{pct}% complete</p>
                    <NextLink href="/dashboard/profile" className="text-xs font-semibold text-brand-teal hover:underline">
                      Complete now →
                    </NextLink>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-slate-100">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #1AAE9F, #127C71)' }} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {missing.map((item) => (
                    <div key={String(item)} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                      <p className="text-sm text-slate-400">{item}</p>
                    </div>
                  ))}
                </div>
              </>
            )
          })()}
        </div>

        {/* Recent Registrations */}
        <div className={CARD} style={CARD_STYLE}>
          <p className="text-base font-bold text-slate-800 mb-4">My Recent Registrations</p>
          {regsLoading ? regsSkeleton : (
            <div className="divide-y divide-slate-100">
              {recentRegs.length === 0 && (
                <p className="text-sm text-slate-400 py-4">
                  No registrations yet.{" "}
                  <NextLink href="/dashboard/events" className="text-brand-teal font-semibold hover:underline">Browse events →</NextLink>
                </p>
              )}
              {recentRegs.map((r) => (
                <div key={r._id} className="flex items-center gap-3 py-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 grid place-items-center flex-shrink-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${statusDot[r.status] ?? 'bg-slate-300'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{r.event?.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 capitalize">{r.status} · {new Date(r.createdAt).toLocaleDateString()}</p>
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

DashboardOverviewPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default DashboardOverviewPage
