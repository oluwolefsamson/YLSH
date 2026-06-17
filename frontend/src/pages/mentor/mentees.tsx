import React from 'react'
import { Users, Calendar, Star, Loader2 } from 'lucide-react'
import { MentorLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useMyMentees } from '@/services/hooks/mentors/mentors'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const COLORS = ['#127C71', '#082F49', '#7C3AED', '#D97706', '#B91C1C', '#0891B2', '#059669']

const StarRating: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={13} className={i < Math.floor(value) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
    ))}
  </div>
)

const MenteesPage: NextPageWithLayout = () => {
  const { data: mentees = [], isLoading } = useMyMentees()

  return (
    <div>
      <PageHeader eyebrow="Mentees" title="My Mentees" subtitle="View all participants you have mentored and track their progress." icon={<Users size={14} />} />

      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : mentees.length === 0 ? (
        <div className={CARD} style={CARD_STYLE}>
          <p className="text-sm text-muted-foreground py-10 text-center">No mentees yet. Once participants book sessions with you, they&apos;ll appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mentees.map((entry, idx) => {
            const { user, totalSessions, completedSessions, lastSession, status } = entry
            const color = COLORS[idx % COLORS.length]
            const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
            return (
              <div key={user._id} className={cn('flex flex-col', CARD)} style={CARD_STYLE}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden" style={{ width: 52, height: 52, backgroundColor: color }}>
                    {user.profilePhoto
                      ? <img src={user.profilePhoto} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full object-cover" />
                      : initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-muted-foreground">{user.organization || user.state || 'Participant'}</p>
                      </div>
                      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', status === 'active' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground')}>
                        {status === 'active' ? 'Active' : 'Completed'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {totalSessions} session{totalSessions !== 1 ? 's' : ''} · {completedSessions} completed
                      {lastSession ? ` · Last: ${new Date(lastSession).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                    </span>
                  </div>
                  {completedSessions > 0 && (
                    <div className="flex items-center gap-2">
                      <StarRating value={Math.min(5, Math.round((completedSessions / totalSessions) * 5))} />
                      <span className="text-xs text-muted-foreground">{completedSessions} completed</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users size={13} /> {user.email}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

MenteesPage.getLayout = (page) => <MentorLayout>{page}</MentorLayout>
export default MenteesPage
