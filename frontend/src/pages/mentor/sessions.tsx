import React, { useState } from 'react'
import { Calendar, CheckCircle, Video, XCircle, Clock, Loader2, X } from 'lucide-react'
import { MentorLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useMySessions, useUpdateSessionStatus, useCancelSession, useAddOutcome } from '@/services/hooks/sessions/sessions'
import type { MentorSession, SessionStatus } from '@/services/endpoints/sessions/sessions'
import type { User } from '@/services/endpoints/users/users'
import { toast } from 'sonner'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled']

const statusBadge: Record<string, string> = {
  scheduled: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}
const statusIcon: Record<string, React.ReactNode> = {
  scheduled: <Clock size={11} />,
  completed: <CheckCircle size={11} />,
  cancelled: <XCircle size={11} />,
}
const statusLabel: Record<string, string> = {
  scheduled: 'Upcoming',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const MentorSessionsPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const [outcomeModal, setOutcomeModal] = useState<MentorSession | null>(null)
  const [outcomeText, setOutcomeText] = useState('')

  const { data: sessions = [], isLoading } = useMySessions()
  const updateStatus = useUpdateSessionStatus()
  const cancelMutation = useCancelSession()
  const addOutcomeMutation = useAddOutcome()

  const filtered = tab === 0 ? sessions
    : tab === 1 ? sessions.filter((s) => s.status === 'scheduled')
    : tab === 2 ? sessions.filter((s) => s.status === 'completed')
    : sessions.filter((s) => s.status === 'cancelled')

  const tabCounts = [
    sessions.length,
    sessions.filter((s) => s.status === 'scheduled').length,
    sessions.filter((s) => s.status === 'completed').length,
    sessions.filter((s) => s.status === 'cancelled').length,
  ]

  const handleMarkComplete = (session: MentorSession) => {
    updateStatus.mutate(
      { id: session._id, status: 'completed' as SessionStatus },
      { onSuccess: () => toast.success('Session marked as completed'), onError: () => toast.error('Failed to update session') }
    )
  }

  const handleCancel = (session: MentorSession) => {
    cancelMutation.mutate(session._id, {
      onSuccess: () => toast.success('Session cancelled'),
      onError: () => toast.error('Failed to cancel session'),
    })
  }

  const handleAddOutcome = () => {
    if (!outcomeModal || !outcomeText.trim()) return
    addOutcomeMutation.mutate(
      { id: outcomeModal._id, outcome: outcomeText },
      {
        onSuccess: () => { toast.success('Outcome saved'); setOutcomeModal(null); setOutcomeText('') },
        onError: () => toast.error('Failed to save outcome'),
      }
    )
  }

  return (
    <div>
      <PageHeader eyebrow="Sessions" title="My Sessions" subtitle="View, join, and record outcomes for all your mentorship sessions." icon={<Calendar size={14} />} />

      <div className={CARD} style={CARD_STYLE}>
        <div className="flex gap-1 border-b border-slate-200/18 mb-5 overflow-x-auto">
          {TABS.map((label, i) => (
            <button key={label} onClick={() => setTab(i)} className={cn('px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors whitespace-nowrap', tab === i ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              {label} ({tabCounts[i]})
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center">No sessions in this category.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((session) => {
              const mentee = session.mentee as User
              const menteeName = mentee ? `${mentee.firstName} ${mentee.lastName}` : 'Mentee'
              return (
                <div key={session._id} className={cn('p-4 rounded-xl border border-slate-200/18', session.status === 'cancelled' ? 'opacity-60' : '')}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold">{menteeName}</p>
                        <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold', statusBadge[session.status] ?? 'bg-muted text-muted-foreground')}>
                          {statusIcon[session.status]}{statusLabel[session.status] ?? session.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{session.topic}</p>
                      <div className="flex gap-4 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(session.scheduledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {new Date(session.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{session.duration} min</span>
                        </div>
                      </div>
                      {session.outcome && (
                        <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(18,124,113,0.06)', border: '1px solid rgba(18,124,113,0.15)' }}>
                          <p className="text-sm font-semibold text-primary mb-0.5">Outcome:</p>
                          <p className="text-sm text-muted-foreground">{session.outcome}</p>
                        </div>
                      )}
                    </div>
                    {session.status === 'scheduled' && (
                      <div className="flex gap-2 flex-shrink-0 flex-wrap">
                        {session.meetLink && (
                          <a href={session.meetLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-[#0d5c54] transition-colors">
                            <Video size={14} /> Join
                          </a>
                        )}
                        <button onClick={() => handleMarkComplete(session)} disabled={updateStatus.isPending} className="px-4 py-2 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors disabled:opacity-50">
                          Mark done
                        </button>
                        <button onClick={() => handleCancel(session)} disabled={cancelMutation.isPending} className="px-4 py-2 rounded-full border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50">Cancel</button>
                      </div>
                    )}
                    {session.status === 'completed' && !session.outcome && (
                      <button onClick={() => { setOutcomeModal(session); setOutcomeText('') }} className="px-4 py-2 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors flex-shrink-0">Add outcome</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {outcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOutcomeModal(null)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Record Outcome</h3>
              <button onClick={() => setOutcomeModal(null)} className="p-1.5 rounded-lg hover:bg-muted"><X size={18} /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Session with <strong>{(outcomeModal.mentee as User)?.firstName} {(outcomeModal.mentee as User)?.lastName}</strong> — {outcomeModal.topic}
            </p>
            <div className="mb-5">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Outcome notes <span className="text-red-500">*</span></label>
              <textarea value={outcomeText} onChange={(e) => setOutcomeText(e.target.value)} placeholder="Describe what was accomplished, next steps, and follow-up actions..." rows={4} className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setOutcomeModal(null)} className="flex-1 h-10 rounded-full border-2 border-slate-300 font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleAddOutcome} disabled={!outcomeText.trim() || addOutcomeMutation.isPending} className="flex-1 h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {addOutcomeMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Save outcome'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

MentorSessionsPage.getLayout = (page) => <MentorLayout>{page}</MentorLayout>
export default MentorSessionsPage
