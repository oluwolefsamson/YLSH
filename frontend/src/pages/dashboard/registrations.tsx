import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { CalendarCheck, MapPin, Calendar, Clock, QrCode, Download, CheckCircle, Clock3, XCircle } from 'lucide-react'
import { DashboardLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useMyRegistrations } from '@/services/hooks/registrations/registrations'
import { CARD, CARD_STYLE } from '@/utils/card-styles'


const statusConfig = {
  registered: { label: 'Confirmed', color: 'bg-blue-100 text-[#082F49] border-blue-200', icon: CheckCircle, iconColor: 'text-[#082F49]' },
  waitlisted: { label: 'Waitlisted', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock3, iconColor: 'text-amber-500' },
  attended: { label: 'Attended', color: 'bg-primary/10 text-primary border-primary/20', icon: CheckCircle, iconColor: 'text-primary' },
  cancelled: { label: 'Cancelled', color: 'bg-slate-100 text-slate-500 border-slate-200', icon: XCircle, iconColor: 'text-slate-400' },
}

const RegistrationsPage: NextPageWithLayout = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { data: registrations = [], isLoading } = useMyRegistrations()

  const confirmed = registrations.filter((r) => r.status === 'registered').length
  const attended = registrations.filter((r) => r.status === 'attended').length
  const waitlisted = registrations.filter((r) => r.status === 'waitlisted').length

  const handleDownloadQR = (qrToken: string, eventTitle: string) => {
    const svg = document.getElementById(`qr-${qrToken}`)
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 340
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, 300, 340)
      ctx.drawImage(img, 25, 20, 250, 250)
      ctx.fillStyle = '#0f172a'
      ctx.font = 'bold 16px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(qrToken, 150, 300)
      ctx.font = '12px Arial'
      ctx.fillStyle = '#64748b'
      ctx.fillText(eventTitle, 150, 322)
      const link = document.createElement('a')
      link.download = `${qrToken}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  return (
    <div>
      <PageHeader
        eyebrow="My Registrations"
        title="My QR Codes"
        subtitle="Show your QR code at the event entrance for check-in."
        icon={<QrCode size={14} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Confirmed" value={String(confirmed)} icon={<CheckCircle size={20} />} progress={Math.min(confirmed * 20, 100)} />
        <StatCard label="Attended" value={String(attended)} icon={<CalendarCheck size={20} />} progress={attended > 0 ? 75 : 0} accent="#082F49" />
        <StatCard label="Waitlisted" value={String(waitlisted)} icon={<Clock3 size={20} />} progress={waitlisted > 0 ? 40 : 0} accent="#f59e0b" />
      </div>

      <div className={CARD} style={CARD_STYLE}>
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">Loading registrations...</div>
        ) : registrations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted grid place-items-center mb-4">
              <QrCode size={28} className="text-muted-foreground" />
            </div>
            <p className="font-bold mb-1">No registrations yet</p>
            <p className="text-sm text-muted-foreground">Register for an event and your QR code will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {registrations.map((reg) => {
              const config = statusConfig[reg.status] ?? statusConfig.registered
              const StatusIcon = config.icon
              const isExpanded = expandedId === reg._id
              const showQR = reg.status === 'registered' || reg.status === 'attended'

              return (
                <div key={reg._id} className="rounded-2xl border border-slate-100 overflow-hidden bg-white shadow-sm">
                  <div className="p-4 md:p-5 flex items-start gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border', config.color)}>
                          <StatusIcon size={11} />
                          {config.label}
                        </span>
                        {reg.event?.category && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                            {reg.event.category}
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-base mb-1">{reg.event?.title}</p>
                      <div className="flex flex-col gap-1">
                        {reg.event?.date && (
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {new Date(reg.event.date).toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            {reg.event.time && (
                              <><Clock size={13} className="text-muted-foreground ml-1" /><span className="text-sm text-muted-foreground">{reg.event.time}</span></>
                            )}
                          </div>
                        )}
                        {reg.event?.venue && (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{reg.event.venue}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/50">
                        <QrCode size={13} className="text-muted-foreground" />
                        <span className="font-mono text-xs font-semibold text-slate-600">{reg.qrToken}</span>
                      </div>
                      {showQR && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : reg._id)}
                          className="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-[#061e35] transition-colors"
                        >
                          {isExpanded ? 'Hide' : 'View QR'}
                        </button>
                      )}
                    </div>
                  </div>

                  {reg.status === 'waitlisted' && (
                    <div className="px-5 pb-4 pt-0">
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                        <p className="text-sm text-amber-700 font-medium">You're on the waitlist. You'll receive an email and your QR code will appear here automatically if a spot opens up.</p>
                      </div>
                    </div>
                  )}

                  {showQR && isExpanded && (
                    <div className="border-t border-slate-100 p-6 flex flex-col items-center bg-slate-50/60">
                      <p className="text-sm font-semibold text-muted-foreground mb-5 text-center">Present this QR code at the event entrance</p>

                      <div className="p-5 bg-white rounded-2xl shadow-md border border-slate-200/50 inline-block mb-4">
                        <QRCodeSVG
                          id={`qr-${reg.qrToken}`}
                          value={reg.qrToken}
                          size={200}
                          bgColor="#ffffff"
                          fgColor="#0f172a"
                          level="M"
                        />
                      </div>

                      <p className="font-mono text-lg font-bold text-primary tracking-widest mb-1">{reg.qrToken}</p>
                      <p className="text-xs text-muted-foreground mb-5">{reg.event?.title}</p>

                      <button
                        onClick={() => handleDownloadQR(reg.qrToken, reg.event?.title ?? '')}
                        className="flex items-center gap-2 px-5 py-2 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors"
                      >
                        <Download size={14} />
                        Download QR
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

RegistrationsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default RegistrationsPage
