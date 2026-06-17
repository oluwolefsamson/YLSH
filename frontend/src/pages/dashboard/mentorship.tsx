import React, { useState } from 'react'
import { Users, Calendar, CheckCircle, Video, Hourglass, Star, Briefcase, X, ExternalLink } from 'lucide-react'
import { DashboardLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const mentors = [
  { id: 1, name: 'Dr. Ngozi Adeyemi', role: 'Chief Technology Officer', company: 'Flutterwave', category: 'Tech & Engineering', rating: 4.9, sessions: 142, bio: 'Former Google engineer turned fintech CTO. Passionate about growing the next generation of African tech leaders.', availability: 'Weekends', initials: 'NA', color: '#127C71' },
  { id: 2, name: 'Emeka Okafor', role: 'Venture Partner', company: 'Ventures Platform', category: 'Entrepreneurship', rating: 4.8, sessions: 98, bio: 'Early-stage investor who has backed 30+ African startups. Expert in business model design and fundraising.', availability: 'Weekdays (PM)', initials: 'EO', color: '#082F49' },
  { id: 3, name: 'Fatima Al-Hassan', role: 'Senior Policy Advisor', company: 'African Union Commission', category: 'Policy & Governance', rating: 4.7, sessions: 65, bio: 'Policy expert specializing in youth development, climate action, and continental governance frameworks.', availability: 'Flexible', initials: 'FA', color: '#7C3AED' },
  { id: 4, name: 'Chidi Nwosu', role: 'Head of Growth', company: 'Paystack', category: 'Marketing & Growth', rating: 4.6, sessions: 77, bio: 'Growth practitioner who scaled Paystack from 0 to 200k merchants. Expert in product-led growth and GTM strategy.', availability: 'Thursdays', initials: 'CN', color: '#D97706' },
]

const mySessions = [
  { id: 1, mentorName: 'Dr. Ngozi Adeyemi', topic: 'Career roadmap in software engineering', date: 'Jun 20, 2026', time: '3:00 PM', status: 'upcoming', mode: 'Video call', meetLink: 'https://meet.google.com/abc-defg-hij' },
  { id: 2, mentorName: 'Emeka Okafor', topic: 'Pitching to investors for the first time', date: 'May 28, 2026', time: '11:00 AM', status: 'completed', mode: 'Video call', meetLink: '' },
  { id: 3, mentorName: 'Fatima Al-Hassan', topic: 'Writing policy briefs that get noticed', date: 'May 10, 2026', time: '2:00 PM', status: 'completed', mode: 'Video call', meetLink: '' },
]

const MENTOR_TABS = ['All', 'Tech & Engineering', 'Entrepreneurship', 'Policy & Governance', 'Marketing & Growth']

type Session = typeof mySessions[0]

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={13} className={i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
    ))}
  </div>
)

const MentorshipPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const [bookedIds, setBookedIds] = useState<Set<number>>(new Set())
  const [joinModal, setJoinModal] = useState<Session | null>(null)
  const upcomingCount = mySessions.filter((s) => s.status === 'upcoming').length
  const completedCount = mySessions.filter((s) => s.status === 'completed').length

  const filteredMentors = tab === 0 ? mentors : mentors.filter((m) => m.category === MENTOR_TABS[tab])

  return (
    <div>
      <PageHeader
        eyebrow="Mentorship"
        title="Mentorship"
        subtitle="Discover mentors, book one-on-one sessions, and track your mentorship journey across career, entrepreneurship, policy, and more."
        icon={<Users size={14} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Sessions" value={String(mySessions.length)} icon={<Users size={20} />} progress={100} />
        <StatCard label="Upcoming" value={String(upcomingCount)} icon={<Calendar size={20} />} progress={upcomingCount / mySessions.length * 100} accent="#3b82f6" />
        <StatCard label="Completed" value={String(completedCount)} icon={<CheckCircle size={20} />} progress={completedCount / mySessions.length * 100} accent="#22c55e" />
      </div>

      <div className={cn(CARD, 'mb-5')} style={CARD_STYLE}>
        <h2 className="text-xl font-bold mb-4">My Sessions</h2>
        <div className="flex flex-col gap-3">
          {mySessions.map((session) => (
            <div key={session.id} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200/18 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="font-bold">{session.topic}</p>
                <p className="text-sm text-muted-foreground mb-2">with {session.mentorName}</p>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{session.date} · {session.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Video size={13} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{session.mode}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold', session.status === 'upcoming' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700')}>
                  {session.status === 'upcoming' ? <Hourglass size={11} /> : <CheckCircle size={11} />}
                  {session.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                </span>
                {session.status === 'upcoming' && (
                  <button
                    onClick={() => setJoinModal(session)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
                  >
                    <Video size={14} /> Join
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={CARD} style={CARD_STYLE}>
        <h2 className="text-xl font-bold mb-4">Discover Mentors</h2>
        <div className="flex gap-1 border-b border-slate-200/18 mb-5 overflow-x-auto">
          {MENTOR_TABS.map((label, i) => (
            <button key={label} onClick={() => setTab(i)} className={cn('px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors whitespace-nowrap', tab === i ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              {label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMentors.map((mentor) => (
            <div key={mentor.id} className="flex flex-col p-5 rounded-xl border border-slate-200/18">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-13 h-13 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ width: 52, height: 52, backgroundColor: mentor.color }}>
                  {mentor.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold">{mentor.name}</p>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Briefcase size={13} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{mentor.role} · {mentor.company}</span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">{mentor.category}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3 flex-1">{mentor.bio}</p>
              <hr className="border-border mb-3" />
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StarRating rating={mentor.rating} />
                  <span className="text-xs text-muted-foreground">{mentor.rating} ({mentor.sessions} sessions)</span>
                </div>
                <span className="text-xs text-muted-foreground">Available: {mentor.availability}</span>
              </div>
              <button
                onClick={() => setBookedIds((prev) => { const s = new Set(prev); s.add(mentor.id); return s })}
                disabled={bookedIds.has(mentor.id)}
                className={cn('w-full h-10 rounded-full font-bold text-sm transition-colors flex items-center justify-center gap-2', bookedIds.has(mentor.id) ? 'bg-green-100 text-green-700 cursor-default' : 'bg-primary text-white hover:bg-[#0d5c54]')}
              >
                {bookedIds.has(mentor.id) ? <><CheckCircle size={16} /> Request sent</> : 'Book Session'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Join Session Modal */}
      {joinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setJoinModal(null)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">Join Session</h3>
              <button onClick={() => setJoinModal(null)} className="p-1.5 rounded-lg hover:bg-muted"><X size={18} /></button>
            </div>
            <div className="p-4 rounded-xl bg-muted mb-4">
              <p className="font-bold">{joinModal.topic}</p>
              <p className="text-sm text-muted-foreground">with {joinModal.mentorName}</p>
              <div className="flex items-center gap-2 mt-2">
                <Calendar size={13} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{joinModal.date} · {joinModal.time}</span>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-primary/20 mb-5" style={{ backgroundColor: 'rgba(18,124,113,0.05)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Video size={16} className="text-primary" />
                <p className="text-sm font-semibold text-primary">Google Meet</p>
              </div>
              <p className="font-mono text-sm text-muted-foreground">{joinModal.meetLink}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setJoinModal(null)} className="flex-1 h-10 rounded-full border-2 border-slate-300 font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
              <a
                href={joinModal.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setJoinModal(null)}
                className="flex-1 h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink size={14} /> Join Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

MentorshipPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default MentorshipPage
