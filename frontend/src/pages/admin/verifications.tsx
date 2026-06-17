import React, { useState } from 'react'
import { UserCheck, Search, CheckCircle, Clock, XCircle, Calendar, Mail, Loader2 } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { toast } from 'sonner'
import { usePendingMentors, useApproveMentor, useDeclineMentor } from '@/services/hooks/users/users'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const TABS = ['Pending', 'All Processed']

const AdminVerificationsPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [declineId, setDeclineId] = useState<string | null>(null)
  const [declineNote, setDeclineNote] = useState('')

  const { data, isLoading, isError } = usePendingMentors({ limit: 50 })
  const approve = useApproveMentor()
  const decline = useDeclineMentor()

  const mentors = data?.data ?? []

  const filtered = mentors.filter((m) =>
    search === '' ||
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleApprove = async (id: string, name: string) => {
    try {
      await approve.mutateAsync(id)
      toast.success(`${name} approved as mentor`)
    } catch {
      toast.error('Failed to approve mentor')
    }
  }

  const handleDeclineSubmit = async () => {
    if (!declineId) return
    const mentor = mentors.find((m) => m._id === declineId)
    try {
      await decline.mutateAsync({ id: declineId, note: declineNote || undefined })
      toast.success(`${mentor?.firstName ?? 'Mentor'} application declined`)
      setDeclineId(null)
      setDeclineNote('')
    } catch {
      toast.error('Failed to decline mentor')
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Mentor Applications"
        title="Mentor Application Review"
        subtitle="Approve or decline mentor registration requests. Approved mentors gain access to the Mentor Portal."
        icon={<UserCheck size={14} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Pending review" value={String(data?.total ?? 0)} icon={<Clock size={20} />} progress={70} accent="#f59e0b" />
        <StatCard label="Reviewed this session" value={String(approve.variables ? 1 : 0)} icon={<CheckCircle size={20} />} progress={40} accent="#22c55e" />
        <StatCard label="Pending total" value={String(mentors.length)} icon={<UserCheck size={20} />} progress={100} />
      </div>

      <div className={CARD} style={CARD_STYLE}>
        <div className="flex flex-col sm:flex-row gap-3 mb-5 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full h-10 pl-9 pr-4 rounded-full border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-1 border-b border-slate-200/18 mb-5">
          {TABS.map((label, i) => (
            <button key={label} onClick={() => setTab(i)} className={cn('px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors whitespace-nowrap', tab === i ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              {label}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <div className="flex flex-col gap-3">
            {isLoading && (
              <div className="py-12 flex items-center justify-center gap-3 text-muted-foreground">
                <Loader2 size={18} className="animate-spin" /> Loading pending mentors…
              </div>
            )}
            {isError && <div className="py-12 text-center text-red-500">Failed to load mentor applications.</div>}
            {!isLoading && !isError && filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                {search ? 'No results match your search.' : 'No pending mentor applications.'}
              </div>
            )}
            {filtered.map((mentor) => (
              <div key={mentor._id} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200/18 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{mentor.firstName} {mentor.lastName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Mail size={12} className="text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{mentor.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {mentor.organization && (
                      <span className="text-xs text-muted-foreground">{mentor.organization}</span>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar size={11} />
                      Applied {new Date(mentor.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap justify-end">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                    <Clock size={11} /> Pending
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => void handleApprove(mentor._id, `${mentor.firstName} ${mentor.lastName}`)}
                      disabled={approve.isPending}
                      className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-[#0d5c54] disabled:opacity-60 transition-colors flex items-center gap-1.5"
                    >
                      {approve.isPending ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle size={11} />}
                      Approve
                    </button>
                    <button
                      onClick={() => setDeclineId(mentor._id)}
                      disabled={decline.isPending}
                      className="px-4 py-1.5 rounded-full border border-red-300 text-red-600 text-xs font-semibold hover:bg-red-50 disabled:opacity-60 transition-colors flex items-center gap-1.5"
                    >
                      <XCircle size={11} /> Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 1 && (
          <div className="py-12 text-center text-muted-foreground">
            Processed applications are visible in the <strong>Users</strong> page filtered by role and status.
          </div>
        )}
      </div>

      {/* Decline modal */}
      {declineId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="font-bold text-base mb-1">Decline Application</h3>
            <p className="text-sm text-muted-foreground mb-4">Optionally add a note explaining the decision. The applicant will receive an email.</p>
            <textarea
              value={declineNote}
              onChange={(e) => setDeclineNote(e.target.value)}
              placeholder="Reason for declining (optional)"
              rows={3}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none mb-4"
            />
            <div className="flex gap-2">
              <button onClick={() => { setDeclineId(null); setDeclineNote('') }} className="flex-1 h-10 rounded-full border border-slate-200 text-sm font-semibold hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => void handleDeclineSubmit()}
                disabled={decline.isPending}
                className="flex-1 h-10 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                {decline.isPending ? 'Declining…' : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

AdminVerificationsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>
export default AdminVerificationsPage
