import React, { useState, useRef, useEffect } from 'react'
import { CalendarCheck, Calendar, MapPin, Users, MoreVertical, Plus, X, Loader2 } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useEvents, useCreateEvent, useDeleteEvent } from '@/services/hooks/events/events'
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
const INPUT = 'w-full h-10 px-3 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'

const AdminEventsPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({ title: '', date: '', venue: '', category: 'Summit', capacity: '' })
  const menuRef = useRef<HTMLDivElement>(null)

  const { data: eventsData, isLoading } = useEvents({ limit: 100 })
  const createEvent = useCreateEvent()
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

  const handleCreate = () => {
    if (!createForm.title || !createForm.date || !createForm.venue || !createForm.capacity) {
      toast.error('Please fill all required fields')
      return
    }
    createEvent.mutate(
      { title: createForm.title, date: createForm.date, venue: createForm.venue, category: createForm.category, capacity: Number(createForm.capacity) },
      {
        onSuccess: () => { toast.success('Event created'); setShowCreate(false); setCreateForm({ title: '', date: '', venue: '', category: 'Summit', capacity: '' }) },
        onError: () => toast.error('Failed to create event'),
      }
    )
  }

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
        eyebrow="Event Management"
        title="Events"
        subtitle="Create, edit, and manage all YLSH events and sessions."
        icon={<CalendarCheck size={14} />}
        action={
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/50 text-white text-sm font-bold hover:bg-white/10 transition-colors">
            <Plus size={16} /> Create event
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total events" value={isLoading ? '—' : String(events.length)} icon={<CalendarCheck size={20} />} progress={100} />
        <StatCard label="Upcoming" value={isLoading ? '—' : String(tabCounts[1])} icon={<Calendar size={20} />} progress={events.length ? (tabCounts[1] / events.length) * 100 : 0} accent="#3b82f6" />
        <StatCard label="Total registered" value={isLoading ? '—' : totalRegistered.toLocaleString()} icon={<Users size={20} />} progress={75} accent="#f59e0b" />
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

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(8,47,73,0.55)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Create new event</h2>
              <button onClick={() => setShowCreate(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Event title <span className="text-red-500">*</span></label>
                <input value={createForm.title} onChange={(e) => setCreateForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Youth Innovation Forum 2026" className={INPUT} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Date <span className="text-red-500">*</span></label>
                  <input type="date" value={createForm.date} onChange={(e) => setCreateForm((p) => ({ ...p, date: e.target.value }))} className={INPUT} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Capacity <span className="text-red-500">*</span></label>
                  <input type="number" value={createForm.capacity} onChange={(e) => setCreateForm((p) => ({ ...p, capacity: e.target.value }))} placeholder="e.g. 200" className={INPUT} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Venue <span className="text-red-500">*</span></label>
                <input value={createForm.venue} onChange={(e) => setCreateForm((p) => ({ ...p, venue: e.target.value }))} placeholder="e.g. Transcorp Hilton, Abuja" className={INPUT} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Category</label>
                <select value={createForm.category} onChange={(e) => setCreateForm((p) => ({ ...p, category: e.target.value }))} className={INPUT}>
                  {['Summit', 'Workshop', 'Masterclass', 'Bootcamp', 'Conference', 'Forum'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 h-11 rounded-full border border-border font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleCreate} disabled={createEvent.isPending} className="flex-1 h-11 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {createEvent.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Create event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

AdminEventsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>
export default AdminEventsPage
