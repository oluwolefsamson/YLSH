import React, { useState } from "react"
import { toast } from "sonner"
import { CalendarCheck, MapPin, Calendar, Users, QrCode, Clock, X, CheckCircle } from "lucide-react"
import { DashboardLayout } from "@/components/layout"
import { PageHeader, StatCard } from "@/components/dashboard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NextPageWithLayout } from "@/interfaces/layout"
import { cn } from "@/utils"
import { useEvents, useRegisterForEvent, useCancelRegistration } from "@/services/hooks/events/events"
import { useMyRegistrations } from "@/services/hooks/registrations/registrations"
import type { Event } from "@/services/endpoints/events/events"

const CARD = "p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16"
const CARD_STYLE = { backgroundColor: "rgba(255,255,255,0.88)", boxShadow: "0 12px 30px rgba(15,23,42,0.06)" }

const categoryBadge: Record<string, string> = {
  Summit: "bg-primary/10 text-primary",
  Workshop: "bg-green-100 text-green-700",
  Masterclass: "bg-amber-100 text-amber-700",
  Bootcamp: "bg-blue-100 text-blue-700",
  Conference: "bg-purple-100 text-purple-700",
}

const TABS = ["All Events", "Upcoming", "Past"]
const TAB_VALUES = ["all", "upcoming", "past"]

const EventsPage: NextPageWithLayout = () => {
  const [tabValue, setTabValue] = useState("all")
  const [expandedQR, setExpandedQR] = useState<string | null>(null)
  const [registerModal, setRegisterModal] = useState<Event | null>(null)
  const [registerDone, setRegisterDone] = useState(false)
  const [resultStatus, setResultStatus] = useState<"registered" | "waitlisted" | null>(null)

  const statusFilter = tabValue === "upcoming" ? "upcoming" : tabValue === "past" ? "past" : undefined
  const { data: eventsData, isLoading: eventsLoading } = useEvents({ status: statusFilter, limit: 50 })
  const { data: registrations = [], isLoading: regsLoading } = useMyRegistrations()
  const registerMutation = useRegisterForEvent()
  const cancelMutation = useCancelRegistration()

  const events = eventsData?.data ?? []
  const registeredEventIds = new Set(registrations.map((r) => r.event?._id))
  const waitlistedIds = new Set(registrations.filter((r) => r.status === "waitlisted").map((r) => r.event?._id))

  const handleRegisterConfirm = async (event: Event) => {
    try {
      const result = await registerMutation.mutateAsync(event._id)
      setResultStatus(result.status as "registered" | "waitlisted")
      setRegisterDone(true)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Registration failed"
      toast.error(msg)
    }
  }

  const openRegisterModal = (event: Event) => { setRegisterDone(false); setResultStatus(null); setRegisterModal(event) }
  const closeRegisterModal = () => { setRegisterModal(null); setRegisterDone(false); setResultStatus(null) }

  const upcomingCount = registrations.filter((r) => r.event?.status === "upcoming").length
  const attendedCount = registrations.filter((r) => r.status === "attended").length

  return (
    <div>
      <PageHeader eyebrow="Events" title="Events & Sessions" subtitle="Browse upcoming events, register, and track attendance. Your QR codes appear in My Registrations below." icon={<CalendarCheck size={14} />} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Registered" value={String(registrations.length)} icon={<CalendarCheck size={20} />} progress={Math.min(registrations.length * 20, 100)} />
        <StatCard label="Upcoming" value={String(upcomingCount)} icon={<Calendar size={20} />} progress={upcomingCount > 0 ? 50 : 0} accent="#3b82f6" />
        <StatCard label="Attended" value={String(attendedCount)} icon={<Users size={20} />} progress={attendedCount > 0 ? 75 : 0} accent="#f59e0b" />
      </div>

      <div className={cn(CARD, "mb-5")} style={CARD_STYLE}>
        <div className="mb-5">
          <Select value={tabValue} onValueChange={setTabValue}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TABS.map((label, i) => (
                <SelectItem key={label} value={TAB_VALUES[i]}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {eventsLoading ? <div className="text-center py-12 text-muted-foreground">Loading events...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.length === 0 && <p className="text-sm text-muted-foreground col-span-2 text-center py-8">No events found.</p>}
            {events.map((event) => {
              const isRegistered = registeredEventIds.has(event._id)
              const isWaitlisted = waitlistedIds.has(event._id)
              const isFull = event.registeredCount >= event.capacity
              const isPast = event.status === "past"
              return (
                <div key={event._id} className="flex flex-col p-5 rounded-xl border border-slate-200/18">
                  <div className="flex items-start justify-between mb-3">
                    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold", categoryBadge[event.category] ?? "bg-muted text-muted-foreground")}>{event.category}</span>
                    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border", isFull ? "border-red-300 text-red-600" : "border-green-300 text-green-700")}>{isFull ? "Full" : "Open"}</span>
                  </div>
                  <h3 className="font-bold mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 flex-1">{event.description}</p>
                  <div className="flex flex-col gap-1.5 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Calendar size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      {event.time && <><Clock size={14} className="text-muted-foreground" /><span className="text-sm text-muted-foreground">{event.time}</span></>}
                    </div>
                    <div className="flex items-center gap-2"><MapPin size={14} className="text-muted-foreground" /><span className="text-sm text-muted-foreground">{event.venue}</span></div>
                    <div className="flex items-center gap-2"><Users size={14} className="text-muted-foreground" /><span className="text-sm text-muted-foreground">{event.registeredCount}/{event.capacity} registered</span></div>
                  </div>
                  {isPast ? (
                    <button disabled className="w-full h-10 rounded-full border border-border text-muted-foreground font-bold text-sm cursor-default">Event ended</button>
                  ) : isRegistered && !isWaitlisted ? (
                    <button disabled className="w-full h-10 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center justify-center gap-2 cursor-default"><CheckCircle size={15} /> Registered</button>
                  ) : isWaitlisted ? (
                    <button disabled className="w-full h-10 rounded-full bg-amber-100 text-amber-700 font-bold text-sm cursor-default">On waitlist</button>
                  ) : (
                    <button onClick={() => openRegisterModal(event)} className="w-full h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] transition-colors">
                      {isFull ? "Join waitlist" : "Register"}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className={CARD} style={CARD_STYLE}>
        <h2 className="text-xl font-bold mb-4">My Registrations & QR Codes</h2>
        {regsLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : registrations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No registrations yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {registrations.map((reg) => (
              <div key={reg._id} className="rounded-xl border border-slate-200/18 overflow-hidden">
                <div className="flex items-center justify-between gap-4 p-4 flex-wrap">
                  <div><p className="font-bold">{reg.event?.title}</p><p className="text-sm text-muted-foreground">{reg.event?.date ? new Date(reg.event.date).toLocaleDateString() : ""}</p></div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/22 text-sm">
                      <QrCode size={14} className="text-muted-foreground" />
                      <span className="font-mono text-xs font-semibold">{reg.qrToken}</span>
                    </div>
                    <button onClick={() => setExpandedQR(expandedQR === reg.qrToken ? null : reg.qrToken)} className="px-4 py-1.5 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors">
                      {expandedQR === reg.qrToken ? "Hide QR" : "View QR"}
                    </button>
                  </div>
                </div>
                {expandedQR === reg.qrToken && (
                  <div className="border-t border-slate-200/18 p-5 text-center" style={{ backgroundColor: "rgba(18,124,113,0.04)" }}>
                    <div className="w-28 h-28 mx-auto rounded-2xl border-4 border-primary/25 grid place-items-center mb-3" style={{ backgroundColor: "rgba(18,124,113,0.06)" }}>
                      <QrCode size={56} className="text-primary" />
                    </div>
                    <p className="font-mono text-sm font-bold text-primary mb-1">{reg.qrToken}</p>
                    <p className="text-xs text-muted-foreground">Present this QR code at the event entrance for check-in</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {registerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeRegisterModal} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            {!registerDone ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{registerModal.registeredCount >= registerModal.capacity ? "Join Waitlist" : "Confirm Registration"}</h3>
                  <button onClick={closeRegisterModal} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X size={18} /></button>
                </div>
                <div className="p-4 rounded-xl bg-muted mb-4">
                  <p className="font-bold mb-1">{registerModal.title}</p>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-2"><Calendar size={13} className="text-muted-foreground" /><span className="text-sm text-muted-foreground">{new Date(registerModal.date).toLocaleDateString()} {registerModal.time && `· ${registerModal.time}`}</span></div>
                    <div className="flex items-center gap-2"><MapPin size={13} className="text-muted-foreground" /><span className="text-sm text-muted-foreground">{registerModal.venue}</span></div>
                  </div>
                </div>
                {registerModal.registeredCount >= registerModal.capacity && (
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">This event is full. You will be added to the waitlist and notified if a slot opens.</p>
                )}
                <div className="flex gap-3">
                  <button onClick={closeRegisterModal} className="flex-1 h-10 rounded-full border-2 border-slate-300 text-foreground font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
                  <button onClick={() => handleRegisterConfirm(registerModal)} disabled={registerMutation.isPending} className="flex-1 h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] disabled:opacity-60 transition-colors">
                    {registerMutation.isPending ? "Processing..." : registerModal.registeredCount >= registerModal.capacity ? "Join Waitlist" : "Confirm"}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 grid place-items-center mb-4"><CheckCircle size={32} className="text-green-600" /></div>
                <h3 className="font-bold text-lg mb-1">{resultStatus === "waitlisted" ? "Added to Waitlist!" : "Registration Confirmed!"}</h3>
                <p className="text-sm text-muted-foreground mb-5">{resultStatus === "waitlisted" ? "We'll notify you when a slot becomes available." : "Your QR code will appear in My Registrations below."}</p>
                <button onClick={closeRegisterModal} className="w-full h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] transition-colors">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

EventsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default EventsPage
