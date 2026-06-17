import React, { useState, useRef, useEffect } from 'react'
import { CalendarCheck, Calendar, MapPin, Users, MoreVertical, Plus, Loader2 } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useEvents, useDeleteEvent } from '@/services/hooks/events/events'
import { toast } from 'sonner'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const categoryBadge: Record<string, string> = {
  Summit: 'bg-primary/10 text-primary',
  Workshop: 'bg-green-100 text-green-700',
  Masterclass: 'bg-amber-100 text-amber-700',
  Bootcamp: 'bg-purple-100 text-purple-700',
  Forum: 'bg-muted text-muted-foreground',
  Conference: 'bg-blue-100 text-blue-700',
}
const TABS = ['All', 'Upcoming', 'Past']

const SuperAdminEventsPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const [menuId, setMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const { data: eventsData, isLoading } = useEvents({ limit: 100 })
  const deleteEvent = useDeleteEvent()
  const events = eventsData?.data ?? []

  const filtered = tab === 0 ? events
    : tab === 1 ? events.filter((e) => e.status === 'upcoming' || e.status === 'ongoing')
    : events.filter((e) => e.status === 'past')

  const tabCounts = [
    events.length,
    events.filter((e) => e.status === 'upcoming' || e.status === 'ongoing').length,
    events.filter((e) => e.status === 'past').length,
  ]

  const totalRegistered = events.reduce((s, e) => s + e.registeredCount, 0)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuId(null) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleDelete = (id: string) => {
    deleteEvent.mutate(id, {
      onSuccess: () => toast.success('Event deleted'),
      onError: () => toast.error('Failed to delete event'),
    })
    setMenuId(null)
  }

  return (
    <div>
      <PageHeader
        eyebrow="All Events"
        title="Events"
        subtitle="Full system view of all events across the platform."
        icon={<CalendarCheck size={14} />}
        action={
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/50 text-white text-sm font-bold hover:bg-white/10 transition-colors">
            <Plus size={16} /> Create event
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total events" value={isLoading ? '—' : String(events.length)} icon={<CalendarCheck size={20} />} progress={100} />
        <StatCard label="Upcoming" value={isLoading ? '—' : String(tabCounts[1])} icon={<Calendar size={20} />} progress={events.length ? (tabCounts[1] / events.length) * 100 : 0} accent="#3b82f6" />
        <StatCard label="Total registered" value={isLoading ? '—' : totalRegistered.toLocaleString()} icon={<Users size={20} />} progress={82} accent="#f59e0b" />
      </div>

      <div className={CARD} style={CARD_STYLE} ref={menuRef}>
        <div className="flex gap-1 border-b border-slate-200/18 mb-5 overflow-x-auto">
          {TABS.map((label, i) => (
            <button key={label} onClick={() => setTab(i)} className={cn('px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors whitespace-nowrap', tab === i ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              {label} ({tabCounts[i]})
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center">No events in this category.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((event) => (
              <div key={event._id} className="p-4 rounded-xl border border-slate-200/18">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <p className="font-bold">{event.title}</p>
                      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', categoryBadge[event.category] ?? 'bg-muted text-muted-foreground')}>{event.category}</span>
                      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border', event.status === 'upcoming' ? 'border-green-300 text-green-700' : 'border-border text-muted-foreground')}>{event.status}</span>
                    </div>
                    <div className="flex gap-4 flex-wrap mb-3">
                      <div className="flex items-center gap-1.5"><Calendar size={13} className="text-muted-foreground" /><span className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                      <div className="flex items-center gap-1.5"><MapPin size={13} className="text-muted-foreground" /><span className="text-sm text-muted-foreground">{event.venue}</span></div>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Registration</span>
                      <span className="text-xs text-muted-foreground">{event.registeredCount}/{event.capacity}</span>
                    </div>
                    <div className="h-[6px] rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(148,163,184,0.18)' }}>
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <div className="relative flex-shrink-0">
                    <button onClick={() => setMenuId(menuId === event._id ? null : event._id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                      <MoreVertical size={16} className="text-muted-foreground" />
                    </button>
                    {menuId === event._id && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200/50 rounded-xl shadow-lg py-1 z-50 min-w-[160px]">
                        <button onClick={() => setMenuId(null)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors">View details</button>
                        <button onClick={() => handleDelete(event._id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Delete event</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

SuperAdminEventsPage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>
export default SuperAdminEventsPage
