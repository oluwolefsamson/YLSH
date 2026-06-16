import React, { useState } from 'react'
import { UserCircle, ShieldCheck, Pencil, Save, Lock, CheckCircle, Hourglass, CreditCard } from 'lucide-react'
import { DashboardLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const INPUT = 'w-full h-10 px-3 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:bg-muted transition-colors'

const completionItems = [
  { label: 'Email verified', done: true },
  { label: 'Phone number added', done: true },
  { label: 'NIN verified', done: true },
  { label: 'Profile photo uploaded', done: false },
  { label: 'Bio completed', done: true },
  { label: 'State of origin set', done: false },
]

const ProfilePage: NextPageWithLayout = () => {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    firstName: 'Amina', lastName: 'Bello', email: 'amina.bello@example.com',
    phone: '+234 803 456 7890', state: 'Kaduna',
    bio: 'Youth advocate and aspiring software engineer from northern Nigeria.',
    occupation: 'Student', institution: 'Ahmadu Bello University',
  })

  const completedCount = completionItems.filter((i) => i.done).length
  const completionPct = Math.round((completedCount / completionItems.length) * 100)
  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <div>
      <PageHeader eyebrow="Profile" title="My Profile" subtitle="Manage your personal information, identity verification, and account security." icon={<UserCircle size={14} />} />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          {/* Avatar card */}
          <div className={CARD} style={CARD_STYLE}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-22 h-22 rounded-full flex items-center justify-center text-white font-bold text-3xl" style={{ width: 88, height: 88, background: 'linear-gradient(135deg, #082F49 0%, #127C71 100%)' }}>AB</div>
              <div className="text-center">
                <p className="font-bold text-lg">{form.firstName} {form.lastName}</p>
                <p className="text-sm text-muted-foreground">{form.occupation} · {form.institution}</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                <ShieldCheck size={11} /> NIN Verified
              </span>
              <button className="w-full h-9 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors">Upload photo</button>
            </div>
          </div>

          {/* Profile completion */}
          <div className={CARD} style={CARD_STYLE}>
            <p className="font-bold mb-0.5">Profile completion</p>
            <p className="text-sm text-muted-foreground mb-3">{completionPct}% complete</p>
            <div className="h-2 rounded-full overflow-hidden mb-4" style={{ backgroundColor: 'rgba(148,163,184,0.18)' }}>
              <div className="h-full rounded-full bg-primary" style={{ width: `${completionPct}%` }} />
            </div>
            <div className="flex flex-col gap-2">
              {completionItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  {item.done ? <CheckCircle size={16} className="text-green-600 flex-shrink-0" /> : <Hourglass size={16} className="text-muted-foreground/40 flex-shrink-0" />}
                  <span className={cn('text-sm', item.done ? 'text-foreground' : 'text-muted-foreground/60')}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Identity verification */}
          <div className="p-5 md:p-6 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, rgba(8,47,73,0.97) 0%, rgba(18,124,113,0.97) 100%)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={18} />
              <p className="font-bold">Identity Verification</p>
            </div>
            <p className="text-sm text-white/80 mb-3">Your NIN has been verified. Your identity reference is securely encrypted and never stored in plain text.</p>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border border-white/20 text-white" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <ShieldCheck size={11} /> Verified · Jun 2, 2026
            </span>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Personal info */}
          <div className={CARD} style={CARD_STYLE}>
            <div className="flex items-center justify-between mb-5">
              <p className="font-bold text-lg">Personal Information</p>
              <button onClick={() => setEditing((v) => !v)} className={cn('flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors', editing ? 'bg-primary text-white hover:bg-[#0d5c54]' : 'border border-border hover:bg-muted')}>
                {editing ? <><Save size={14} /> Save changes</> : <><Pencil size={14} /> Edit</>}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                { label: 'First name', field: 'firstName' as const },
                { label: 'Last name', field: 'lastName' as const },
                { label: 'Email address', field: 'email' as const },
                { label: 'Phone number', field: 'phone' as const },
                { label: 'State of origin', field: 'state' as const },
                { label: 'Occupation', field: 'occupation' as const },
                { label: 'Institution / Employer', field: 'institution' as const },
              ]).map(({ label, field }) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
                  <input value={form[field]} onChange={handleChange(field)} disabled={!editing} className={INPUT} />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Bio</label>
                <textarea value={form.bio} onChange={handleChange('bio')} disabled={!editing} rows={3} className={cn(INPUT, 'h-auto py-2 resize-none')} />
              </div>
            </div>
          </div>

          {/* Account security */}
          <div className={CARD} style={CARD_STYLE}>
            <div className="flex items-center gap-2 mb-5">
              <Lock size={18} className="text-muted-foreground" />
              <p className="font-bold text-lg">Account Security</p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Password', value: 'Last changed 30 days ago', action: 'Change password' },
                { label: 'Two-factor authentication', value: 'Not enabled', action: 'Enable 2FA' },
                { label: 'Active sessions', value: '1 device · Chrome on Windows', action: 'Manage sessions' },
              ].map((row, i, arr) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-semibold text-sm">{row.label}</p>
                      <p className="text-sm text-muted-foreground">{row.value}</p>
                    </div>
                    <button className="px-4 py-1.5 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors flex-shrink-0">{row.action}</button>
                  </div>
                  {i < arr.length - 1 && <hr className="border-border mt-3" />}
                </div>
              ))}
              <hr className="border-border" />
              <button className="px-4 py-1.5 rounded-full border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors w-fit">Delete account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ProfilePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default ProfilePage
