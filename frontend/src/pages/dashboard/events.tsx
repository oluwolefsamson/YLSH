import React, { useState } from 'react'
import { CalendarCheck, MapPin, Calendar, Users, QrCode, Clock } from 'lucide-react'
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

const EventsPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const filtered = tab === 0 ? events : tab === 1 ? events.filter((e) => e.status === 'upcoming') : events.filter((e) => e.status === 'past')

  return (
    <div>
      <PageHeader eyebrow="Events" title="Events & Sessions" subtitle="Browse upcoming events, register, and track attendance. Your QR codes appear in My Registrations below." icon={<CalendarCheck size={14} />} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Registered" value="2" icon={<CalendarCheck size={20} />} progress={50} />
        <StatCard label="Upcoming" value="1" icon={<Calendar size={20} />} progress={25} accent="#3b82f6" />
        <StatCard label="Attended" value="1" icon={<Users size={20} />} progress={25} accent="#f59e0b" />
      </div>

      <div className={cn(CARD, 'mb-5')} style={CARD_STYLE}>
        <div className="flex gap-1 border-b border-slate-200/18 mb-5">
          {TABS.map((label, i) => (
            <button key={label} onClick={() => setTab(i)} className={cn('px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors', tab === i ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              {label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((event) => (
            <div key={event.id} className="flex flex-col p-5 rounded-xl border border-slate-200/18">
              <div className="flex items-start justify-between mb-3">
                <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', categoryBadge[event.category] ?? 'bg-muted text-muted-foreground')}>{event.category}</span>
                <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border', event.registered >= event.capacity ? 'border-red-300 text-red-600' : 'border-green-300 text-green-700')}>
                  {event.registered >= event.capacity ? 'Full' : 'Open'}
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
              <button disabled={event.status === 'past'} className="w-full h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] disabled:opacity-50 disabled:cursor-default transition-colors">
                {event.status === 'past' ? 'Event ended' : event.registered >= event.capacity ? 'Join waitlist' : 'Register'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={CARD} style={CARD_STYLE}>
        <h2 className="text-xl font-bold mb-4">My Registrations & QR Codes</h2>
        <div className="flex flex-col gap-3">
          {myRegistrations.map((reg) => (
            <div key={reg.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/18 flex-wrap">
              <div>
                <p className="font-bold">{reg.eventTitle}</p>
                <p className="text-sm text-muted-foreground">{reg.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/22 text-sm">
                  <QrCode size={14} className="text-muted-foreground" />
                  <span className="font-mono text-xs font-semibold">{reg.qrToken}</span>
                </div>
                <button className="px-4 py-1.5 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors">View QR</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

EventsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default EventsPage
