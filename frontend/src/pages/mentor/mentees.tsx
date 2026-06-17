import React from 'react'
import { Users, Calendar, MessageSquare, Star } from 'lucide-react'
import { MentorLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import type { Mentee } from '@/types'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const mentees: Mentee[] = [
  { id: 1, name: 'Amina Bello', role: 'Student · ABU Zaria', sessions: 3, lastSession: 'Jun 14, 2026', rating: 5, status: 'active', initials: 'AB', color: '#127C71' },
  { id: 2, name: 'Kelechi Obi', role: 'Graduate · University of Lagos', sessions: 2, lastSession: 'Jun 10, 2026', rating: 4.5, status: 'active', initials: 'KO', color: '#082F49' },
  { id: 3, name: 'Zahra Musa', role: 'Research Assistant · BUK', sessions: 1, lastSession: 'Jun 5, 2026', rating: null, status: 'active', initials: 'ZM', color: '#7C3AED' },
  { id: 4, name: 'Tunde Adeyemi', role: 'Entrepreneur · Lagos', sessions: 4, lastSession: 'May 28, 2026', rating: 5, status: 'completed', initials: 'TA', color: '#D97706' },
  { id: 5, name: 'Ngozi Eze', role: 'Developer · Remote', sessions: 2, lastSession: 'May 20, 2026', rating: 4, status: 'completed', initials: 'NE', color: '#059669' },
]

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={13} className={i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
    ))}
  </div>
)

const MenteesPage: NextPageWithLayout = () => {
  return (
    <div>
      <PageHeader eyebrow="Mentees" title="My Mentees" subtitle="View all participants you have mentored and track their progress." icon={<Users size={14} />} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentees.map((mentee) => (
          <div key={mentee.id} className={cn('flex flex-col', CARD)} style={CARD_STYLE}>
            <div className="flex items-start gap-3 mb-3">
              <div className="rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ width: 52, height: 52, backgroundColor: mentee.color }}>
                {mentee.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold">{mentee.name}</p>
                    <p className="text-sm text-muted-foreground">{mentee.role}</p>
                  </div>
                  <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', mentee.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground')}>
                    {mentee.status === 'active' ? 'Active' : 'Completed'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mb-3">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{mentee.sessions} session{mentee.sessions !== 1 ? 's' : ''} · Last: {mentee.lastSession}</span>
              </div>
              {mentee.rating && (
                <div className="flex items-center gap-2">
                  <StarRating rating={mentee.rating} />
                  <span className="text-xs text-muted-foreground">{mentee.rating}/5</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-auto">
              <button className="flex-1 h-9 rounded-full bg-primary text-white text-sm font-bold hover:bg-[#0d5c54] transition-colors">Book session</button>
              <button className="flex items-center gap-1.5 h-9 px-4 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors">
                <MessageSquare size={14} /> Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

MenteesPage.getLayout = (page) => <MentorLayout>{page}</MentorLayout>
export default MenteesPage
