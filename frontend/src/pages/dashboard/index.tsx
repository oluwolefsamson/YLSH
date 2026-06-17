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
import type { QuickAction } from "@/types"

const quickActions: QuickAction[] = [
  { label: "Browse Events", href: "/dashboard/events", icon: <CalendarCheck size={20} />, color: "#127C71" },
  { label: "View Certificates", href: "/dashboard/certificates", icon: <Award size={20} />, color: "#f59e0b" },
  { label: "Find a Mentor", href: "/dashboard/mentorship", icon: <Users size={20} />, color: "#8b5cf6" },
  { label: "Opportunities", href: "/dashboard/opportunities", icon: <Trophy size={20} />, color: "#3b82f6" },
]

const CARD = "p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16"
const CARD_STYLE = { backgroundColor: "rgba(255,255,255,0.88)", boxShadow: "0 12px 30px rgba(15,23,42,0.06)" }

const DashboardOverviewPage: NextPageWithLayout = () => {
  const { user } = useAuth()
  const { data: eventsData } = useEvents({ status: "upcoming", limit: 3 })
  const { data: registrations = [] } = useMyRegistrations()
  const { data: certificates = [] } = useMyCertificates()

  const upcomingCount = registrations.filter((r) => r.event?.status === "upcoming").length
  const attendedCount = registrations.filter((r) => r.status === "attended").length
  const issuedCerts = certificates.filter((c) => c.status === "issued").length
  const pendingCerts = certificates.filter((c) => c.status === "pending").length

  const upcomingEvents = eventsData?.data?.slice(0, 3) ?? []
  const recentRegs = registrations.slice(0, 4)

  const displayName = user ? `${user.firstName} ${user.lastName}` : "..."

  return (
    <div>
      <PageHeader eyebrow="Participant Dashboard" title={`Welcome back, ${user?.firstName ?? "..."}!`} subtitle="Track your events, certificates, learning progress, and opportunities — all in one place." icon={<LayoutDashboard size={14} />} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Events Registered" value={String(registrations.length)} icon={<CalendarCheck size={20} />} progress={Math.min(registrations.length * 20, 100)} change={`${upcomingCount} upcoming`} />
        <StatCard label="Certificates Earned" value={String(issuedCerts)} icon={<Award size={20} />} progress={issuedCerts > 0 ? 60 : 0} change={pendingCerts > 0 ? `${pendingCerts} pending` : "All issued"} accent="#f59e0b" />
        <StatCard label="Attended Events" value={String(attendedCount)} icon={<GraduationCap size={20} />} progress={attendedCount > 0 ? 68 : 0} change={`${attendedCount} checked in`} accent="#8b5cf6" />
        <StatCard label="Applications" value="0" icon={<Trophy size={20} />} progress={0} change="None yet" accent="#3b82f6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-5 mb-5">
        <div className={CARD} style={CARD_STYLE}>
          <h2 className="font-bold text-lg tracking-tight mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <NextLink key={a.label} href={a.href}>
                <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-[1.5px] border-slate-200/20 text-center transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = a.color; (e.currentTarget as HTMLElement).style.backgroundColor = `${a.color}0d` }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; (e.currentTarget as HTMLElement).style.backgroundColor = "" }}>
                  <span style={{ color: a.color }}>{a.icon}</span>
                  <p className="text-xs font-semibold text-foreground">{a.label}</p>
                </div>
              </NextLink>
            ))}
          </div>
        </div>

        <div className={CARD} style={CARD_STYLE}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg tracking-tight">Upcoming Events</h2>
            <NextLink href="/dashboard/events" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">View all <ArrowRight size={14} /></NextLink>
          </div>
          <div className="flex flex-col gap-3">
            {upcomingEvents.length === 0 && <p className="text-sm text-muted-foreground">No upcoming events right now.</p>}
            {upcomingEvents.map((e) => {
              const reg = registrations.find((r) => r.event?._id === e._id)
              return (
                <div key={e._id} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200/18 flex-wrap">
                  <div>
                    <p className="font-bold text-sm">{e.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Calendar size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{e.venue}</span>
                    </div>
                  </div>
                  {reg ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "rgba(18,124,113,0.1)", color: "#127C71" }}><CheckCircle size={11} /> Registered</span>
                  ) : (
                    <NextLink href="/dashboard/events" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors">Register</NextLink>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-5">
        <div className={CARD} style={CARD_STYLE}>
          <h2 className="font-bold text-lg tracking-tight mb-0.5">Profile Completion</h2>
          <p className="text-sm text-muted-foreground mb-4">A complete profile gets more visibility with mentors and event organisers.</p>
          {(() => {
            const fields = [user?.profilePhoto, user?.bio, user?.organization, user?.phone, user?.username]
            const filled = fields.filter(Boolean).length
            const pct = Math.round(((filled + 2) / (fields.length + 2)) * 100)
            const missing = [!user?.profilePhoto && "Add profile photo", !user?.bio && "Complete bio", !user?.organization && "Add organization"].filter(Boolean)
            return (
              <>
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">{pct}% complete</p>
                    <NextLink href="/dashboard/profile" className="text-sm font-semibold text-primary hover:underline">Complete now →</NextLink>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(148,163,184,0.18)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #127C71aa, #127C71)" }} />
                  </div>
                </div>
                {missing.map((item) => (<div key={String(item)} className="flex items-center gap-2 mt-2"><div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "rgba(148,163,184,0.5)" }} /><p className="text-sm text-muted-foreground">{item}</p></div>))}
              </>
            )
          })()}
        </div>

        <div className={CARD} style={CARD_STYLE}>
          <h2 className="font-bold text-lg tracking-tight mb-4">My Recent Registrations</h2>
          <div>
            {recentRegs.length === 0 && <p className="text-sm text-muted-foreground">No registrations yet. <NextLink href="/dashboard/events" className="text-primary font-semibold hover:underline">Browse events →</NextLink></p>}
            {recentRegs.map((r, i) => (
              <div key={r._id} className={`flex items-start gap-4 py-3 ${i < recentRegs.length - 1 ? "border-b border-slate-200/12" : ""}`}>
                <div className="mt-0.5 flex-shrink-0"><CheckCircle size={18} color="#127C71" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug">{r.event?.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.status} · {new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

DashboardOverviewPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default DashboardOverviewPage
