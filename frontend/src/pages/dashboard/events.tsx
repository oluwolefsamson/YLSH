import React, { useState } from 'react'
import { CalendarCheck, MapPin, Calendar, Users, QrCode, Clock, X, CheckCircle } from 'lucide-react'
import { DashboardLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const events = [
  { id: 1, title: 'Youth Leadership Summit 2026', date: 'Jul 15, 2026', time: '9:00 AM – 5:00 PM', venue: 'Transcorp Hilton, Abuja', category: 'Summit', capacity: 500, registered: 412, description: 'Annual flagship event for young Nigerian leaders covering tech, entrepreneurship, and governance.', status: 'upcoming' },
  { id: 2, title: 'Digital Skills Bootcamp', date: 'Jun 28, 2026', time: '10:00 AM – 3:00 PM', venue: 'Co-Creation Hub, Lagos', category: 'Workshop', capacity: 150, registered: 148, description: 'Hands-on bootcamp covering data analysis, frontend development, and AI fundamentals.', status: 'upcoming' },
  { id: 3, title: 'Entrepreneurship Masterclass', date: 'Jun 20, 2026', time: '2:00 PM – 6:00 PM', venue: 'Virtual (Zoom)', category: 'Masterclass', capacity: 300, registered: 300, description: 'Deep dive into building sustainable startups with seasoned founders and investors.', status: 'upcoming' },
  { id: 4, title: 'Climate Action Workshop', date: 'May 10, 2026', time: '9:00 AM – 1:00 PM', venue: 'University of Lagos Auditorium', category: 'Workshop', capacity: 200, registered: 185, description: 'Exploring youth-led climate solutions and policy advocacy for West Africa.', status: 'past' },
]

const myRegistrations = [
  { id: 1, eventTitle: 'Youth Leadership Summit 2026', date: 'Jul 15, 2026', qrToken: 'YLS-2026-A7X9' },
  { id: 4, eventTitle: 'Climate Action Workshop', date: 'May 10, 2026', qrToken: 'CAW-2026-B3K1' },
]

const categoryBadge: Record<string, string> = {
  Summit: 'bg-primary/10 text-primary',
  Workshop: 'bg-green-100 text-green-700',
  Masterclass: 'bg-amber-100 text-amber-700',
}

const TABS = ['All Events', 'Upcoming', 'Past']

type Event = typeof events[0]

const EventsPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const [expandedQR, setExpandedQR] = useState<string | null>(null)
  const [registerModal, setRegisterModal] = useState<Event | null>(null)
  const [registeredIds, setRegisteredIds] = useState<Set<number>>(new Set([1, 4]))
  const [waitlistIds, setWaitlistIds] = useState<Set<number>>(new Set())
  const [registerDone, setRegisterDone] = useState(false)

  const filtered = tab === 0 ? events : tab === 1 ? events.filter((e) => e.status === 'upcoming') : events.filter((e) => e.status === 'past')

  const handleRegisterConfirm = (event: Event) => {
    if (event.registered >= event.capacity) {
      setWaitlistIds((prev) => new Set(prev).add(event.id))
    } else {
      setRegisteredIds((prev) => new Set(prev).add(event.id))
    }
    setRegisterDone(true)
  }

  const openRegisterModal = (event: Event) => {
    setRegisterDone(false)
    setRegisterModal(event)
  }

  const closeRegisterModal = () => {
    setRegisterModal(null)
    setRegisterDone(false)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Events"
        title="Events & Sessions"
        subtitle="Browse upcoming events, register, and track attendance. Your QR codes appear in My Registrations below."
        icon={<CalendarCheck size={14} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Registered" value="2" icon={<CalendarCheck size={20} />} progress={50} />
        <StatCard label="Upcoming" value="1" icon={<Calendar size={20} />} progress={25} accent="#3b82f6" />
        <StatCard label="Attended" value="1" icon={<Users size={20} />} progress={25} accent="#f59e0b" />
      </div>

      <div className={cn(CARD, 'mb-5')} style={CARD_STYLE}>
        <div className="flex gap-1 border-b border-slate-200/18 mb-5">
          {TABS.map((label, i) => (
            <button
              key={label}
              onClick={() => setTab(i)}
              className={cn('px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors', tab === i ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((event) => {
            const isRegistered = registeredIds.has(event.id)
            const isWaitlisted = waitlistIds.has(event.id)
            const isFull = event.registered >= event.capacity
            return (
              <div key={event.id} className="flex flex-col p-5 rounded-xl border border-slate-200/18">
                <div className="flex items-start justify-between mb-3">
                  <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', categoryBadge[event.category] ?? 'bg-muted text-muted-foreground')}>{event.category}</span>
                  <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border', isFull ? 'border-red-300 text-red-600' : 'border-green-300 text-green-700')}>
                    {isFull ? 'Full' : 'Open'}
                  </span>
                </div>
                <h3 className="font-bold mb-1">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 flex-1">{event.description}</p>
                <div className="flex flex-col gap-1.5 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{event.date}</span>
                    <Clock size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{event.registered}/{event.capacity} registered</span>
                  </div>
                </div>
                {event.status === 'past' ? (
                  <button disabled className="w-full h-10 rounded-full border border-border text-muted-foreground font-bold text-sm cursor-default">
                    Event ended
                  </button>
                ) : isRegistered ? (
                  <button disabled className="w-full h-10 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center justify-center gap-2 cursor-default">
                    <CheckCircle size={15} /> Registered
                  </button>
                ) : isWaitlisted ? (
                  <button disabled className="w-full h-10 rounded-full bg-amber-100 text-amber-700 font-bold text-sm cursor-default">
                    On waitlist
                  </button>
                ) : (
                  <button
                    onClick={() => openRegisterModal(event)}
                    className="w-full h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] transition-colors"
                  >
                    {isFull ? 'Join waitlist' : 'Register'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className={CARD} style={CARD_STYLE}>
        <h2 className="text-xl font-bold mb-4">My Registrations & QR Codes</h2>
        <div className="flex flex-col gap-3">
          {myRegistrations.map((reg) => (
            <div key={reg.id} className="rounded-xl border border-slate-200/18 overflow-hidden">
              <div className="flex items-center justify-between gap-4 p-4 flex-wrap">
                <div>
                  <p className="font-bold">{reg.eventTitle}</p>
                  <p className="text-sm text-muted-foreground">{reg.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/22 text-sm">
                    <QrCode size={14} className="text-muted-foreground" />
                    <span className="font-mono text-xs font-semibold">{reg.qrToken}</span>
                  </div>
                  <button
                    onClick={() => setExpandedQR(expandedQR === reg.qrToken ? null : reg.qrToken)}
                    className="px-4 py-1.5 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors"
                  >
                    {expandedQR === reg.qrToken ? 'Hide QR' : 'View QR'}
                  </button>
                </div>
              </div>
              {expandedQR === reg.qrToken && (
                <div className="border-t border-slate-200/18 p-5 text-center" style={{ backgroundColor: 'rgba(18,124,113,0.04)' }}>
                  <div className="w-28 h-28 mx-auto rounded-2xl border-4 border-primary/25 grid place-items-center mb-3" style={{ backgroundColor: 'rgba(18,124,113,0.06)' }}>
                    <QrCode size={56} className="text-primary" />
                  </div>
                  <p className="font-mono text-sm font-bold text-primary mb-1">{reg.qrToken}</p>
                  <p className="text-xs text-muted-foreground">Present this QR code at the event entrance for check-in</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Register / Waitlist Modal */}
      {registerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeRegisterModal} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            {!registerDone ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">
                    {registerModal.registered >= registerModal.capacity ? 'Join Waitlist' : 'Confirm Registration'}
                  </h3>
                  <button onClick={closeRegisterModal} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-muted mb-4">
                  <p className="font-bold mb-1">{registerModal.title}</p>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{registerModal.date} · {registerModal.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{registerModal.venue}</span>
                    </div>
                  </div>
                </div>
                {registerModal.registered >= registerModal.capacity && (
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                    This event is full. You'll be added to the waitlist and notified if a slot opens.
                  </p>
                )}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Registered as</label>
                  <div className="h-10 px-3 rounded-xl border border-input bg-muted text-sm flex items-center font-medium">Amina Bello</div>
                </div>
                <div className="flex gap-3">
                  <button onClick={closeRegisterModal} className="flex-1 h-10 rounded-full border-2 border-slate-300 text-foreground font-semibold text-sm hover:bg-muted transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRegisterConfirm(registerModal)}
                    className="flex-1 h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] transition-colors"
                  >
                    {registerModal.registered >= registerModal.capacity ? 'Join Waitlist' : 'Confirm'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 grid place-items-center mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">
                    {waitlistIds.has(registerModal.id) ? 'Added to Waitlist!' : 'Registration Confirmed!'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    {waitlistIds.has(registerModal.id)
                      ? "We'll notify you when a slot becomes available."
                      : 'Your QR code will appear in My Registrations below.'}
                  </p>
                  <button onClick={closeRegisterModal} className="w-full h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] transition-colors">
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

EventsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default EventsPage
