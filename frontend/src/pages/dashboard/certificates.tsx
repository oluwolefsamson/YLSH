import React from 'react'
import { Award, Download, ShieldCheck, QrCode, Clock } from 'lucide-react'
import { DashboardLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const certificates = [
  { id: 1, title: 'Youth Leadership Summit 2025', issuedDate: 'Dec 18, 2025', type: 'Attendance', status: 'issued', verifyCode: 'YLSH-CERT-A7X9K2' },
  { id: 2, title: 'Digital Skills Bootcamp', issuedDate: 'Nov 5, 2025', type: 'Completion', status: 'issued', verifyCode: 'YLSH-CERT-B3M1P8' },
  { id: 3, title: 'Entrepreneurship Masterclass', issuedDate: 'Oct 22, 2025', type: 'Participation', status: 'issued', verifyCode: 'YLSH-CERT-C9R4L5' },
  { id: 4, title: 'Climate Action Workshop', issuedDate: 'Pending generation', type: 'Attendance', status: 'pending', verifyCode: null },
]

const CertificatesPage: NextPageWithLayout = () => {
  const issuedCount = certificates.filter((c) => c.status === 'issued').length
  const pendingCount = certificates.filter((c) => c.status === 'pending').length

  return (
    <div>
      <PageHeader eyebrow="Certificates" title="My Certificates" subtitle="Download PDF certificates and share QR-verified links. Certificates are generated after events conclude." icon={<Award size={14} />} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Issued" value={String(issuedCount)} icon={<Award size={20} />} progress={75} />
        <StatCard label="Verified" value={String(issuedCount)} icon={<ShieldCheck size={20} />} progress={75} accent="#22c55e" />
        <StatCard label="Pending" value={String(pendingCount)} icon={<Clock size={20} />} progress={25} accent="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <div key={cert.id} className={cn('flex flex-col p-5 md:p-6 rounded-2xl border border-slate-200/16', cert.status === 'pending' ? 'opacity-65' : '')} style={CARD_STYLE}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-[14px] grid place-items-center text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #082F49 0%, #127C71 100%)' }}>
                <Award size={22} />
              </div>
              <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold', cert.status === 'issued' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
                {cert.status === 'issued' ? <ShieldCheck size={11} /> : <Clock size={11} />}
                {cert.status === 'issued' ? 'Issued' : 'Pending'}
              </span>
            </div>
            <h3 className="font-bold mb-1">{cert.title}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground w-fit mb-2">{cert.type}</span>
            <p className="text-sm text-muted-foreground mb-3">Issued: {cert.issuedDate}</p>
            {cert.verifyCode && (
              <div className="flex items-center gap-2 p-3 rounded-xl mb-3" style={{ backgroundColor: 'rgba(18,124,113,0.06)', border: '1px solid rgba(18,124,113,0.18)' }}>
                <QrCode size={16} className="text-primary flex-shrink-0" />
                <span className="font-mono text-xs font-bold text-primary">{cert.verifyCode}</span>
              </div>
            )}
            <div className="flex gap-3 mt-auto">
              <button disabled={cert.status === 'pending'} className="flex-1 flex items-center justify-center gap-2 h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] disabled:opacity-50 disabled:cursor-default transition-colors">
                <Download size={15} /> Download PDF
              </button>
              <button disabled={cert.status === 'pending'} className="flex items-center gap-2 h-10 px-4 rounded-full border border-primary text-primary font-semibold text-sm hover:bg-primary/5 disabled:opacity-50 disabled:cursor-default transition-colors">
                <ShieldCheck size={15} /> Verify
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

CertificatesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default CertificatesPage
