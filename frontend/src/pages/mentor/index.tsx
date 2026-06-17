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

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

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
      <PageHeader eyebrow="Mentor Portal" title={`Welcome back, ${firstName}!`} subtitle="Manage your mentee sessions, availability, and impact from your mentor portal." icon={<LayoutDashboard size={14} />} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total mentees" value={loadingStats ? '—' : String(stats.totalMentees)} icon={<Users size={20} />} progress={Math.min((stats.totalMentees / 50) * 100, 100)} />
        <StatCard label="Sessions this month" value={loadingStats ? '—' : String(stats.sessionsThisMonth)} icon={<Calendar size={20} />} progress={Math.min((stats.sessionsThisMonth / 20) * 100, 100)} />
        <StatCard label="Average rating" value={loadingStats ? '—' : stats.rating > 0 ? stats.rating.toFixed(1) : 'New'} icon={<Star size={20} />} progress={stats.rating > 0 ? (stats.rating / 5) * 100 : 0} />
        <StatCard label="Sessions completed" value={loadingStats ? '—' : String(stats.totalCompleted)} icon={<CheckCircle size={20} />} progress={100} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-5">
        <div className={CARD} style={CARD_STYLE}>
          <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
          {loadingSessions ? (
            <div className="flex items-center justify-center py-8"><Loader2 size={20} className="animate-spin text-primary" /></div>
          ) : upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No upcoming sessions. Check your availability settings.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {upcoming.map((session) => {
                const mentee = session.mentee as User
                const menteeName = mentee ? `${mentee.firstName} ${mentee.lastName}` : 'Mentee'
                return (
                  <div key={session._id} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200/18 flex-wrap">
                    <div>
                      <p className="font-bold text-sm">{menteeName}</p>
                      <p className="text-sm text-muted-foreground">{session.topic}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.scheduledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {new Date(session.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <NextLink href="/mentor/sessions" className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors flex-shrink-0">
                      <Video size={14} /> Join
                    </NextLink>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="p-5 md:p-6 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, rgba(8,47,73,0.98) 0%, rgba(18,124,113,0.98) 100%)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }}>
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          {loadingSessions ? (
            <div className="flex items-center justify-center py-8"><Loader2 size={20} className="animate-spin" style={{ color: 'rgba(255,255,255,0.7)' }} /></div>
          ) : recentActivity.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>No recent activity.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentActivity.map((session) => {
                const mentee = session.mentee as User
                const menteeName = mentee ? `${mentee.firstName} ${mentee.lastName}` : 'a mentee'
                const done = session.status === 'completed'
                const text = done
                  ? `Session completed with ${menteeName}`
                  : session.status === 'cancelled'
                  ? `Session cancelled with ${menteeName}`
                  : `Upcoming session with ${menteeName}`
                const meta = new Date(session.scheduledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                return (
                  <div key={session._id} className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {done
                          ? <CheckCircle size={16} style={{ color: 'rgba(134,239,172,0.9)' }} />
                          : <Hourglass size={16} style={{ color: 'rgba(253,186,116,0.9)' }} />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{text}</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{meta}</p>
                      </div>
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
