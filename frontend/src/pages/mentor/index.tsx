import React from 'react'
import NextLink from 'next/link'
import { Users, Calendar, Star, CheckCircle, Video, Hourglass, LayoutDashboard, Loader2 } from 'lucide-react'
import { MentorLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { useMentorStats } from '@/services/hooks/mentors/mentors'
import { useMySessions } from '@/services/hooks/sessions/sessions'
import { useMyProfile } from '@/services/hooks/users/users'
import type { User } from '@/services/endpoints/users/users'
import { CARD, CARD_STYLE, ACCENT_CARD, ACCENT_CARD_STYLE } from '@/utils/card-styles'

const MentorOverviewPage: NextPageWithLayout = () => {
  const { data: user } = useMyProfile()
  const { data: statsData, isLoading: loadingStats } = useMentorStats()
  const { data: sessions = [], isLoading: loadingSessions } = useMySessions()

  const stats = statsData ?? { totalMentees: 0, sessionsThisMonth: 0, rating: 0, totalCompleted: 0 }
  const upcoming = sessions.filter((s) => s.status === 'scheduled').slice(0, 3)
  const recentActivity = [...sessions]
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
    .slice(0, 4)

  const firstName = user?.firstName ?? 'Mentor'

  return (
    <div>
      <PageHeader
        eyebrow="Mentor Portal"
        title={`Welcome back, ${firstName}!`}
        subtitle="Manage your mentee sessions, availability, and impact from your mentor portal."
        icon={<LayoutDashboard size={14} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total mentees" value={loadingStats ? '–' : String(stats.totalMentees)} icon={<Users size={20} />} progress={Math.min((stats.totalMentees / 50) * 100, 100)} />
        <StatCard label="Sessions this month" value={loadingStats ? '–' : String(stats.sessionsThisMonth)} icon={<Calendar size={20} />} progress={Math.min((stats.sessionsThisMonth / 20) * 100, 100)} accent="#3b82f6" />
        <StatCard label="Average rating" value={loadingStats ? '–' : stats.rating > 0 ? stats.rating.toFixed(1) : 'New'} icon={<Star size={20} />} progress={stats.rating > 0 ? (stats.rating / 5) * 100 : 0} accent="#f59e0b" />
        <StatCard label="Sessions completed" value={loadingStats ? '–' : String(stats.totalCompleted)} icon={<CheckCircle size={20} />} progress={100} accent="#22c55e" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-5">
        {/* Upcoming Sessions */}
        <div className={CARD} style={CARD_STYLE}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-bold text-slate-800">Upcoming Sessions</p>
            <NextLink href="/mentor/sessions" className="text-xs font-semibold text-slate-400 hover:text-brand-teal transition-colors">View all →</NextLink>
          </div>
          {loadingSessions ? (
            <div className="flex items-center justify-center py-8"><Loader2 size={20} className="animate-spin text-brand-teal" /></div>
          ) : upcoming.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">No upcoming sessions. Check your availability settings.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {upcoming.map((session) => {
                const mentee = session.mentee as User
                const menteeName = mentee ? `${mentee.firstName} ${mentee.lastName}` : 'Mentee'
                const initials = mentee ? `${mentee.firstName[0]}${mentee.lastName[0]}`.toUpperCase() : 'M'
                return (
                  <div key={session._id} className="flex items-center justify-between gap-4 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 text-white grid place-items-center text-xs font-bold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-800">{menteeName}</p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{session.topic}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(session.scheduledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {new Date(session.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <NextLink href="/mentor/sessions" className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-teal/10 text-brand-teal text-xs font-semibold hover:bg-brand-teal/20 transition-colors flex-shrink-0">
                      <Video size={13} /> Join
                    </NextLink>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Activity — accent panel */}
        <div className={ACCENT_CARD} style={ACCENT_CARD_STYLE}>
          <p className="text-base font-bold mb-4">Recent Activity</p>
          {loadingSessions ? (
            <div className="flex items-center justify-center py-8"><Loader2 size={20} className="animate-spin text-white/70" /></div>
          ) : recentActivity.length === 0 ? (
            <p className="text-sm text-white/60 py-4 text-center">No recent activity.</p>
          ) : (
            <div className="flex flex-col gap-0">
              {recentActivity.map((session) => {
                const mentee = session.mentee as User
                const menteeName = mentee ? `${mentee.firstName} ${mentee.lastName}` : 'a mentee'
                const done = session.status === 'completed'
                const text = done
                  ? `Completed with ${menteeName}`
                  : session.status === 'cancelled'
                  ? `Cancelled with ${menteeName}`
                  : `Upcoming with ${menteeName}`
                const meta = new Date(session.scheduledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                return (
                  <div key={session._id} className="flex items-start gap-3 py-3 border-b border-white/10 last:border-0">
                    <div className="w-7 h-7 rounded-lg bg-white/15 grid place-items-center flex-shrink-0 mt-0.5">
                      {done
                        ? <CheckCircle size={14} className="text-emerald-300" />
                        : <Hourglass size={14} className="text-amber-300" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white leading-snug">{text}</p>
                      <p className="text-xs text-white/60 mt-0.5">{meta}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

MentorOverviewPage.getLayout = (page) => <MentorLayout>{page}</MentorLayout>
export default MentorOverviewPage
