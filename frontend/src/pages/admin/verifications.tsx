import React, { useState } from 'react'
import { ShieldCheck, Search, CheckCircle, Clock, XCircle, CreditCard, Calendar } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const verifications = [
  { id: 1, name: 'Amina Bello', email: 'amina.bello@example.com', ninRef: 'NIN-REF-****8821', submittedDate: 'Jun 14, 2026', status: 'verified' },
  { id: 2, name: 'Emeka Obi', email: 'emeka.obi@example.com', ninRef: 'NIN-REF-****4412', submittedDate: 'Jun 13, 2026', status: 'pending' },
  { id: 3, name: 'Zahra Musa', email: 'zahra@example.com', ninRef: 'NIN-REF-****7734', submittedDate: 'Jun 12, 2026', status: 'pending' },
  { id: 4, name: 'Kelechi Obi', email: 'kelechi@example.com', ninRef: 'NIN-REF-****2290', submittedDate: 'Jun 11, 2026', status: 'verified' },
  { id: 5, name: 'Sule Ibrahim', email: 'sule@example.com', ninRef: 'NIN-REF-****5561', submittedDate: 'Jun 10, 2026', status: 'rejected' },
  { id: 6, name: 'Ngozi Eze', email: 'ngozi@example.com', ninRef: 'NIN-REF-****3317', submittedDate: 'Jun 9, 2026', status: 'verified' },
  { id: 7, name: 'Tunde Adeyemi', email: 'tunde@example.com', ninRef: 'NIN-REF-****9945', submittedDate: 'Jun 8, 2026', status: 'pending' },
]

const statusStyles: Record<string, string> = { verified: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', rejected: 'bg-red-100 text-red-700' }
const statusIcon: Record<string, React.ReactNode> = { verified: <CheckCircle size={11} />, pending: <Clock size={11} />, rejected: <XCircle size={11} /> }

const TABS = ['All', 'Pending', 'Verified', 'Rejected']

const AdminVerificationsPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')

  const filtered = verifications
    .filter((v) => tab === 0 ? true : tab === 1 ? v.status === 'pending' : tab === 2 ? v.status === 'verified' : v.status === 'rejected')
    .filter((v) => search === '' || v.name.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase()))

  const tabCounts = [verifications.length, verifications.filter((v) => v.status === 'pending').length, verifications.filter((v) => v.status === 'verified').length, verifications.filter((v) => v.status === 'rejected').length]

  return (
    <div>
      <PageHeader eyebrow="Verifications" title="NIN Verifications" subtitle="Review and action NIN identity verification submissions. Raw NIN values are never stored — only encrypted references." icon={<ShieldCheck size={14} />} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total submissions" value={String(verifications.length)} icon={<CreditCard size={20} />} progress={100} />
        <StatCard label="Pending review" value={String(verifications.filter((v) => v.status === 'pending').length)} icon={<Clock size={20} />} progress={33} accent="#f59e0b" />
        <StatCard label="Verified" value={String(verifications.filter((v) => v.status === 'verified').length)} icon={<CheckCircle size={20} />} progress={55} accent="#22c55e" />
      </div>

      <div className={CARD} style={CARD_STYLE}>
        <div className="relative mb-5 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…" className="w-full h-10 pl-9 pr-4 rounded-full border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
        </div>

        <div className="flex gap-1 border-b border-slate-200/18 mb-5">
          {TABS.map((label, i) => (
            <button key={label} onClick={() => setTab(i)} className={cn('px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors whitespace-nowrap', tab === i ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              {label} ({tabCounts[i]})
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((v) => (
            <div key={v.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/18 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{v.name}</p>
                <p className="text-sm text-muted-foreground">{v.email}</p>
                <div className="flex gap-4 mt-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <CreditCard size={13} className="text-muted-foreground" />
                    <span className="font-mono text-xs text-muted-foreground">{v.ninRef}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{v.submittedDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize', statusStyles[v.status])}>
                  {statusIcon[v.status]}{v.status}
                </span>
                {v.status === 'pending' && (
                  <div className="flex gap-2">
                    <button className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-[#0d5c54] transition-colors">Approve</button>
                    <button className="px-4 py-1.5 rounded-full border border-red-300 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="py-12 text-center text-muted-foreground">No records match your search.</div>}
        </div>
      </div>
    </div>
  )
}

AdminVerificationsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>
export default AdminVerificationsPage
