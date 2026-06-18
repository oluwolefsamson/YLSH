import React, { useState } from 'react'
import { Trophy, Briefcase, Clock, DollarSign, GraduationCap, Calendar, Building, Send, CheckCircle, Hourglass, MapPin, X, FileText, Loader2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useOpportunities, useMyApplications, useApplyForOpportunity } from '@/services/hooks/opportunities/opportunities'
import type { Opportunity, OppType, ApplicationStatus } from '@/services/endpoints/opportunities/opportunities'
import { toast } from 'sonner'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }
const INPUT = 'w-full h-10 px-3 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'

const typeIcon: Record<OppType, React.ReactNode> = {
  job: <Briefcase size={20} />, internship: <Clock size={20} />,
  grant: <DollarSign size={20} />, scholarship: <GraduationCap size={20} />,
}

const typeBadge: Record<OppType, string> = {
  job: 'bg-primary/10 text-primary', internship: 'bg-purple-100 text-purple-700',
  grant: 'bg-green-100 text-green-700', scholarship: 'bg-amber-100 text-amber-700',
}

const statusBadge: Record<ApplicationStatus, string> = {
  pending: 'bg-slate-100 text-slate-600', under_review: 'bg-amber-100 text-amber-700',
  shortlisted: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700',
  accepted: 'bg-emerald-100 text-emerald-700',
}

const statusLabel: Record<ApplicationStatus, string> = {
  pending: 'Pending', under_review: 'Under review', shortlisted: 'Shortlisted',
  rejected: 'Rejected', accepted: 'Accepted',
}

const TABS = ['All', 'Jobs', 'Internships', 'Grants', 'Scholarships']
const TAB_VALUES: Array<OppType | 'all'> = ['all', 'job', 'internship', 'grant', 'scholarship']

const OpportunitiesPage: NextPageWithLayout = () => {
  const [tabValue, setTabValue] = useState<OppType | 'all'>('all')
  const [applyModal, setApplyModal] = useState<Opportunity | null>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [applyDone, setApplyDone] = useState(false)

  const selectedType = tabValue !== 'all' ? tabValue : undefined
  const { data: oppData, isLoading: loadingOpps } = useOpportunities({ type: selectedType as string | undefined })
  const { data: applications = [], isLoading: loadingApps } = useMyApplications()
  const applyMutation = useApplyForOpportunity()

  const opportunities = oppData?.data ?? []
  const appliedIds = new Set(applications.map((a) => a.opportunity?._id))

  const openApply = (opp: Opportunity) => {
    setCoverLetter('')
    setApplyDone(false)
    setApplyModal(opp)
  }

  const handleSubmit = () => {
    if (!applyModal || !coverLetter.trim()) return
    applyMutation.mutate(
      { id: applyModal._id, coverLetter },
      {
        onSuccess: () => setApplyDone(true),
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to submit application'
          toast.error(msg)
        },
      }
    )
  }

  return (
    <div>
      <PageHeader eyebrow="Opportunities" title="Opportunities" subtitle="Discover jobs, internships, grants, and scholarships. Apply directly and track your application status." icon={<Trophy size={14} />} />

      {/* My Applications */}
      {(loadingApps || applications.length > 0) && (
        <div className={cn(CARD, 'mb-5')} style={CARD_STYLE}>
          <h2 className="text-xl font-bold mb-4">My Applications</h2>
          {loadingApps ? (
            <div className="flex items-center justify-center py-6"><Loader2 size={20} className="animate-spin text-primary" /></div>
          ) : (
            <div className="flex flex-col gap-3">
              {applications.map((app) => {
                const opp = app.opportunity
                const status = (app.status ?? 'pending') as ApplicationStatus
                return (
                  <div key={app._id} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200/18 flex-wrap">
                    <div>
                      <p className="font-bold">{opp?.title ?? '—'}</p>
                      <p className="text-sm text-muted-foreground">{opp?.organization ?? '—'} · Applied {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold', statusBadge[status])}>
                      {status === 'shortlisted' || status === 'accepted' ? <CheckCircle size={11} /> : <Hourglass size={11} />}
                      {statusLabel[status]}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Opportunities List */}
      <div className={CARD} style={CARD_STYLE}>
        <div className="mb-5">
          <Select value={tabValue} onValueChange={(v) => setTabValue(v as OppType | 'all')}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TABS.map((label, i) => (
                <SelectItem key={label} value={TAB_VALUES[i]}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loadingOpps ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-primary" /></div>
        ) : opportunities.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center">No opportunities available in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map((opp) => {
              const alreadyApplied = appliedIds.has(opp._id)
              return (
                <div key={opp._id} className="flex flex-col p-5 rounded-xl border border-slate-200/18">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0 bg-primary">{typeIcon[opp.type]}</div>
                    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', typeBadge[opp.type])}>
                      {opp.type.charAt(0).toUpperCase() + opp.type.slice(1)}
                    </span>
                  </div>
                  <h3 className="font-bold mb-1">{opp.title}</h3>
                  <div className="flex items-center gap-1.5 mb-2"><Building size={14} className="text-muted-foreground" /><span className="text-sm text-muted-foreground">{opp.organization}</span></div>
                  <p className="text-sm text-muted-foreground mb-3 flex-1 line-clamp-3">{opp.description}</p>
                  {opp.amount && (
                    <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: 'rgba(18,124,113,0.06)', border: '1px solid rgba(18,124,113,0.18)' }}>
                      <p className="text-sm font-bold text-primary">Award: {opp.amount}</p>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 mb-3">
                    <div className="flex items-center gap-1.5"><Calendar size={13} className="text-muted-foreground" /><span className="text-xs text-muted-foreground">Deadline: {new Date(opp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                    <div className="flex items-center gap-1.5"><MapPin size={13} className="text-muted-foreground" /><span className="text-xs text-muted-foreground">{opp.location}</span></div>
                  </div>
                  <button
                    disabled={alreadyApplied}
                    onClick={() => openApply(opp)}
                    className={cn('w-full h-10 rounded-full font-bold text-sm transition-colors flex items-center justify-center gap-2', alreadyApplied ? 'border border-border text-muted-foreground cursor-default' : 'bg-primary text-white hover:bg-[#0d5c54]')}
                  >
                    {!alreadyApplied && <Send size={14} />}
                    {alreadyApplied ? 'Applied' : 'Apply Now'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {applyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setApplyModal(null)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            {!applyDone ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Apply for Opportunity</h3>
                  <button onClick={() => setApplyModal(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X size={18} /></button>
                </div>
                <div className="p-4 rounded-xl bg-muted mb-5">
                  <p className="font-bold">{applyModal.title}</p>
                  <p className="text-sm text-muted-foreground">{applyModal.organization} · {applyModal.location}</p>
                </div>
                <div className="mb-5">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Cover letter <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <FileText size={15} className="absolute left-3 top-3 text-muted-foreground" />
                    <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Briefly describe why you're a great fit for this opportunity..." rows={5} className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setApplyModal(null)} className="flex-1 h-10 rounded-full border-2 border-slate-300 text-foreground font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
                  <button onClick={handleSubmit} disabled={!coverLetter.trim() || applyMutation.isPending} className="flex-1 h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                    {applyMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <><Send size={14} /> Submit Application</>}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 grid place-items-center mb-4"><CheckCircle size={32} className="text-green-600" /></div>
                <h3 className="font-bold text-lg mb-1">Application Submitted!</h3>
                <p className="text-sm text-muted-foreground mb-5">Your application to <strong>{applyModal.title}</strong> at {applyModal.organization} has been submitted.</p>
                <button onClick={() => setApplyModal(null)} className="w-full h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] transition-colors">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

OpportunitiesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default OpportunitiesPage
