import React, { useState, useEffect } from 'react'
import { CalendarCheck, Save, Loader2 } from 'lucide-react'
import { MentorLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useMyMentorProfile, useUpdateAvailability } from '@/services/hooks/mentors/mentors'
import type { AvailabilitySlots } from '@/types'
import { toast } from 'sonner'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }
const INPUT = 'w-full h-10 px-3 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    role="switch"
    aria-checked={checked}
    className={cn('relative inline-flex h-6 w-10 items-center rounded-full transition-colors flex-shrink-0', checked ? 'bg-primary' : 'bg-gray-200')}
  >
    <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform mx-1', checked ? 'translate-x-4' : 'translate-x-0')} />
  </button>
)

const AvailabilityPage: NextPageWithLayout = () => {
  const [availability, setAvailability] = useState<Record<string, boolean>>(
    Object.fromEntries(days.map((d) => [d, false]))
  )
  const [slots, setSlots] = useState<AvailabilitySlots>({ from: '09:00', to: '17:00' })
  const [sessionDuration, setSessionDuration] = useState('60')
  const [maxPerWeek, setMaxPerWeek] = useState('5')

  const { data: profile, isLoading } = useMyMentorProfile()
  const updateAvailability = useUpdateAvailability()

  useEffect(() => {
    if (!profile) return
    if (profile.availableDays?.length) {
      const map = Object.fromEntries(days.map((d) => [d, false]))
      profile.availableDays.forEach((d) => { if (d in map) map[d] = true })
      setAvailability(map)
    }
    if (profile.startTime) setSlots((p) => ({ ...p, from: profile.startTime }))
    if (profile.endTime) setSlots((p) => ({ ...p, to: profile.endTime }))
    if (profile.sessionDuration) setSessionDuration(String(profile.sessionDuration))
    if (profile.maxPerWeek) setMaxPerWeek(String(profile.maxPerWeek))
  }, [profile])

  const toggle = (day: string) => setAvailability((prev) => ({ ...prev, [day]: !prev[day] }))

  const handleSave = () => {
    const availableDays = days.filter((d) => availability[d])
    updateAvailability.mutate(
      {
        availableDays,
        startTime: slots.from,
        endTime: slots.to,
        sessionDuration: Number(sessionDuration),
        maxPerWeek: Number(maxPerWeek),
      },
      {
        onSuccess: () => toast.success('Availability saved'),
        onError: () => toast.error('Failed to save availability'),
      }
    )
  }

  const availableDaysList = days.filter((d) => availability[d])

  if (isLoading) return (
    <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-primary" /></div>
  )

  return (
    <div>
      <PageHeader eyebrow="Availability" title="Availability Settings" subtitle="Set the days and hours you are available. Mentees will only be able to book slots within your configured availability." icon={<CalendarCheck size={14} />} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={CARD} style={CARD_STYLE}>
          <p className="font-bold mb-5">Available Days</p>
          <div className="flex flex-col gap-3">
            {days.map((day) => (
              <div key={day} className="flex items-center justify-between">
                <span className={cn('font-medium', availability[day] ? 'text-foreground' : 'text-muted-foreground')}>{day}</span>
                <div className="flex items-center gap-2">
                  {availability[day] && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Available</span>
                  )}
                  <Toggle checked={availability[day]} onChange={() => toggle(day)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className={CARD} style={CARD_STYLE}>
            <p className="font-bold mb-4">Session Hours</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">From</label>
                <input type="time" value={slots.from} onChange={(e) => setSlots((p) => ({ ...p, from: e.target.value }))} className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">To</label>
                <input type="time" value={slots.to} onChange={(e) => setSlots((p) => ({ ...p, to: e.target.value }))} className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Session duration (min)</label>
                <input type="number" value={sessionDuration} onChange={(e) => setSessionDuration(e.target.value)} className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Max sessions / week</label>
                <input type="number" value={maxPerWeek} onChange={(e) => setMaxPerWeek(e.target.value)} className={INPUT} />
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, rgba(8,47,73,0.97) 0%, rgba(18,124,113,0.97) 100%)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }}>
            <p className="font-bold mb-2">Summary</p>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
              You are available on <strong>{availableDaysList.join(', ') || 'no days'}</strong> between <strong>{slots.from}</strong> and <strong>{slots.to}</strong>, with <strong>{sessionDuration}-minute</strong> sessions, up to <strong>{maxPerWeek} per week</strong>.
            </p>
            <button
              onClick={handleSave}
              disabled={updateAvailability.isPending}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-full font-bold text-sm transition-colors disabled:opacity-50"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.25)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.15)' }}
            >
              {updateAvailability.isPending ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save availability</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

AvailabilityPage.getLayout = (page) => <MentorLayout>{page}</MentorLayout>
export default AvailabilityPage
