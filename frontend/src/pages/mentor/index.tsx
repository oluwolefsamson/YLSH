import React from 'react'
import NextLink from 'next/link'
import { Users, Calendar, Star, CheckCircle, Video, Hourglass, LayoutDashboard } from 'lucide-react'
import { MentorLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const stats = [
  { label: 'Total mentees', value: '24', progress: 80, icon: <Users size={20} /> },
  { label: 'Sessions this month', value: '11', progress: 73, icon: <Calendar size={20} /> },
  { label: 'Average rating', value: '4.9', progress: 98, icon: <Star size={20} /> },
  { label: 'Sessions completed', value: '142', progress: 100, icon: <CheckCircle size={20} /> },
]

const upcomingSessions = [
  { name: 'Amina Bello', topic: 'Career roadmap in software engineering', date: 'Jun 20, 2026', time: '3:00 PM' },
  { name: 'Kelechi Obi', topic: 'Preparing for a product management role', date: 'Jun 22, 2026', time: '11:00 AM' },
  { name: 'Zahra Musa', topic: 'Transitioning from academia to industry', date: 'Jun 25, 2026', time: '5:00 PM' },
]

const recentActivity = [
  { text: 'Session completed with Amina Bello', meta: '2 days ago', done: true },
  { text: 'New booking request from Tunde Adeyemi', meta: '3 days ago', done: false },
  { text: 'Session completed with Ngozi Eze', meta: '5 days ago', done: true },
  { text: 'Profile updated — availability changed', meta: 'Last week', done: true },
]

const MentorOverviewPage: NextPageWithLayout = () => {
  return (
    <div>
      <PageHeader eyebrow="Mentor Portal" title="Welcome back, Dr. Ngozi!" subtitle="Manage your mentee sessions, availability, and impact from your mentor portal." icon={<LayoutDashboard size={14} />} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} icon={card.icon} progress={card.progress} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-5">
        <div className={CARD} style={CARD_STYLE}>
          <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
          <div className="flex flex-col gap-3">
            {upcomingSessions.map((session) => (
              <div key={session.name} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200/18 flex-wrap">
                <div>
                  <p className="font-bold text-sm">{session.name}</p>
                  <p className="text-sm text-muted-foreground">{session.topic}</p>
                  <p className="text-xs text-muted-foreground">{session.date} · {session.time}</p>
                </div>
                <NextLink href="/mentor/sessions" className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors flex-shrink-0">
                  <Video size={14} /> Join
                </NextLink>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 md:p-6 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, rgba(8,47,73,0.98) 0%, rgba(18,124,113,0.98) 100%)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }}>
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="flex flex-col gap-3">
            {recentActivity.map((item) => (
              <div key={item.text} className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {item.done
                      ? <CheckCircle size={16} style={{ color: 'rgba(134,239,172,0.9)' }} />
                      : <Hourglass size={16} style={{ color: 'rgba(253,186,116,0.9)' }} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.text}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.meta}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

MentorOverviewPage.getLayout = (page) => <MentorLayout>{page}</MentorLayout>
export default MentorOverviewPage
