import React, { useEffect, useRef, useState } from 'react'
import { UserCircle, ShieldCheck, Pencil, Save, Lock, CheckCircle, Hourglass, CreditCard, X, Eye, EyeOff, Monitor, Smartphone, LogOut, Loader2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import type { ModalType, TfaStep, ProfileCompletionItem } from '@/types'
import { useMyProfile, useUpdateMyProfile, useChangePassword } from '@/services/hooks/users/users'
import { toast } from 'sonner'
import { CARD, CARD_STYLE } from '@/utils/card-styles'

const INPUT = 'w-full h-10 px-3 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:bg-muted transition-colors'

const ProfilePage: NextPageWithLayout = () => {
  const { data: user, isLoading } = useMyProfile()
  const updateProfile = useUpdateMyProfile()
  const changePassword = useChangePassword()

  const [editing, setEditing] = useState(false)
  const [modal, setModal] = useState<ModalType>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', state: '', bio: '', organization: '' })

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        phone: user.phone ?? '',
        state: user.state ?? '',
        bio: user.bio ?? '',
        organization: user.organization ?? '',
      })
    }
  }, [user])

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false })
  const [pwDone, setPwDone] = useState(false)
  const [tfaPhone, setTfaPhone] = useState('')
  const [tfaCode, setTfaCode] = useState('')
  const [tfaStep, setTfaStep] = useState<TfaStep>('phone')
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const completionItems: ProfileCompletionItem[] = [
    { label: 'Email verified', done: user?.emailVerified ?? false },
    { label: 'Phone number added', done: !!(user?.phone) },
    { label: 'NIN verified', done: user?.ninVerified ?? false },
    { label: 'Profile photo uploaded', done: !!(user?.profilePhoto) },
    { label: 'Bio completed', done: !!(user?.bio) },
    { label: 'State of origin set', done: !!(user?.state) },
  ]
  const completedCount = completionItems.filter((i) => i.done).length
  const completionPct = Math.round((completedCount / completionItems.length) * 100)

  const initials = user ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase() : '?'

  const handleSave = () => {
    updateProfile.mutate(form, {
      onSuccess: () => { setEditing(false); toast.success('Profile updated') },
      onError: (err: unknown) => {
        toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Update failed')
      },
    })
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const closeModal = () => {
    setModal(null); setPwDone(false); setPwForm({ current: '', next: '', confirm: '' })
    setTfaStep('phone'); setTfaCode(''); setDeleteConfirm('')
  }

  const handleChangePassword = () => {
    if (pwForm.next !== pwForm.confirm) { toast.error('Passwords do not match'); return }
    changePassword.mutate(
      { currentPassword: pwForm.current, newPassword: pwForm.next },
      {
        onSuccess: () => setPwDone(true),
        onError: (err: unknown) => {
          toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Password change failed')
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader eyebrow="Profile" title="My Profile" subtitle="Manage your personal information, identity verification, and account security." icon={<UserCircle size={14} />} />

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          <div className={CARD} style={CARD_STYLE}>
            <div className="flex flex-col items-center gap-3">
              {(photoPreview ?? user?.profilePhoto) ? (
                <img src={photoPreview ?? user?.profilePhoto} alt="Profile" className="rounded-full object-cover border-4 border-primary/20" style={{ width: 88, height: 88 }} />
              ) : (
                <div className="rounded-full flex items-center justify-center text-white font-bold text-3xl" style={{ width: 88, height: 88, background: 'linear-gradient(135deg, #061e35 0%, #082F49 100%)' }}>{initials}</div>
              )}
              <div className="text-center">
                <p className="font-bold text-lg">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-muted-foreground capitalize">{user?.role}{user?.organization ? ` Â· ${user.organization}` : ''}</p>
              </div>
              {user?.ninVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#082F49]">
                  <ShieldCheck size={11} /> NIN Verified
                </span>
              )}
              <button onClick={() => fileInputRef.current?.click()} className="w-full h-9 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors">
                Upload photo
              </button>
            </div>
          </div>

          <div className={CARD} style={CARD_STYLE}>
            <p className="font-bold mb-0.5">Profile completion</p>
            <p className="text-sm text-muted-foreground mb-3">{completionPct}% complete</p>
            <div className="h-2 rounded-full overflow-hidden mb-4" style={{ backgroundColor: 'rgba(148,163,184,0.18)' }}>
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completionPct}%` }} />
            </div>
            <div className="flex flex-col gap-2">
              {completionItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  {item.done ? <CheckCircle size={16} className="text-[#082F49] flex-shrink-0" /> : <Hourglass size={16} className="text-muted-foreground/40 flex-shrink-0" />}
                  <span className={cn('text-sm', item.done ? 'text-foreground' : 'text-muted-foreground/60')}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 md:p-6 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, rgba(6,30,53,0.97) 0%, rgba(8,47,73,0.97) 100%)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }}>
            <div className="flex items-center gap-2 mb-3"><CreditCard size={18} /><p className="font-bold">Identity Verification</p></div>
            <p className="text-sm text-white/80 mb-3">Your NIN has been verified. Your identity reference is securely encrypted.</p>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border border-white/20 text-white" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <ShieldCheck size={11} /> {user?.ninVerified ? 'Verified' : 'Not verified'}
            </span>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <div className={CARD} style={CARD_STYLE}>
            <div className="flex items-center justify-between mb-5">
              <p className="font-bold text-lg">Personal Information</p>
              {editing ? (
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(false); if (user) setForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? '', state: user.state ?? '', bio: user.bio ?? '', organization: user.organization ?? '' }) }} className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors">Cancel</button>
                  <button onClick={handleSave} disabled={updateProfile.isPending} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-[#061e35] disabled:opacity-60 transition-colors">
                    {updateProfile.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                  </button>
                </div>
              ) : (
                <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors">
                  <Pencil size={14} /> Edit
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                { label: 'First name', field: 'firstName' as const },
                { label: 'Last name', field: 'lastName' as const },
                { label: 'Phone number', field: 'phone' as const },
                { label: 'State of origin', field: 'state' as const },
                { label: 'Organization', field: 'organization' as const },
              ]).map(({ label, field }) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
                  <input value={form[field]} onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))} disabled={!editing} className={INPUT} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Email address</label>
                <input value={user?.email ?? ''} disabled className={INPUT} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} disabled={!editing} rows={3} className={cn(INPUT, 'h-auto py-2 resize-none')} />
              </div>
            </div>
          </div>

          <div className={CARD} style={CARD_STYLE}>
            <div className="flex items-center gap-2 mb-5"><Lock size={18} className="text-muted-foreground" /><p className="font-bold text-lg">Account Security</p></div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Password', value: 'Update your account password', action: 'Change password', onClick: () => setModal('password') },
                { label: 'Two-factor authentication', value: 'Add extra security to your account', action: 'Enable 2FA', onClick: () => setModal('2fa') },
                { label: 'Active sessions', value: 'Manage devices signed into your account', action: 'Manage sessions', onClick: () => setModal('sessions') },
              ].map((row, i, arr) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div><p className="font-semibold text-sm">{row.label}</p><p className="text-sm text-muted-foreground">{row.value}</p></div>
                    <button onClick={row.onClick} className="px-4 py-1.5 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors flex-shrink-0">{row.action}</button>
                  </div>
                  {i < arr.length - 1 && <hr className="border-border mt-3" />}
                </div>
              ))}
              <hr className="border-border" />
              <button onClick={() => setModal('delete')} className="px-4 py-1.5 rounded-full border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors w-fit">Delete account</button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {modal === 'password' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            {!pwDone ? (
              <>
                <div className="flex items-center justify-between mb-5"><h3 className="font-bold text-lg">Change Password</h3><button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-muted"><X size={18} /></button></div>
                <div className="flex flex-col gap-4 mb-5">
                  {([
                    { key: 'current' as const, label: 'Current password', show: showPw.current, toggle: () => setShowPw((p) => ({ ...p, current: !p.current })) },
                    { key: 'next' as const, label: 'New password', show: showPw.next, toggle: () => setShowPw((p) => ({ ...p, next: !p.next })) },
                    { key: 'confirm' as const, label: 'Confirm new password', show: showPw.confirm, toggle: () => setShowPw((p) => ({ ...p, confirm: !p.confirm })) },
                  ]).map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
                      <div className="relative">
                        <input type={f.show ? 'text' : 'password'} value={pwForm[f.key]} onChange={(e) => setPwForm((p) => ({ ...p, [f.key]: e.target.value }))} className={cn(INPUT, 'pr-10')} />
                        <button type="button" onClick={f.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{f.show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 h-10 rounded-full border-2 border-slate-300 font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
                  <button onClick={handleChangePassword} disabled={!pwForm.current || !pwForm.next || pwForm.next !== pwForm.confirm || changePassword.isPending} className="flex-1 h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#061e35] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                    {changePassword.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Update Password'}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 grid place-items-center mb-4"><CheckCircle size={32} className="text-[#082F49]" /></div>
                <h3 className="font-bold text-lg mb-1">Password Updated!</h3>
                <p className="text-sm text-muted-foreground mb-5">Your password has been changed successfully.</p>
                <button onClick={closeModal} className="w-full h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#061e35] transition-colors">Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {modal === '2fa' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5"><h3 className="font-bold text-lg">Enable Two-Factor Auth</h3><button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-muted"><X size={18} /></button></div>
            {tfaStep === 'phone' && (<>
              <p className="text-sm text-muted-foreground mb-4">Enter your phone number to receive a verification code via SMS.</p>
              <div className="mb-4"><label className="block text-xs font-medium text-muted-foreground mb-1">Phone number</label><input value={tfaPhone || user?.phone || ''} onChange={(e) => setTfaPhone(e.target.value)} className={INPUT} /></div>
              <div className="flex gap-3"><button onClick={closeModal} className="flex-1 h-10 rounded-full border-2 border-slate-300 font-semibold text-sm hover:bg-muted transition-colors">Cancel</button><button onClick={() => setTfaStep('code')} className="flex-1 h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#061e35] transition-colors">Send Code</button></div>
            </>)}
            {tfaStep === 'code' && (<>
              <p className="text-sm text-muted-foreground mb-4">Enter the 6-digit code sent to <strong>{tfaPhone || user?.phone}</strong>.</p>
              <div className="mb-4"><label className="block text-xs font-medium text-muted-foreground mb-1">Verification code</label><input value={tfaCode} onChange={(e) => setTfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" className={cn(INPUT, 'tracking-widest text-center font-mono text-lg')} /></div>
              <div className="flex gap-3"><button onClick={() => setTfaStep('phone')} className="flex-1 h-10 rounded-full border-2 border-slate-300 font-semibold text-sm hover:bg-muted transition-colors">Back</button><button onClick={() => setTfaStep('done')} disabled={tfaCode.length !== 6} className="flex-1 h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#061e35] disabled:opacity-50 transition-colors">Verify</button></div>
            </>)}
            {tfaStep === 'done' && (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 grid place-items-center mb-4"><ShieldCheck size={32} className="text-[#082F49]" /></div>
                <h3 className="font-bold text-lg mb-1">2FA Enabled!</h3>
                <p className="text-sm text-muted-foreground mb-5">Two-factor authentication is now active.</p>
                <button onClick={closeModal} className="w-full h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#061e35] transition-colors">Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sessions Modal */}
      {modal === 'sessions' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5"><h3 className="font-bold text-lg">Active Sessions</h3><button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-muted"><X size={18} /></button></div>
            <div className="flex flex-col gap-3 mb-5">
              {[{ device: 'Current browser session', location: 'Your device', time: 'Active now', icon: <Monitor size={20} />, current: true }].map((s, i) => (
                <div key={i} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/18">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted grid place-items-center text-muted-foreground flex-shrink-0">{s.icon}</div>
                    <div><p className="font-semibold text-sm">{s.device}</p><p className="text-xs text-muted-foreground">{s.location} Â· {s.time}</p></div>
                  </div>
                  <span className="text-xs font-bold text-[#082F49] bg-blue-100 px-2 py-0.5 rounded-full">Current</span>
                </div>
              ))}
            </div>
            <button onClick={closeModal} className="w-full h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#061e35] transition-colors">Close</button>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {modal === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-lg text-red-600">Delete Account</h3><button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-muted"><X size={18} /></button></div>
            <p className="text-sm text-muted-foreground mb-4">This will permanently delete your account and all data. <strong>This cannot be undone.</strong></p>
            <div className="mb-4"><label className="block text-xs font-medium text-muted-foreground mb-1">Type <span className="font-bold text-foreground">DELETE</span> to confirm</label><input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="DELETE" className={INPUT} /></div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="flex-1 h-10 rounded-full border-2 border-slate-300 font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
              <button disabled={deleteConfirm !== 'DELETE'} className="flex-1 h-10 rounded-full bg-red-600 text-white font-bold text-sm hover:bg-red-700 disabled:opacity-50 transition-colors">Delete Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

ProfilePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default ProfilePage
