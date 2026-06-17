import React, { useState } from 'react'
import { Calendar, CheckCircle, Video, XCircle, Clock } from 'lucide-react'
import { MentorLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import type { MentorPortalSession, MentorSessionStatus } from '@/types'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const sessions: MentorPortalSession[] = [
  { id: 1, mentee: 'Amina Bello', topic: 'Career roadmap in software engineering', date: 'Jun 20, 2026', time: '3:00 PM', duration: '60 min', status: 'upcoming', outcome: null },
  { id: 2, mentee: 'Kelechi Obi', topic: 'Preparing for a product management role', date: 'Jun 22, 2026', time: '11:00 AM', duration: '45 min', status: 'upcoming', outcome: null },
  { id: 3, mentee: 'Zahra Musa', topic: 'Transitioning from academia to industry', date: 'Jun 25, 2026', time: '5:00 PM', duration: '60 min', status: 'upcoming', outcome: null },
  { id: 4, mentee: 'Tunde Adeyemi', topic: 'Pitching to investors for the first time', date: 'May 28, 2026', time: '2:00 PM', duration: '90 min', status: 'completed', outcome: 'Mentee refined their pitch deck. Follow-up in 2 weeks.' },
  { id: 5, mentee: 'Ngozi Eze', topic: 'Building a portfolio from scratch', date: 'May 20, 2026', time: '10:00 AM', duration: '60 min', status: 'completed', outcome: 'Created action plan for GitHub portfolio projects.' },
  { id: 6, mentee: 'Sule Ibrahim', topic: 'Negotiating first tech job offer', date: 'May 5, 2026', time: '4:00 PM', duration: '30 min', status: 'cancelled', outcome: null },
]

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled']

const statusBadge: Record<MentorSessionStatus, string> = { upcoming: 'bg-amber-100 text-amber-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' }
const statusIcon: Record<MentorSessionStatus, React.ReactNode> = { upcoming: <Clock size={11} />, completed: <CheckCircle size={11} />, cancelled: <XCircle size={11} /> }

const MentorSessionsPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const filtered = tab === 0 ? sessions : tab === 1 ? sessions.filter((s) => s.status === 'upcoming') : tab === 2 ? sessions.filter((s) => s.status === 'completed') : sessions.filter((s) => s.status === 'cancelled')
  const tabCounts = [sessions.length, sessions.filter((s) => s.status === 'upcoming').length, sessions.filter((s) => s.status === 'completed').length, sessions.filter((s) => s.status === 'cancelled').length]

  return (
    <div>
      <PageHeader eyebrow="Sessions" title="My Sessions" subtitle="View, join, and record outcomes for all your mentorship sessions." icon={<Calendar size={14} />} />

      <div className={CARD} style={CARD_STYLE}>
        <div className="flex gap-1 border-b border-slate-200/18 mb-5">
          {TABS.map((label, i) => (
            <button key={label} onClick={() => setTab(i)} className={cn('px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors whitespace-nowrap', tab === i ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              {label} ({tabCounts[i]})
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((session) => (
            <div key={session.id} className={cn('p-4 rounded-xl border border-slate-200/18', session.status === 'cancelled' ? 'opacity-60' : '')}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-bold">{session.mentee}</p>
                    <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize', statusBadge[session.status])}>
                      {statusIcon[session.status]}{session.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{session.topic}</p>
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5"><Calendar size={13} className="text-muted-foreground" /><span className="text-xs text-muted-foreground">{session.date} · {session.time}</span></div>
                    <div className="flex items-center gap-1.5"><Clock size={13} className="text-muted-foreground" /><span className="text-xs text-muted-foreground">{session.duration}</span></div>
                  </div>
                  {session.outcome && (
                    <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(18,124,113,0.06)', border: '1px solid rgba(18,124,113,0.15)' }}>
                      <p className="text-sm font-semibold text-primary mb-0.5">Outcome:</p>
                      <p className="text-sm text-muted-foreground">{session.outcome}</p>
                    </div>
                  )}
                </div>
                {session.status === 'upcoming' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-[#0d5c54] transition-colors">
                      <Video size={14} /> Join
                    </button>
                    <button className="px-4 py-2 rounded-full border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">Cancel</button>
                  </div>
                )}
                {session.status === 'completed' && !session.outcome && (
                  <button className="px-4 py-2 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors flex-shrink-0">Add outcome</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

MentorSessionsPage.getLayout = (page) => <MentorLayout>{page}</MentorLayout>
export default MentorSessionsPage
