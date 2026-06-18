import React, { useState } from 'react'
import { Users, Calendar, CheckCircle, Video, Hourglass, Star, Briefcase, X, ExternalLink, Loader2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useMentors } from '@/services/hooks/mentors/mentors'
import { useMySessions } from '@/services/hooks/sessions/sessions'
import { useRequestSession } from '@/services/hooks/mentors/mentors'
import type { MentorProfile } from '@/services/endpoints/mentors/mentors'
import type { MentorSession } from '@/services/endpoints/sessions/sessions'
import type { User } from '@/services/endpoints/users/users'
import { toast } from 'sonner'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const MENTOR_TABS = ['All', 'Tech & Engineering', 'Entrepreneurship', 'Policy & Governance', 'Marketing & Growth', 'General']

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={13} className={i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
    ))}
  </div>
)

function getMentorUser(profile: MentorProfile): User | null {
  return typeof profile.user === 'object' ? profile.user as User : null
}

function getInitials(user: User | null): string {
  if (!user) return '??'
  return `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
}

const COLORS = ['#127C71', '#082F49', '#7C3AED', '#D97706', '#B91C1C', '#0891B2']

const MENTOR_TAB_VALUES = ['all', 'Tech & Engineering', 'Entrepreneurship', 'Policy & Governance', 'Marketing & Growth', 'General']

const MentorshipPage: NextPageWithLayout = () => {
  const [tabValue, setTabValue] = useState('all')
  const [bookModal, setBookModal] = useState<MentorProfile | null>(null)
  const [joinModal, setJoinModal] = useState<MentorSession | null>(null)
  const [topic, setTopic] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')

  const selectedCategory = tabValue === 'all' ? undefined : tabValue
  const { data: mentorsData, isLoading: loadingMentors } = useMentors({ category: selectedCategory })
  const { data: sessions = [], isLoading: loadingSessions } = useMySessions()
  const requestSession = useRequestSession()

  const mentors = mentorsData?.data ?? []
  const upcoming = sessions.filter((s) => s.status === 'scheduled')
  const completed = sessions.filter((s) => s.status === 'completed')

  const handleBook = () => {
    if (!bookModal || !topic.trim() || !scheduledAt) {
      toast.error('Please fill in all fields')
      return
    }
    const mentorUser = getMentorUser(bookModal)
    const mentorId = typeof bookModal.user === 'string' ? bookModal.user : mentorUser?._id ?? ''
    requestSession.mutate(
      { mentorId, topic, scheduledAt },
      {
        onSuccess: () => {
          toast.success('Session request sent!')
          setBookModal(null)
          setTopic('')
          setScheduledAt('')
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to request session'
          toast.error(msg)
        },
      }
    )
  }

  return (
    <div>
      <PageHeader
        eyebrow="Mentorship"
        title="Mentorship"
        subtitle="Discover mentors, book one-on-one sessions, and track your mentorship journey across career, entrepreneurship, policy, and more."
        icon={<Users size={14} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Sessions" value={String(sessions.length)} icon={<Users size={20} />} progress={100} />
        <StatCard label="Upcoming" value={String(upcoming.length)} icon={<Calendar size={20} />} progress={sessions.length ? (upcoming.length / sessions.length) * 100 : 0} accent="#3b82f6" />
        <StatCard label="Completed" value={String(completed.length)} icon={<CheckCircle size={20} />} progress={sessions.length ? (completed.length / sessions.length) * 100 : 0} accent="#22c55e" />
      </div>

      {/* My Sessions */}
      <div className={cn(CARD, 'mb-5')} style={CARD_STYLE}>
        <h2 className="text-xl font-bold mb-4">My Sessions</h2>
        {loadingSessions ? (
          <div className="flex items-center justify-center py-10"><Loader2 size={24} className="animate-spin text-primary" /></div>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No sessions yet. Book a mentor below to get started.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session) => {
              const mentorUser = session.mentor as User
              const mentorName = mentorUser ? `${mentorUser.firstName} ${mentorUser.lastName}` : 'Mentor'
              return (
                <div key={session._id} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200/18 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">{session.topic}</p>
                    <p className="text-sm text-muted-foreground mb-2">with {mentorName}</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{new Date(session.scheduledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {new Date(session.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Video size={13} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Video call · {session.duration} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold',
                      session.status === 'scheduled' ? 'bg-amber-100 text-amber-700' :
                      session.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500')}>
                      {session.status === 'scheduled' ? <Hourglass size={11} /> : <CheckCircle size={11} />}
                      {session.status === 'scheduled' ? 'Upcoming' : session.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </span>
                    {session.status === 'scheduled' && session.meetLink && (
                      <button onClick={() => setJoinModal(session)} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors">
                        <Video size={14} /> Join
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Discover Mentors */}
      <div className={CARD} style={CARD_STYLE}>
        <h2 className="text-xl font-bold mb-4">Discover Mentors</h2>
        <div className="mb-5">
          <Select value={tabValue} onValueChange={setTabValue}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MENTOR_TABS.map((label, i) => (
                <SelectItem key={label} value={MENTOR_TAB_VALUES[i]}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loadingMentors ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-primary" /></div>
        ) : mentors.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center">No mentors available in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentors.map((mentor, idx) => {
              const user = getMentorUser(mentor)
              const initials = getInitials(user)
              const color = COLORS[idx % COLORS.length]
              const name = user ? `${user.firstName} ${user.lastName}` : 'Mentor'
              const bio = mentor.bio || user?.bio || ''
              return (
                <div key={mentor._id} className="flex flex-col p-5 rounded-xl border border-slate-200/18">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-13 h-13 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ width: 52, height: 52, backgroundColor: color }}>
                      {user?.profilePhoto ? <img src={user.profilePhoto} alt={name} className="w-full h-full rounded-full object-cover" /> : initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold">{name}</p>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Briefcase size={13} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{mentor.headline || 'Mentor'}{user?.organization ? ` · ${user.organization}` : ''}</span>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">{mentor.category}</span>
                    </div>
                  </div>
                  {bio && <p className="text-sm text-muted-foreground mb-3 flex-1 line-clamp-3">{bio}</p>}
                  <hr className="border-border mb-3" />
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <StarRating rating={mentor.rating} />
                      <span className="text-xs text-muted-foreground">{mentor.rating > 0 ? mentor.rating.toFixed(1) : 'New'} ({mentor.totalSessions} sessions)</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Available: {mentor.availability}</span>
                  </div>
                  <button
                    onClick={() => setBookModal(mentor)}
                    className="w-full h-10 rounded-full font-bold text-sm bg-primary text-white hover:bg-[#0d5c54] transition-colors flex items-center justify-center gap-2"
                  >
                    Book Session
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Book Session Modal */}
      {bookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setBookModal(null)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">Book a Session</h3>
              <button onClick={() => setBookModal(null)} className="p-1.5 rounded-lg hover:bg-muted"><X size={18} /></button>
            </div>
            {(() => { const u = getMentorUser(bookModal); return u ? <p className="text-sm text-muted-foreground mb-4">with <span className="font-semibold text-foreground">{u.firstName} {u.lastName}</span></p> : null })()}
            <div className="flex flex-col gap-4 mb-5">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Session topic <span className="text-red-500">*</span></label>
                <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Career roadmap in software engineering" className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Preferred date & time <span className="text-red-500">*</span></label>
                <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setBookModal(null)} className="flex-1 h-10 rounded-full border-2 border-slate-300 font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleBook} disabled={requestSession.isPending || !topic.trim() || !scheduledAt} className="flex-1 h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {requestSession.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}

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
              <p className="text-sm text-muted-foreground">with {(joinModal.mentor as User)?.firstName} {(joinModal.mentor as User)?.lastName}</p>
              <div className="flex items-center gap-2 mt-2">
                <Calendar size={13} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{new Date(joinModal.scheduledAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-primary/20 mb-5" style={{ backgroundColor: 'rgba(18,124,113,0.05)' }}>
              <div className="flex items-center gap-2 mb-2"><Video size={16} className="text-primary" /><p className="text-sm font-semibold text-primary">Google Meet</p></div>
              <p className="font-mono text-sm text-muted-foreground">{joinModal.meetLink}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setJoinModal(null)} className="flex-1 h-10 rounded-full border-2 border-slate-300 font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
              <a href={joinModal.meetLink} target="_blank" rel="noopener noreferrer" onClick={() => setJoinModal(null)} className="flex-1 h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] transition-colors flex items-center justify-center gap-2">
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
