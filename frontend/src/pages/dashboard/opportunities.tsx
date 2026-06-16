import React, { useState } from 'react'
import { Trophy, Briefcase, Clock, DollarSign, GraduationCap, Calendar, Building, Send, CheckCircle, Hourglass, MapPin } from 'lucide-react'
import { DashboardLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

type OppType = 'job' | 'internship' | 'grant' | 'scholarship'

const opportunities = [
  { id: 1, title: 'Junior Product Manager', organization: 'TechHub Lagos', type: 'job' as OppType, deadline: 'Jul 30, 2026', location: 'Lagos, Nigeria', description: 'Help build digital products for African youth. 2+ years experience preferred.' },
  { id: 2, title: 'Data Science Internship', organization: 'Andela', type: 'internship' as OppType, deadline: 'Jul 15, 2026', location: 'Remote', description: '6-month internship building ML pipelines. Open to university students and recent graduates.' },
  { id: 3, title: 'Youth Innovation Grant', organization: 'Tony Elumelu Foundation', type: 'grant' as OppType, deadline: 'Aug 1, 2026', location: 'Pan-African', description: 'Seed funding for youth-led startups addressing African challenges.', amount: '$5,000' },
  { id: 4, title: 'STEM Scholarship 2026', organization: 'MTN Foundation', type: 'scholarship' as OppType, deadline: 'Jun 30, 2026', location: 'Nigeria', description: 'Full tuition scholarship for undergraduate STEM students with 3.5+ GPA.', amount: '₦2.5M/year' },
  { id: 5, title: 'Policy Analyst', organization: 'Federal Ministry of Youth', type: 'job' as OppType, deadline: 'Jul 20, 2026', location: 'Abuja, Nigeria', description: 'Analyze youth policy frameworks and prepare briefs for senior officials.' },
  { id: 6, title: 'Climate Tech Fellowship', organization: 'GreenAfrica Initiative', type: 'internship' as OppType, deadline: 'Aug 15, 2026', location: 'Remote', description: '3-month fellowship building sustainability solutions for African communities.' },
]

const myApplications = [
  { id: 2, title: 'Data Science Internship', org: 'Andela', status: 'under_review', appliedDate: 'Jun 5, 2026' },
  { id: 3, title: 'Youth Innovation Grant', org: 'Tony Elumelu Foundation', status: 'shortlisted', appliedDate: 'Jun 1, 2026' },
]

const typeIcon: Record<OppType, React.ReactNode> = {
  job: <Briefcase size={20} />,
  internship: <Clock size={20} />,
  grant: <DollarSign size={20} />,
  scholarship: <GraduationCap size={20} />,
}

const typeBadge: Record<OppType, string> = {
  job: 'bg-primary/10 text-primary',
  internship: 'bg-purple-100 text-purple-700',
  grant: 'bg-green-100 text-green-700',
  scholarship: 'bg-amber-100 text-amber-700',
}

type TabType = OppType | 'all'
const tabTypes: TabType[] = ['all', 'job', 'internship', 'grant', 'scholarship']
const TABS = ['All', 'Jobs', 'Internships', 'Grants', 'Scholarships']

const OpportunitiesPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const filtered = tab === 0 ? opportunities : opportunities.filter((o) => o.type === tabTypes[tab])
  const appliedIds = new Set(myApplications.map((a) => a.id))

  return (
    <div>
      <PageHeader eyebrow="Opportunities" title="Opportunities" subtitle="Discover jobs, internships, grants, and scholarships. Apply directly and track your application status." icon={<Trophy size={14} />} />

      {myApplications.length > 0 && (
        <div className={cn(CARD, 'mb-5')} style={CARD_STYLE}>
          <h2 className="text-xl font-bold mb-4">My Applications</h2>
          <div className="flex flex-col gap-3">
            {myApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200/18 flex-wrap">
                <div>
                  <p className="font-bold">{app.title}</p>
                  <p className="text-sm text-muted-foreground">{app.org} · Applied {app.appliedDate}</p>
                </div>
                <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold', app.status === 'shortlisted' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
                  {app.status === 'shortlisted' ? <CheckCircle size={11} /> : <Hourglass size={11} />}
                  {app.status === 'shortlisted' ? 'Shortlisted' : 'Under review'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={CARD} style={CARD_STYLE}>
        <div className="flex gap-1 border-b border-slate-200/18 mb-5 overflow-x-auto">
          {TABS.map((label, i) => (
            <button key={label} onClick={() => setTab(i)} className={cn('px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors whitespace-nowrap', tab === i ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              {label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((opp) => (
            <div key={opp.id} className="flex flex-col p-5 rounded-xl border border-slate-200/18">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0 bg-primary">{typeIcon[opp.type]}</div>
                <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', typeBadge[opp.type])}>
                  {opp.type.charAt(0).toUpperCase() + opp.type.slice(1)}
                </span>
              </div>
              <h3 className="font-bold mb-1">{opp.title}</h3>
              <div className="flex items-center gap-1.5 mb-2">
                <Building size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{opp.organization}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3 flex-1">{opp.description}</p>
              {'amount' in opp && opp.amount && (
                <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: 'rgba(18,124,113,0.06)', border: '1px solid rgba(18,124,113,0.18)' }}>
                  <p className="text-sm font-bold text-primary">Award: {opp.amount}</p>
                </div>
              )}
              <div className="flex flex-col gap-1 mb-3">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Deadline: {opp.deadline}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{opp.location}</span>
                </div>
              </div>
              <button disabled={appliedIds.has(opp.id)} className={cn('w-full h-10 rounded-full font-bold text-sm transition-colors flex items-center justify-center gap-2', appliedIds.has(opp.id) ? 'border border-border text-muted-foreground cursor-default' : 'bg-primary text-white hover:bg-[#0d5c54]')}>
                {!appliedIds.has(opp.id) && <Send size={14} />}
                {appliedIds.has(opp.id) ? 'Applied' : 'Apply Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

OpportunitiesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default OpportunitiesPage
