import React, { useState } from 'react'
import { Trophy, Briefcase, Clock, DollarSign, GraduationCap, Calendar, Building, ExternalLink, CheckCircle, Hourglass, MapPin, Mail, Link2, Loader2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useOpportunities, useMyApplications } from '@/services/hooks/opportunities/opportunities'
import type { Opportunity, OppType, ApplicationStatus } from '@/services/endpoints/opportunities/opportunities'
import { CARD, CARD_STYLE } from '@/utils/card-styles'

const typeIcon: Record<OppType, React.ReactNode> = {
  job: <Briefcase size={20} />, internship: <Clock size={20} />,
  grant: <DollarSign size={20} />, scholarship: <GraduationCap size={20} />,
}

const typeBadge: Record<OppType, string> = {
  job: 'bg-primary/10 text-primary', internship: 'bg-purple-100 text-purple-700',
  grant: 'bg-blue-100 text-[#082F49]', scholarship: 'bg-amber-100 text-amber-700',
}

const statusBadge: Record<ApplicationStatus, string> = {
  pending: 'bg-slate-100 text-slate-600', under_review: 'bg-amber-100 text-amber-700',
  shortlisted: 'bg-blue-100 text-[#082F49]', rejected: 'bg-red-100 text-red-700',
  accepted: 'bg-emerald-100 text-emerald-700',
}

const statusLabel: Record<ApplicationStatus, string> = {
  pending: 'Pending', under_review: 'Under review', shortlisted: 'Shortlisted',
  rejected: 'Rejected', accepted: 'Accepted',
}

const amountLabel: Record<OppType, string> = {
  job: 'Salary', internship: 'Stipend', grant: 'Grant Amount', scholarship: 'Award Value',
}

const TABS = ['All', 'Jobs', 'Internships', 'Grants', 'Scholarships']
const TAB_VALUES: Array<OppType | 'all'> = ['all', 'job', 'internship', 'grant', 'scholarship']

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

const OpportunitiesPage: NextPageWithLayout = () => {
  const [tabValue, setTabValue] = useState<OppType | 'all'>('all')

  const selectedType = tabValue !== 'all' ? tabValue : undefined
  const { data: oppData, isLoading: loadingOpps } = useOpportunities({ type: selectedType as string | undefined })
  const { data: applications = [], isLoading: loadingApps } = useMyApplications()

  const opportunities = oppData?.data ?? []

  const openGmail = (opp: Opportunity, toEmail?: string) => {
    const to = toEmail ? encodeURIComponent(toEmail) : ''
    const subject = encodeURIComponent(`Application for ${opp.title} at ${opp.organization}`)
    const body = encodeURIComponent(
      `Dear ${opp.organization} Team,\n\nI am writing to apply for the ${opp.title} position.\n\nPlease find attached:\n- My CV / Resume\n- Cover letter\n\n[Add any additional information here]\n\nThank you for your consideration.`
    )
    const url = `https://mail.google.com/mail/?view=cm&fs=1${to ? `&to=${to}` : ''}&su=${subject}&body=${body}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleApply = (opp: Opportunity) => {
    if (!opp.link) {
      openGmail(opp)
      return
    }
    if (isEmail(opp.link)) {
      openGmail(opp, opp.link)
    } else {
      window.open(opp.link, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Opportunities" title="Opportunities" subtitle="Discover jobs, internships, grants, and scholarships. Click Apply Now to go directly to the application." icon={<Trophy size={14} />} />

      {/* My Applications — only shows for internal tracked applications */}
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
                  <div key={app._id} className="flex items-center justify-between gap-4 py-3.5 border-b border-slate-100 last:border-0 flex-wrap">
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
            {opportunities.map((opp) => (
              <div key={opp._id} className="flex flex-col p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${['#127C71','#8b5cf6','#3b82f6','#f59e0b'][['job','internship','grant','scholarship'].indexOf(opp.type)] ?? '#127C71'}15`, color: ['#127C71','#8b5cf6','#3b82f6','#f59e0b'][['job','internship','grant','scholarship'].indexOf(opp.type)] ?? '#127C71' }}>{typeIcon[opp.type]}</div>
                  <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', typeBadge[opp.type])}>
                    {opp.type.charAt(0).toUpperCase() + opp.type.slice(1)}
                  </span>
                </div>
                <h3 className="font-bold mb-1">{opp.title}</h3>
                <div className="flex items-center gap-1.5 mb-2"><Building size={14} className="text-muted-foreground" /><span className="text-sm text-muted-foreground">{opp.organization}</span></div>
                <p className="text-sm text-muted-foreground mb-3 flex-1 line-clamp-3">{opp.description}</p>
                {opp.amount && (
                  <div className="p-3 rounded-xl mb-3 bg-brand-teal/8 border border-brand-teal/15">
                    <p className="text-sm font-bold text-primary">{amountLabel[opp.type]}: {opp.amount}</p>
                  </div>
                )}
                <div className="flex flex-col gap-1 mb-3">
                  <div className="flex items-center gap-1.5"><Calendar size={13} className="text-muted-foreground" /><span className="text-xs text-muted-foreground">Deadline: {new Date(opp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                  <div className="flex items-center gap-1.5"><MapPin size={13} className="text-muted-foreground" /><span className="text-xs text-muted-foreground">{opp.location}</span></div>
                  {opp.link && isEmail(opp.link) && (
                    <div className="flex items-center gap-1.5">
                      <Mail size={13} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Send to: <span className="font-medium text-foreground">{opp.link}</span></span>
                    </div>
                  )}
                  {opp.link && !isEmail(opp.link) && (
                    <div className="flex items-center gap-1.5">
                      <Link2 size={13} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Apply via external link</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleApply(opp)}
                  className="w-full h-10 rounded-full font-bold text-sm transition-colors flex items-center justify-center gap-2 bg-primary text-white hover:bg-[#061e35]"
                >
                  {opp.link && !isEmail(opp.link) ? <ExternalLink size={14} /> : <Mail size={14} />}
                  {opp.link && !isEmail(opp.link) ? 'Apply Now' : 'Apply via Gmail'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

OpportunitiesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default OpportunitiesPage
