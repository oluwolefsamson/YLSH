import React, { useState } from 'react'
import { UserCheck, Search, CheckCircle, Clock, XCircle, Calendar, Mail, Loader2 } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { toast } from 'sonner'
import { usePendingMentors, useApproveMentor, useDeclineMentor } from '@/services/hooks/users/users'
import { CARD, CARD_STYLE } from '@/utils/card-styles'


const FILTER_OPTIONS = ['Pending', 'All Processed']
const FILTER_VALUES = ['pending', 'processed']

const AdminVerificationsPage: NextPageWithLayout = () => {
  const [filterValue, setFilterValue] = useState('pending')
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
              placeholder="Search by name or emailâ€¦"
              className="w-full h-10 pl-9 pr-4 rounded-full border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {FILTER_OPTIONS.map((label, i) => (
            <button key={label} onClick={() => setFilterValue(FILTER_VALUES[i])}
              className={cn('px-4 py-2 rounded-lg text-sm font-semibold border transition-colors whitespace-nowrap',
                filterValue === FILTER_VALUES[i] ? 'bg-primary text-white border-primary' : 'bg-background text-foreground border-input hover:bg-muted'
              )}
            >{label}</button>
          ))}
        </div>

        {filterValue === 'pending' && (
          <div className="w-full overflow-x-auto">
            {isLoading ? (
              <div className="py-12 flex items-center justify-center gap-3 text-muted-foreground">
                <Loader2 size={18} className="animate-spin" /> Loading pending mentors…
              </div>
            ) : isError ? (
              <div className="py-12 text-center text-red-500">Failed to load mentor applications.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Mentor</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Organization</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Applied</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-muted-foreground">
                        {search ? 'No results match your search.' : 'No pending mentor applications.'}
                      </td>
                    </tr>
                  ) : filtered.map((mentor) => (
                    <tr key={mentor._id} className="transition-colors hover:bg-slate-50/60">
                      <td className="px-4 py-3.5 font-semibold text-foreground">{mentor.firstName} {mentor.lastName}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{mentor.email}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{mentor.organization ?? '—'}</td>
                      <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">{new Date(mentor.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                          <Clock size={11} /> Pending
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => void handleApprove(mentor._id, `${mentor.firstName} ${mentor.lastName}`)}
                            disabled={approve.isPending}
                            className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-[#061e35] disabled:opacity-60 transition-colors flex items-center gap-1.5"
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {filterValue === 'processed' && (
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
                {decline.isPending ? 'Decliningâ€¦' : 'Confirm Decline'}
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
