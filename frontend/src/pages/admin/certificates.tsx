import React, { useState } from 'react'
import { Award, ShieldCheck, Clock, Loader2, X, CheckCircle, Zap, Download } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useAllCertificates, useBatchGenerateCertificates } from '@/services/hooks/certificates/certificates'
import { useEvents } from '@/services/hooks/events/events'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CARD, CARD_STYLE } from '@/utils/card-styles'
import { downloadCertificateAsPDF } from '@/utils/download-certificate'
import type { CertificateAdmin } from '@/services/endpoints/certificates/certificates'

type CertType = 'Attendance' | 'Completion' | 'Participation'

export function CertificatesContent() {
  const [selectedEventId, setSelectedEventId] = useState('')
  const [certType, setCertType] = useState<CertType>('Attendance')
  const [batchResult, setBatchResult] = useState<{ issued: number; skipped: number } | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const { data: certData, isLoading } = useAllCertificates({ limit: 100 })
  const { data: eventsData } = useEvents({ limit: 200 })
  const batchGenerate = useBatchGenerateCertificates()

  const certificates = certData?.data ?? []
  const events = eventsData?.data ?? []

  const issuedCount = certificates.filter((c) => c.status === 'issued').length
  const pendingCount = certificates.filter((c) => c.status === 'pending').length

  const handleBatchGenerate = () => {
    if (!selectedEventId) return toast.error('Please select an event')
    batchGenerate.mutate(
      { eventId: selectedEventId, type: certType },
      {
        onSuccess: (res) => {
          setBatchResult(res)
          toast.success(`${res.issued} certificate${res.issued !== 1 ? 's' : ''} issued`)
        },
        onError: () => toast.error('Failed to generate certificates'),
      }
    )
  }

  const handleDownload = async (cert: CertificateAdmin) => {
    if (downloadingId) return
    setDownloadingId(cert._id)
    try {
      const recipientName = typeof cert.user === 'object'
        ? `${cert.user.firstName} ${cert.user.lastName}`
        : 'Participant'
      const eventDate = cert.event?.date
        ? new Date(cert.event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : undefined
      await downloadCertificateAsPDF(
        {
          recipientName,
          eventTitle: cert.event?.title ?? 'YLSH Event',
          eventDate,
          certType: cert.type,
          verifyCode: cert.verifyCode,
          issuedDate: cert.issuedDate,
        },
        `YLSH_${cert.type}_${recipientName.replace(/\s+/g, '_')}.pdf`
      )
      toast.success('Certificate downloaded')
    } catch {
      toast.error('Failed to generate PDF')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Certificates"
        title="Certificates"
        subtitle="Generate certificates for participants who attended events. Only checked-in attendees receive certificates."
        icon={<Award size={14} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Issued" value={String(issuedCount)} icon={<Award size={20} />} progress={certificates.length ? (issuedCount / certificates.length) * 100 : 0} />
        <StatCard label="Verified" value={String(issuedCount)} icon={<ShieldCheck size={20} />} progress={certificates.length ? (issuedCount / certificates.length) * 100 : 0} accent="#22c55e" />
        <StatCard label="Pending" value={String(pendingCount)} icon={<Clock size={20} />} progress={certificates.length ? (pendingCount / certificates.length) * 100 : 0} accent="#f59e0b" />
      </div>

      {/* Batch generate panel */}
      <div className={cn(CARD, 'mb-5')} style={CARD_STYLE}>
        <h2 className="text-lg font-bold mb-1">Generate Certificates</h2>
        <p className="text-sm text-muted-foreground mb-5">Select an event and certificate type, then generate for all checked-in attendees at once.</p>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Event</label>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an event..." />
              </SelectTrigger>
              <SelectContent>
                {events.map((e) => (
                  <SelectItem key={e._id} value={e._id}>{e.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Certificate type</label>
            <Select value={certType} onValueChange={(v) => setCertType(v as CertType)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Attendance">Attendance</SelectItem>
                <SelectItem value="Completion">Completion</SelectItem>
                <SelectItem value="Participation">Participation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={handleBatchGenerate}
            disabled={!selectedEventId || batchGenerate.isPending}
            className="flex items-center gap-2 h-10 px-5 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#061e35] disabled:opacity-50 transition-colors"
          >
            {batchGenerate.isPending ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
            Generate for all attendees
          </button>
        </div>

        {batchResult && (
          <div className="mt-4 flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <CheckCircle size={20} className="text-[#082F49] flex-shrink-0" />
            <p className="text-sm font-semibold text-[#082F49]">
              {batchResult.issued} certificate{batchResult.issued !== 1 ? 's' : ''} issued
              {batchResult.skipped > 0 && ` · ${batchResult.skipped} skipped (already issued)`}
            </p>
            <button onClick={() => setBatchResult(null)} className="ml-auto p-1 rounded-md hover:bg-blue-100 transition-colors"><X size={14} /></button>
          </div>
        )}
      </div>

      {/* All certificates table */}
      <div className={CARD} style={CARD_STYLE}>
        <h2 className="text-lg font-bold mb-5">All Certificates</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-primary" /></div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Recipient</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Event</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Code</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Issued</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certificates.length === 0 ? (
                  <tr><td colSpan={8} className="py-16 text-center text-muted-foreground">No certificates yet. Generate them above after participants check in to events.</td></tr>
                ) : certificates.map((cert) => (
                  <tr key={cert._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-semibold whitespace-nowrap">
                      {typeof cert.user === 'object' ? `${cert.user.firstName} ${cert.user.lastName}` : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground text-xs">
                      {typeof cert.user === 'object' ? cert.user.email : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">{cert.event?.title ?? '—'}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-muted text-muted-foreground">{cert.type}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-primary">{cert.verifyCode ?? '—'}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold', cert.status === 'issued' ? 'bg-blue-100 text-[#082F49]' : 'bg-amber-100 text-amber-700')}>
                        {cert.status === 'issued' ? <ShieldCheck size={10} /> : <Clock size={10} />}
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap text-xs">
                      {cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        disabled={cert.status !== 'issued' || !!downloadingId}
                        onClick={() => handleDownload(cert)}
                        title="Download as PDF"
                        className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-slate-200 text-primary hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {downloadingId === cert._id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const AdminCertificatesPage: NextPageWithLayout = () => <CertificatesContent />
AdminCertificatesPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>
export default AdminCertificatesPage
