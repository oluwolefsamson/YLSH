import React, { useState, useRef, useEffect } from 'react'
import { CalendarCheck, Calendar, MapPin, Users, MoreVertical, Plus, X, Loader2, Search, Download } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useEvents, useEvent, useCreateEvent, useDeleteEvent } from '@/services/hooks/events/events'
import { getEventAttendees } from '@/services/endpoints/events/events'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DatePicker from '@/components/ui/date-picker'
import { CARD, CARD_STYLE } from '@/utils/card-styles'


const categoryBadge: Record<string, string> = {
  Summit: 'bg-primary/10 text-primary',
  Workshop: 'bg-blue-100 text-[#082F49]',
  Masterclass: 'bg-amber-100 text-amber-700',
  Bootcamp: 'bg-purple-100 text-purple-700',
  Forum: 'bg-muted text-muted-foreground',
  Conference: 'bg-blue-100 text-blue-700',
}

function formatEventDate(date: string, endDate?: string): string {
  const start = new Date(date + 'T00:00:00')
  if (!endDate) return start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const end = new Date(endDate + 'T00:00:00')
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()}–${end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
  }
  return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

function formatEventDateLong(date: string, endDate?: string): string {
  const start = new Date(date + 'T00:00:00')
  if (!endDate) return start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const end = new Date(endDate + 'T00:00:00')
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()}–${end.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
  }
  return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} – ${end.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
}

const TABS = ['All', 'Upcoming', 'Past']
const INPUT = 'w-full h-10 px-3 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'

const AdminEventsPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({ title: '', date: '', endDate: '', venue: '', category: 'Summit', capacity: '' })
  const [limitCapacity, setLimitCapacity] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null)
  const [viewId, setViewId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  const { data: eventsData, isLoading } = useEvents({ limit: 100 })
  const { data: viewEvent, isLoading: viewLoading } = useEvent(viewId ?? '')
  const createEvent = useCreateEvent()
  const deleteEvent = useDeleteEvent()
  const events = eventsData?.data ?? []

  const q = search.toLowerCase().trim()
  const tabFiltered = tab === 0 ? events
    : tab === 1 ? events.filter((e) => e.status === 'upcoming' || e.status === 'ongoing')
    : events.filter((e) => e.status === 'past')
  const filtered = q ? tabFiltered.filter((e) => e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)) : tabFiltered

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
    if (!createForm.title || !createForm.date || !createForm.venue) {
      toast.error('Please fill all required fields')
      return
    }
    if (createForm.endDate && createForm.endDate < createForm.date) {
      toast.error('End date must be on or after the start date')
      return
    }
    if (limitCapacity && !createForm.capacity) {
      toast.error('Please enter a capacity or disable the limit')
      return
    }
    const payload: Parameters<typeof createEvent.mutate>[0] = { title: createForm.title, date: createForm.date, venue: createForm.venue, category: createForm.category }
    if (createForm.endDate) payload.endDate = createForm.endDate
    if (limitCapacity && createForm.capacity) payload.capacity = Number(createForm.capacity)
    createEvent.mutate(payload, {
      onSuccess: () => { toast.success('Event created'); setShowCreate(false); setCreateForm({ title: '', date: '', endDate: '', venue: '', category: 'Summit', capacity: '' }); setLimitCapacity(false) },
      onError: () => toast.error('Failed to create event'),
    })
  }

  const [exportingId, setExportingId] = useState<string | null>(null)

  const handleExportCSV = async (eventId: string, eventTitle: string) => {
    setExportingId(eventId)
    setMenuId(null)
    try {
      const { data } = await getEventAttendees(eventId)
      const rows = [
        ['Name', 'Email', 'Phone', 'Status', 'Checked In At', 'Registered At'],
        ...data.map((r) => [
          `${r.user.firstName} ${r.user.lastName}`,
          r.user.email,
          r.user.phone ?? '',
          r.status,
          r.checkedInAt ? new Date(r.checkedInAt).toLocaleString() : '',
          new Date(r.createdAt).toLocaleString(),
        ]),
      ]
      const csv = rows.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${eventTitle.replace(/\s+/g, '_')}_attendees.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Failed to export attendees')
    } finally {
      setExportingId(null)
    }
  }

  const handleDelete = () => {
    if (!confirmDelete) return
    deleteEvent.mutate(confirmDelete.id, {
      onSuccess: () => { toast.success('Event deleted'); setConfirmDelete(null) },
      onError: () => toast.error('Failed to delete event'),
    })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Event Management"
        title="Events"
        subtitle="Create, edit, and manage all YLSH events and sessions."
        icon={<CalendarCheck size={14} />}
        action={
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#082F49] text-white text-sm font-bold shadow-md hover:bg-[#061e35] transition-colors">
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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title, venue or category..." className="w-full h-10 pl-9 pr-4 rounded-full border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          {TABS.map((label, i) => (
            <button
              key={label}
              onClick={() => setTab(i)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold border transition-colors whitespace-nowrap',
                tab === i
                  ? 'bg-primary text-white border-primary'
                  : 'bg-background text-foreground border-input hover:bg-muted'
              )}
            >
              {label} ({tabCounts[i]})
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-primary" /></div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Event</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Venue</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Registration</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-16 text-center text-muted-foreground">No events in this category.</td></tr>
                ) : filtered.map((event) => (
                  <tr key={event._id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-4 py-3.5 font-semibold text-foreground">{event.title}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold', categoryBadge[event.category] ?? 'bg-muted text-muted-foreground')}>{event.category}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold capitalize border', event.status === 'upcoming' ? 'border-blue-200 bg-blue-50 text-[#082F49]' : 'border-slate-200 bg-slate-50 text-slate-600')}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">{formatEventDate(event.date, event.endDate)}</td>
                    <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">{event.venue}</td>
                    <td className="px-4 py-3.5 min-w-[220px]">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="text-xs text-muted-foreground">Registration</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{event.capacity ? `${event.registeredCount}/${event.capacity}` : `${event.registeredCount} registered - Unlimited`}</span>
                      </div>
                      {event.capacity ? (
                        <div className="h-[6px] rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(148,163,184,0.18)' }}>
                          <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }} />
                        </div>
                      ) : <div className="h-[6px] rounded-full" style={{ backgroundColor: 'rgba(148,163,184,0.18)' }} />}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => { setViewId(event._id); setMenuId(null) }} className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-primary hover:border-primary/40 transition-colors" title="View details"><MoreVertical size={14} /></button>
                        <button onClick={() => handleExportCSV(event._id, event.title)} disabled={exportingId === event._id} className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-primary hover:border-primary/40 transition-colors disabled:opacity-50" title="Export CSV">{exportingId === event._id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}</button>
                        <button onClick={() => { setConfirmDelete({ id: event._id, title: event.title }); setMenuId(null) }} className="w-8 h-8 flex items-center justify-center rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors" title="Delete event"><X size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 grid place-items-center mx-auto mb-4">
              <X size={22} className="text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-center mb-1">Delete Event?</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              <span className="font-semibold text-foreground">{confirmDelete.title}</span> will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-11 rounded-full border border-border font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={deleteEvent.isPending} className="flex-1 h-11 rounded-full bg-red-600 text-white font-bold text-sm hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {deleteEvent.isPending ? <Loader2 size={15} className="animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(8,47,73,0.55)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {viewLoading ? (
                  <div className="h-7 w-48 bg-muted rounded-lg animate-pulse" />
                ) : (
                  <>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', categoryBadge[viewEvent?.category ?? ''] ?? 'bg-muted text-muted-foreground')}>{viewEvent?.category}</span>
                      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border', viewEvent?.status === 'upcoming' ? 'border-blue-300 text-[#082F49]' : 'border-border text-muted-foreground')}>{viewEvent?.status}</span>
                    </div>
                    <h2 className="text-xl font-bold leading-snug">{viewEvent?.title}</h2>
                  </>
                )}
              </div>
              <button onClick={() => setViewId(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors flex-shrink-0">
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[65vh]">
              {viewLoading ? (
                <div className="flex flex-col gap-3">{[1, 2, 3].map(i => <div key={i} className="h-5 bg-muted rounded-lg animate-pulse" />)}</div>
              ) : viewEvent ? (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <Calendar size={15} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">Date</p>
                        <p className="text-sm font-semibold">{formatEventDateLong(viewEvent.date, viewEvent.endDate)}</p>
                        {viewEvent.time && <p className="text-xs text-muted-foreground mt-0.5">{viewEvent.time}</p>}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <MapPin size={15} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">Venue</p>
                        <p className="text-sm font-semibold">{viewEvent.venue}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold flex items-center gap-1.5"><Users size={13} className="text-primary" /> Registration</p>
                      <p className="text-sm font-bold text-primary">{viewEvent.capacity ? `${viewEvent.registeredCount} / ${viewEvent.capacity}` : `${viewEvent.registeredCount} registered · Unlimited`}</p>
                    </div>
                    {viewEvent.capacity ? (
                      <div className="h-2 rounded-full overflow-hidden bg-slate-200">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((viewEvent.registeredCount / viewEvent.capacity) * 100, 100)}%` }} />
                      </div>
                    ) : (
                      <div className="h-2 rounded-full bg-slate-200" />
                    )}
                  </div>

                  {viewEvent.description && (
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Description</p>
                      <p className="text-sm text-foreground leading-relaxed">{viewEvent.description}</p>
                    </div>
                  )}

                  {viewEvent.speakers?.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Speakers</p>
                      <div className="flex flex-col gap-2">
                        {viewEvent.speakers.map((s) => (
                          <div key={s._id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">{s.name.charAt(0).toUpperCase()}</div>
                            <div>
                              <p className="text-sm font-semibold">{s.name}</p>
                              {s.topic && <p className="text-xs text-muted-foreground">{s.topic}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {viewEvent.tags && viewEvent.tags.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {viewEvent.tags.map((tag) => <span key={tag} className="px-2.5 py-1 rounded-full bg-muted text-xs font-semibold text-muted-foreground">{tag}</span>)}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-xs text-muted-foreground">Created {new Date(viewEvent.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Failed to load event details.</p>
              )}
            </div>
          </div>
        </div>
      )}

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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Start date <span className="text-red-500">*</span></label>
                  <DatePicker value={createForm.date} onChange={(v) => setCreateForm((p) => ({ ...p, date: v, endDate: p.endDate && p.endDate < v ? '' : p.endDate }))} placeholder="Pick start date" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">End date <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <DatePicker value={createForm.endDate} onChange={(v) => setCreateForm((p) => ({ ...p, endDate: v }))} placeholder="Pick end date" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold">Capacity</label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-xs text-muted-foreground">{limitCapacity ? 'Limited' : 'Unlimited'}</span>
                    <div onClick={() => { setLimitCapacity((v) => !v); setCreateForm((p) => ({ ...p, capacity: '' })) }} className={cn('w-9 h-5 rounded-full transition-colors relative', limitCapacity ? 'bg-primary' : 'bg-slate-200')}>
                      <div className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all', limitCapacity ? 'left-4' : 'left-0.5')} />
                    </div>
                  </label>
                </div>
                {limitCapacity
                  ? <input type="number" min={1} value={createForm.capacity} onChange={(e) => setCreateForm((p) => ({ ...p, capacity: e.target.value }))} placeholder="e.g. 200" className={INPUT} />
                  : <div className="h-10 px-3 flex items-center rounded-xl border border-input bg-muted text-sm text-muted-foreground">No limit — anyone can register</div>
                }
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Venue <span className="text-red-500">*</span></label>
                <input value={createForm.venue} onChange={(e) => setCreateForm((p) => ({ ...p, venue: e.target.value }))} placeholder="e.g. Transcorp Hilton, Abuja" className={INPUT} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Category</label>
                <Select value={createForm.category} onValueChange={(v) => setCreateForm((p) => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Summit', 'Workshop', 'Masterclass', 'Bootcamp', 'Conference', 'Forum'].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 h-11 rounded-full border border-border font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleCreate} disabled={createEvent.isPending} className="flex-1 h-11 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#061e35] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
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
