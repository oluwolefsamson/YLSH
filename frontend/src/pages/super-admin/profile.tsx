import React, { useState, useEffect } from 'react'
import { UserCircle, Lock, Eye, EyeOff, X, CheckCircle, Pencil, Save, Loader2 } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useMyProfile, useUpdateMyProfile, useChangePassword } from '@/services/hooks/users/users'
import { toast } from 'sonner'
import { CARD, CARD_STYLE } from '@/utils/card-styles'

const INPUT = 'w-full h-10 px-3 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:bg-muted transition-colors'

const SuperAdminProfilePage: NextPageWithLayout = () => {
  const { data: user, isLoading } = useMyProfile()
  const updateProfile = useUpdateMyProfile()
  const changePassword = useChangePassword()

  const [editing, setEditing] = useState(false)
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

  const [pwModal, setPwModal] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false })
  const [pwDone, setPwDone] = useState(false)

  const closePwModal = () => { setPwModal(false); setPwDone(false); setPwForm({ current: '', next: '', confirm: '' }); setShowPw({ current: false, next: false, confirm: false }) }

  const handleSave = () => {
    updateProfile.mutate(form, {
      onSuccess: () => { setEditing(false); toast.success('Profile updated') },
      onError: (err: unknown) => {
        toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Update failed')
      },
    })
  }

  const handleChangePassword = () => {
    if (pwForm.next !== pwForm.confirm) { toast.error('Passwords do not match'); return }
    if (pwForm.next.length < 6) { toast.error('Password must be at least 6 characters'); return }
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

  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : '?'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader eyebrow="Profile" title="My Profile" subtitle="Manage your personal information and account security." icon={<UserCircle size={14} />} />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5">
        {/* Left â€” avatar card */}
        <div className={CARD} style={CARD_STYLE}>
          <div className="flex flex-col items-center gap-3">
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt="Profile" className="rounded-full object-cover border-4 border-purple-200" style={{ width: 88, height: 88 }} />
            ) : (
              <div className="rounded-full flex items-center justify-center text-white font-bold text-3xl" style={{ width: 88, height: 88, background: 'linear-gradient(135deg, #1e0a3c 0%, #5a288c 100%)' }}>
                {initials}
              </div>
            )}
            <div className="text-center">
              <p className="font-bold text-lg">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-muted-foreground">System Administrator</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
              Super Admin
            </span>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Personal info */}
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
                { label: 'State', field: 'state' as const },
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

          {/* Account Security */}
          <div className={CARD} style={CARD_STYLE}>
            <div className="flex items-center gap-2 mb-5"><Lock size={18} className="text-muted-foreground" /><p className="font-bold text-lg">Account Security</p></div>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-semibold text-sm">Password</p>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
              <button onClick={() => setPwModal(true)} className="px-4 py-1.5 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors flex-shrink-0">
                Change password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {pwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closePwModal} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            {!pwDone ? (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg">Change Password</h3>
                  <button onClick={closePwModal} className="p-1.5 rounded-lg hover:bg-muted"><X size={18} /></button>
                </div>
                <div className="flex flex-col gap-4 mb-5">
                  {([
                    { key: 'current' as const, label: 'Current password' },
                    { key: 'next' as const, label: 'New password' },
                    { key: 'confirm' as const, label: 'Confirm new password' },
                  ]).map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
                      <div className="relative">
                        <input type={showPw[f.key] ? 'text' : 'password'} value={pwForm[f.key]} onChange={(e) => setPwForm((p) => ({ ...p, [f.key]: e.target.value }))} className={cn(INPUT, 'pr-10')} />
                        <button type="button" onClick={() => setShowPw((p) => ({ ...p, [f.key]: !p[f.key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPw[f.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={closePwModal} className="flex-1 h-10 rounded-full border-2 border-slate-300 font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
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
                <button onClick={closePwModal} className="w-full h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#061e35] transition-colors">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

SuperAdminProfilePage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>
export default SuperAdminProfilePage
