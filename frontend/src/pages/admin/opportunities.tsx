import React, { useState } from 'react'
import {
  Trophy, Briefcase, Clock, DollarSign, GraduationCap, Plus, X, Trash2, Users,
  Loader2, Pencil, ChevronLeft,
} from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import {
  useOpportunities, useCreateOpportunity, useUpdateOpportunity, useDeleteOpportunity,
  useApplicationsForOpportunity, useUpdateApplicationStatus,
} from '@/services/hooks/opportunities/opportunities'
import type { OppType, ApplicationStatus, Opportunity } from '@/services/endpoints/opportunities/opportunities'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DatePicker from '@/components/ui/date-picker'
import { CARD, CARD_STYLE } from '@/utils/card-styles'

const INPUT = 'w-full h-10 px-3 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'

const typeBadge: Record<OppType, string> = {
  job: 'bg-primary/10 text-primary', internship: 'bg-purple-100 text-purple-700',
  grant: 'bg-blue-100 text-[#082F49]', scholarship: 'bg-amber-100 text-amber-700',
}
const statusBadge: Record<ApplicationStatus, string> = {
  pending: 'bg-slate-100 text-slate-600', under_review: 'bg-amber-100 text-amber-700',
  shortlisted: 'bg-blue-100 text-[#082F49]', rejected: 'bg-red-100 text-red-700',
  accepted: 'bg-emerald-100 text-emerald-700',
}

const TYPE_CONFIG: Record<OppType, {
  label: string; description: string; icon: React.ReactNode; badgeIcon: React.ReactNode; color: string
  titleLabel: string; orgLabel: string; amountLabel: string; amountPlaceholder: string
  reqLabel: string; descPlaceholder: string; linkLabel: string
}> = {
  job: {
    label: 'Job', description: 'Full-time or part-time employment opportunity',
    icon: <Briefcase size={26} />, badgeIcon: <Briefcase size={12} />, color: '#082F49',
    titleLabel: 'Job Title', orgLabel: 'Company / Organization',
    amountLabel: 'Salary', amountPlaceholder: 'e.g. ₦200,000/month or Competitive',
    reqLabel: 'Job Requirements', descPlaceholder: 'Describe the role, responsibilities, and what you are looking for...',
    linkLabel: 'Application email or link',
  },
  internship: {
    label: 'Internship', description: 'Temporary work experience opportunity',
    icon: <Clock size={26} />, badgeIcon: <Clock size={12} />, color: '#7c3aed',
    titleLabel: 'Position / Role', orgLabel: 'Company / Organization',
    amountLabel: 'Stipend / Salary', amountPlaceholder: 'e.g. ₦80,000/month or Unpaid',
    reqLabel: 'Requirements', descPlaceholder: 'Describe the internship and what the intern will be doing...',
    linkLabel: 'Application email or link',
  },
  grant: {
    label: 'Grant', description: 'Funding for projects or initiatives',
    icon: <DollarSign size={26} />, badgeIcon: <DollarSign size={12} />, color: '#1d4ed8',
    titleLabel: 'Grant Name', orgLabel: 'Granting Organization',
    amountLabel: 'Grant Amount', amountPlaceholder: 'e.g. ₦5,000,000',
    reqLabel: 'Eligibility Requirements', descPlaceholder: 'Describe the grant, its purpose, and what it funds...',
    linkLabel: 'Application link',
  },
  scholarship: {
    label: 'Scholarship', description: 'Educational financial support',
    icon: <GraduationCap size={26} />, badgeIcon: <GraduationCap size={12} />, color: '#b45309',
    titleLabel: 'Scholarship Name', orgLabel: 'Awarding Institution / Organization',
    amountLabel: 'Award Value', amountPlaceholder: 'e.g. Full tuition + ₦500,000 stipend',
    reqLabel: 'Eligibility Requirements', descPlaceholder: 'Describe the scholarship, coverage, and benefits...',
    linkLabel: 'Application link',
  },
}

const TYPE_ORDER: OppType[] = ['job', 'internship', 'grant', 'scholarship']

type Form = {
  title: string; organization: string; type: OppType; deadline: string
  location: string; description: string; amount: string; requirements: string; link: string
}
const EMPTY: Form = { title: '', organization: '', type: 'job', deadline: '', location: '', description: '', amount: '', requirements: '', link: '' }

function toDateInput(iso: string): string {
  return iso ? iso.slice(0, 10) : ''
}

function oppToForm(opp: Opportunity): Form {
  return {
    title: opp.title ?? '', organization: opp.organization ?? '',
    type: opp.type ?? 'job', deadline: toDateInput(opp.deadline),
    location: opp.location ?? '', description: opp.description ?? '',
    amount: opp.amount ?? '', requirements: opp.requirements ?? '', link: opp.link ?? '',
  }
}

// Step 1 — type picker
function TypePicker({ onSelect, onCancel }: { onSelect: (t: OppType) => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(8,47,73,0.55)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">What are you posting?</h2>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Select the type of opportunity — the form will adapt to match.</p>
        <div className="grid grid-cols-2 gap-3">
          {TYPE_ORDER.map((t) => {
            const cfg = TYPE_CONFIG[t]
            return (
              <button
                key={t}
                onClick={() => onSelect(t)}
                className="flex flex-col items-start gap-3 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:border-primary hover:bg-primary/5 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}>
                  {cfg.icon}
                </div>
                <div>
                  <p className="font-bold text-foreground group-hover:text-primary transition-colors">{cfg.label}</p>
                  <p className="text-xs text-muted-foreground leading-snug mt-0.5">{cfg.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Step 2 — the form (labels adapt to type)
function OppForm({ form, setForm }: { form: Form; setForm: React.Dispatch<React.SetStateAction<Form>> }) {
  const cfg = TYPE_CONFIG[form.type]
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-semibold mb-1.5">{cfg.titleLabel} <span className="text-red-500">*</span></label>
        <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder={`e.g. ${cfg.titleLabel}`} className={INPUT} />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5">{cfg.orgLabel} <span className="text-red-500">*</span></label>
        <input value={form.organization} onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))} placeholder="e.g. YLSH" className={INPUT} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Deadline <span className="text-red-500">*</span></label>
          <DatePicker value={form.deadline} onChange={(v) => setForm((p) => ({ ...p, deadline: v }))} placeholder="Pick deadline" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Location <span className="text-red-500">*</span></label>
          <input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="e.g. Lagos, Nigeria" className={INPUT} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5">Description <span className="text-red-500">*</span></label>
        <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder={cfg.descPlaceholder} rows={3} className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5">{cfg.amountLabel} <span className="text-slate-400 font-normal">(optional)</span></label>
        <input value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} placeholder={cfg.amountPlaceholder} className={INPUT} />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5">{cfg.reqLabel} <span className="text-slate-400 font-normal">(optional)</span></label>
        <input value={form.requirements} onChange={(e) => setForm((p) => ({ ...p, requirements: e.target.value }))} placeholder="e.g. Nigerian citizens, 18–35" className={INPUT} />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5">{cfg.linkLabel} <span className="text-slate-400 font-normal">(optional)</span></label>
        <input value={form.link} onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))} placeholder="e.g. jobs@company.com  or  https://forms.google.com/..." className={INPUT} />
        <p className="text-xs text-muted-foreground mt-1">Enter an <strong>email</strong> — Gmail opens pre-filled for the participant. Or a <strong>URL</strong> — participant is sent there directly.</p>
      </div>
    </div>
  )
}

function ApplicationsModal({ opp, onClose }: { opp: Opportunity; onClose: () => void }) {
  const { data, isLoading } = useApplicationsForOpportunity(opp._id)
  const updateStatus = useUpdateApplicationStatus()
  const applications = data?.data ?? []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(8,47,73,0.55)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-0.5">Applications</p>
            <h2 className="text-lg font-bold">{opp.title}</h2>
            <p className="text-sm text-muted-foreground">{opp.organization} · {opp.location}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors flex-shrink-0"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-primary" /></div>
          ) : applications.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No applications yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {applications.map((app) => (
                <div key={app._id} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                    <div>
                      <p className="font-bold">{app.applicant.firstName} {app.applicant.lastName}</p>
                      <p className="text-xs text-muted-foreground">{app.applicant.email}{app.applicant.state ? ` · ${app.applicant.state}` : ''}</p>
                    </div>
                    <Select
                      value={app.status}
                      onValueChange={(v) =>
                        updateStatus.mutate(
                          { id: app._id, status: v as ApplicationStatus },
                          { onSuccess: () => toast.success('Status updated'), onError: () => toast.error('Failed to update') }
                        )
                      }
                    >
                      <SelectTrigger className={cn('w-36 h-7 text-xs font-bold rounded-full px-2', statusBadge[app.status])}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(['pending', 'under_review', 'shortlisted', 'rejected', 'accepted'] as ApplicationStatus[]).map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">{s.replace('_', ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed line-clamp-3">{app.coverLetter}</p>
                  <p className="text-xs text-muted-foreground mt-2">Applied {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function OpportunitiesContent() {
  const [showCreate, setShowCreate] = useState(false)
  const [createStep, setCreateStep] = useState<'type' | 'form'>('type')
  const [editOpp, setEditOpp] = useState<Opportunity | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null)
  const [viewApps, setViewApps] = useState<Opportunity | null>(null)
  const [createForm, setCreateForm] = useState<Form>(EMPTY)
  const [editForm, setEditForm] = useState<Form>(EMPTY)

  const { data: oppData, isLoading } = useOpportunities({ limit: 100 })
  const createOpp = useCreateOpportunity()
  const updateOpp = useUpdateOpportunity()
  const deleteOpp = useDeleteOpportunity()

  const opportunities = oppData?.data ?? []
  const jobs = opportunities.filter((o) => o.type === 'job' || o.type === 'internship').length
  const grants = opportunities.filter((o) => o.type === 'grant' || o.type === 'scholarship').length

  const openCreate = () => {
    setCreateForm(EMPTY)
    setCreateStep('type')
    setShowCreate(true)
  }

  const selectType = (type: OppType) => {
    setCreateForm((p) => ({ ...p, type }))
    setCreateStep('form')
  }

  const closeCreate = () => {
    setShowCreate(false)
    setCreateStep('type')
    setCreateForm(EMPTY)
  }

  const openEdit = (opp: Opportunity) => {
    setEditOpp(opp)
    setEditForm(oppToForm(opp))
  }

  const handleCreate = () => {
    if (!createForm.title || !createForm.organization || !createForm.deadline || !createForm.location || !createForm.description) {
      return toast.error('Please fill all required fields')
    }
    createOpp.mutate(
      {
        title: createForm.title, organization: createForm.organization, type: createForm.type,
        deadline: createForm.deadline, location: createForm.location, description: createForm.description,
        ...(createForm.amount && { amount: createForm.amount }),
        ...(createForm.requirements && { requirements: createForm.requirements }),
        ...(createForm.link && { link: createForm.link }),
      },
      {
        onSuccess: () => { toast.success('Opportunity posted'); closeCreate() },
        onError: () => toast.error('Failed to post opportunity'),
      }
    )
  }

  const handleUpdate = () => {
    if (!editOpp) return
    if (!editForm.title || !editForm.organization || !editForm.deadline || !editForm.location || !editForm.description) {
      return toast.error('Please fill all required fields')
    }
    updateOpp.mutate(
      {
        id: editOpp._id,
        payload: {
          title: editForm.title, organization: editForm.organization, type: editForm.type,
          deadline: editForm.deadline, location: editForm.location, description: editForm.description,
          amount: editForm.amount || undefined,
          requirements: editForm.requirements || undefined,
          link: editForm.link || undefined,
        },
      },
      {
        onSuccess: () => { toast.success('Opportunity updated'); setEditOpp(null) },
        onError: () => toast.error('Failed to update opportunity'),
      }
    )
  }

  const handleDelete = () => {
    if (!confirmDelete) return
    deleteOpp.mutate(confirmDelete.id, {
      onSuccess: () => { toast.success('Opportunity deleted'); setConfirmDelete(null) },
      onError: () => toast.error('Failed to delete opportunity'),
    })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Opportunities"
        title="Opportunities"
        subtitle="Post jobs, internships, grants, and scholarships for participants to discover and apply."
        icon={<Trophy size={14} />}
        action={
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-bold shadow-md hover:bg-[#061e35] transition-colors">
            <Plus size={16} /> Post Opportunity
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total" value={String(opportunities.length)} icon={<Trophy size={20} />} progress={100} />
        <StatCard label="Jobs & Internships" value={String(jobs)} icon={<Briefcase size={20} />} progress={opportunities.length ? (jobs / opportunities.length) * 100 : 0} accent="#8b5cf6" />
        <StatCard label="Grants & Scholarships" value={String(grants)} icon={<DollarSign size={20} />} progress={opportunities.length ? (grants / opportunities.length) * 100 : 0} accent="#f59e0b" />
      </div>

      <div className={CARD} style={CARD_STYLE}>
        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-primary" /></div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Organization</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Deadline</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Location</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {opportunities.length === 0 ? (
                  <tr><td colSpan={6} className="py-16 text-center text-muted-foreground">No opportunities yet. Click "Post Opportunity" above.</td></tr>
                ) : opportunities.map((opp) => {
                  const cfg = TYPE_CONFIG[opp.type]
                  return (
                    <tr key={opp._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 font-semibold">{opp.title}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{opp.organization}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold', typeBadge[opp.type])}>
                          {cfg.badgeIcon} {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">{new Date(opp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{opp.location}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => setViewApps(opp)} className="flex items-center gap-1.5 px-3 h-8 rounded-md border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 hover:text-primary hover:border-primary/40 transition-colors">
                            <Users size={13} /> Applications
                          </button>
                          <button onClick={() => openEdit(opp)} className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary hover:border-primary/40 transition-colors" title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setConfirmDelete({ id: opp._id, title: opp.title })} className="w-8 h-8 flex items-center justify-center rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create — step 1: type picker */}
      {showCreate && createStep === 'type' && (
        <TypePicker onSelect={selectType} onCancel={closeCreate} />
      )}

      {/* Create — step 2: form */}
      {showCreate && createStep === 'form' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(8,47,73,0.55)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 pb-0 mb-5">
              <div className="flex items-center gap-2">
                <button onClick={() => setCreateStep('type')} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                  <ChevronLeft size={18} />
                </button>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Posting a</p>
                  <h2 className="text-xl font-bold leading-tight">{TYPE_CONFIG[createForm.type].label}</h2>
                </div>
              </div>
              <button onClick={closeCreate} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>
            <div className="px-6 pb-6">
              <OppForm form={createForm} setForm={setCreateForm} />
              <div className="flex gap-3 pt-5">
                <button onClick={closeCreate} className="flex-1 h-11 rounded-full border border-border font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleCreate} disabled={createOpp.isPending} className="flex-1 h-11 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#061e35] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {createOpp.isPending ? <Loader2 size={16} className="animate-spin" /> : `Post ${TYPE_CONFIG[createForm.type].label}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(8,47,73,0.55)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 pb-0 mb-5">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Editing</p>
                <h2 className="text-xl font-bold leading-tight">{TYPE_CONFIG[editForm.type].label}</h2>
              </div>
              <button onClick={() => setEditOpp(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>
            <div className="px-6 pb-6">
              {/* Allow changing type while editing */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1.5">Type</label>
                <Select value={editForm.type} onValueChange={(v) => setEditForm((p) => ({ ...p, type: v as OppType }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_ORDER.map((t) => (
                      <SelectItem key={t} value={t}>{TYPE_CONFIG[t].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <OppForm form={editForm} setForm={setEditForm} />
              <div className="flex gap-3 pt-5">
                <button onClick={() => setEditOpp(null)} className="flex-1 h-11 rounded-full border border-border font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleUpdate} disabled={updateOpp.isPending} className="flex-1 h-11 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#061e35] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {updateOpp.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 grid place-items-center mx-auto mb-4"><Trash2 size={22} className="text-red-600" /></div>
            <h2 className="text-lg font-bold text-center mb-1">Delete Opportunity?</h2>
            <p className="text-sm text-muted-foreground text-center mb-6"><span className="font-semibold text-foreground">{confirmDelete.title}</span> and all its applications will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-11 rounded-full border border-border font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={deleteOpp.isPending} className="flex-1 h-11 rounded-full bg-red-600 text-white font-bold text-sm hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {deleteOpp.isPending ? <Loader2 size={15} className="animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewApps && <ApplicationsModal opp={viewApps} onClose={() => setViewApps(null)} />}
    </div>
  )
}

const AdminOpportunitiesPage: NextPageWithLayout = () => <OpportunitiesContent />
AdminOpportunitiesPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>
export default AdminOpportunitiesPage
