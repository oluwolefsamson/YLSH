import React, { useState, useRef } from 'react'
import { ScanLine, CheckCircle, XCircle, Loader2, User, Calendar, MapPin } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { useCheckIn } from '@/services/hooks/registrations/registrations'
import type { Registration } from '@/services/endpoints/registrations/registrations'
import { cn } from '@/utils'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }
const INPUT = 'w-full h-12 px-4 rounded-xl border border-input bg-background text-sm font-mono outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors tracking-widest text-center uppercase'

type CheckInResult = { success: true; registration: Registration } | { success: false; message: string }

const CheckInPage: NextPageWithLayout = () => {
  const [token, setToken] = useState('')
  const [result, setResult] = useState<CheckInResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const checkIn = useCheckIn()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = token.trim().toUpperCase()
    if (!trimmed) return
    setResult(null)
    try {
      const data = await checkIn.mutateAsync(trimmed)
      setResult({ success: true, registration: data.registration })
      setToken('')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Check-in failed'
      setResult({ success: false, message: msg })
    }
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleReset = () => { setResult(null); setToken(''); inputRef.current?.focus() }

  return (
    <div>
      <PageHeader
        eyebrow="Event Operations"
        title="QR Check-in"
        subtitle="Scan or type a participant's QR token to mark them as attended."
        icon={<ScanLine size={14} />}
      />

      <div className="max-w-lg mx-auto">
        <div className={CARD} style={CARD_STYLE}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">QR Token</label>
              <input
                ref={inputRef}
                value={token}
                onChange={(e) => setToken(e.target.value.toUpperCase())}
                placeholder="YLS-XXXX-XXXXXXXX"
                className={INPUT}
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
              <p className="text-xs text-muted-foreground mt-1.5 text-center">Type or paste the token shown on the participant's QR code</p>
            </div>
            <button
              type="submit"
              disabled={checkIn.isPending || !token.trim()}
              className="h-12 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {checkIn.isPending ? <><Loader2 size={16} className="animate-spin" /> Checking in...</> : <><ScanLine size={16} /> Check In</>}
            </button>
          </form>
        </div>

        {result && (
          <div className={cn('mt-4 rounded-2xl border overflow-hidden', result.success ? 'border-green-200' : 'border-red-200')}>
            {result.success ? (
              <>
                <div className="flex items-center gap-3 p-4" style={{ backgroundColor: 'rgba(209,250,229,0.5)' }}>
                  <div className="w-10 h-10 rounded-full bg-green-500 grid place-items-center flex-shrink-0">
                    <CheckCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-green-800">Check-in Successful!</p>
                    <p className="text-sm text-green-700">Participant marked as attended</p>
                  </div>
                </div>
                <div className="p-4 bg-white flex flex-col gap-2">
                  {(result.registration.user as unknown as { firstName?: string; lastName?: string })?.firstName && (
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-muted-foreground" />
                      <span className="text-sm font-semibold">
                        {(result.registration.user as unknown as { firstName: string; lastName: string }).firstName}{' '}
                        {(result.registration.user as unknown as { firstName: string; lastName: string }).lastName}
                      </span>
                    </div>
                  )}
                  {(result.registration.event as unknown as { title?: string })?.title && (
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{(result.registration.event as unknown as { title: string }).title}</span>
                    </div>
                  )}
                  {result.registration.checkedInAt && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Checked in at {new Date(result.registration.checkedInAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                  <button onClick={handleReset} className="mt-2 w-full h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] transition-colors">
                    Scan Next
                  </button>
                </div>
              </>
            ) : (
              <div className="p-4 flex items-start gap-3" style={{ backgroundColor: 'rgba(254,226,226,0.5)' }}>
                <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-red-800 mb-1">Check-in Failed</p>
                  <p className="text-sm text-red-700 mb-3">{result.message}</p>
                  <button onClick={handleReset} className="px-4 py-1.5 rounded-full border border-red-300 text-red-700 text-sm font-semibold hover:bg-red-50 transition-colors">
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

CheckInPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>
export default CheckInPage
