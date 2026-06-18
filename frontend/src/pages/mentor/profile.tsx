import React, { useState, useEffect } from 'react'
import { UserCircle, Pencil, Save, Star, Users, Calendar, Briefcase, Loader2, Lock, Eye, EyeOff, X, CheckCircle } from 'lucide-react'
import { MentorLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useMyMentorProfile, useUpdateMyMentorProfile, useMentorStats } from '@/services/hooks/mentors/mentors'
import { useMyProfile, useChangePassword } from '@/services/hooks/users/users'
import { toast } from 'sonner'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }
const INPUT = 'w-full h-10 px-3 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:bg-muted transition-colors'

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={14} className={i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
    ))}
  </div>
)

const MentorProfilePage: NextPageWithLayout = () => {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    headline: '', category: '', bio: '', yearsExperience: '', meetLink: '',
  })

  const { data: user, isLoading: loadingUser } = useMyProfile()
  const { data: profile, isLoading: loadingProfile } = useMyMentorProfile()
  const { data: stats } = useMentorStats()
  const updateProfile = useUpdateMyMentorProfile()

  useEffect(() => {
    if (profile) {
      setForm({
        headline: profile.headline ?? '',
        category: profile.category ?? '',
        bio: profile.bio ?? '',
        yearsExperience: profile.yearsExperience ? String(profile.yearsExperience) : '',
        meetLink: profile.meetLink ?? '',
      })
    }
  }, [profile])

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSave = () => {
    updateProfile.mutate(
      {
        headline: form.headline,
        category: form.category,
        bio: form.bio,
        yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : undefined,
        meetLink: form.meetLink,
      },
      {
        onSuccess: () => { toast.success('Profile updated'); setEditing(false) },
        onError: () => toast.error('Failed to update profile'),
      }
    )
  }

  const changePassword = useChangePassword()
  const [pwModal, setPwModal] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false })
  const [pwDone, setPwDone] = useState(false)

  const closePwModal = () => { setPwModal(false); setPwDone(false); setPwForm({ current: '', next: '', confirm: '' }); setShowPw({ current: false, next: false, confirm: false }) }

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

  const isLoading = loadingUser || loadingProfile
  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : '??'

  return (
    <div>
      <PageHeader eyebrow="Mentor Profile" title="My Profile" subtitle="Manage your public mentor profile. This is what participants see when discovering mentors." icon={<UserCircle size={14} />} />

      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5">
          <div className="flex flex-col gap-5">
            <div className={CARD} style={CARD_STYLE}>
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-full flex items-center justify-center text-white font-bold text-3xl overflow-hidden" style={{ width: 88, height: 88, backgroundColor: '#127C71' }}>
                  {user?.profilePhoto
                    ? <img src={user.profilePhoto} alt="avatar" className="w-full h-full object-cover" />
                    : initials}
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-muted-foreground">
                    {form.headline || 'Mentor'}{user?.organization ? ` · ${user.organization}` : ''}
                  </p>
                  {form.category && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground mt-1">{form.category}</span>}
                </div>
                {profile && profile.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={profile.rating} />
                    <span className="text-sm text-muted-foreground">{profile.rating.toFixed(1)} · {profile.totalSessions} sessions</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 md:p-6 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, rgba(8,47,73,0.98) 0%, rgba(18,124,113,0.98) 100%)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }}>
              <p className="font-bold mb-3">Mentor Impact</p>
              {[
                { icon: <Users size={16} />, label: 'Total mentees', value: stats ? String(stats.totalMentees) : '—' },
                { icon: <Calendar size={16} />, label: 'Sessions completed', value: stats ? String(stats.totalCompleted) : '—' },
                { icon: <Star size={16} />, label: 'Average rating', value: stats && stats.rating > 0 ? `${stats.rating.toFixed(1)} / 5` : 'New' },
                { icon: <Briefcase size={16} />, label: 'Years experience', value: form.yearsExperience ? `${form.yearsExperience}+` : '—' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>{row.icon}</span>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{row.label}</span>
                  </div>
                  <span className="text-sm font-bold">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={CARD} style={CARD_STYLE}>
            <div className="flex items-center justify-between mb-5">
              <p className="font-bold text-lg">Profile Information</p>
              <button
                onClick={editing ? handleSave : () => setEditing(true)}
                disabled={updateProfile.isPending}
                className={cn('flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors disabled:opacity-50', editing ? 'bg-primary text-white hover:bg-[#0d5c54]' : 'border border-border hover:bg-muted')}
              >
                {updateProfile.isPending
                  ? <Loader2 size={14} className="animate-spin" />
                  : editing ? <><Save size={14} /> Save changes</> : <><Pencil size={14} /> Edit</>}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">First name</label>
                <input value={user?.firstName ?? ''} disabled className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Last name</label>
                <input value={user?.lastName ?? ''} disabled className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Email address</label>
                <input value={user?.email ?? ''} disabled className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Phone number</label>
                <input value={user?.phone ?? ''} disabled className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Headline</label>
                <input value={form.headline} onChange={handleChange('headline')} disabled={!editing} placeholder="e.g. Senior Engineer at Flutterwave" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Mentorship category</label>
                <input value={form.category} onChange={handleChange('category')} disabled={!editing} placeholder="e.g. Tech & Engineering" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Years of experience</label>
                <input type="number" value={form.yearsExperience} onChange={handleChange('yearsExperience')} disabled={!editing} placeholder="e.g. 8" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Meet link</label>
                <input value={form.meetLink} onChange={handleChange('meetLink')} disabled={!editing} placeholder="https://meet.google.com/..." className={INPUT} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Bio</label>
                <textarea value={form.bio} onChange={handleChange('bio')} disabled={!editing} rows={4} placeholder="Tell mentees about your background and what you can help with..." className={cn(INPUT, 'h-auto py-2 resize-none')} />
              </div>
            </div>
            <hr className="border-border my-4" />
            <p className="text-sm text-muted-foreground">Your profile is visible to all YLSH participants when they browse mentors. Keep your bio and expertise up to date to attract the right mentees.</p>
          </div>

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
      )}

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
                  <button onClick={handleChangePassword} disabled={!pwForm.current || !pwForm.next || pwForm.next !== pwForm.confirm || changePassword.isPending} className="flex-1 h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                    {changePassword.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Update Password'}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 grid place-items-center mb-4"><CheckCircle size={32} className="text-green-600" /></div>
                <h3 className="font-bold text-lg mb-1">Password Updated!</h3>
                <p className="text-sm text-muted-foreground mb-5">Your password has been changed successfully.</p>
                <button onClick={closePwModal} className="w-full h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] transition-colors">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

MentorProfilePage.getLayout = (page) => <MentorLayout>{page}</MentorLayout>
export default MentorProfilePage
