import React, { useState, useEffect } from 'react'
import { Users, Search, CheckCircle, Clock, Ban, Loader2, UserPlus, X, Mail, Lock, User, Phone, Eye, EyeOff, RefreshCw, ShieldOff, ShieldCheck, Trash2 } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useUsers, useUpdateUserStatus, useDeleteUser, useCreateAdmin } from '@/services/hooks/users/users'
import type { User as UserType } from '@/services/endpoints/users/users'
import { toast } from 'sonner'
import { CARD, CARD_STYLE } from '@/utils/card-styles'

const INPUT = 'w-full h-11 pl-9 pr-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:opacity-50'

const statusStyles: Record<string, string> = {
  verified: 'bg-blue-50 text-blue-700 border border-blue-200',
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  suspended: 'bg-red-50 text-red-600 border border-red-200',
}
const statusIcon: Record<string, React.ReactNode> = {
  verified: <CheckCircle size={11} />,
  pending: <Clock size={11} />,
  suspended: <Ban size={11} />,
}
const roleBadge: Record<string, string> = {
  'super-admin': 'bg-red-100 text-red-700',
  admin: 'bg-primary/10 text-primary',
  mentor: 'bg-blue-100 text-blue-700',
  participant: 'bg-slate-100 text-slate-600',
}
const roleLabel: Record<string, string> = {
  'super-admin': 'Super Admin',
  admin: 'Admin',
  mentor: 'Mentor',
  participant: 'Participant',
}

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between px-4 py-2.5 gap-4">
    <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">{label}</span>
    <span className="text-sm text-slate-700 font-medium text-right truncate">{value}</span>
  </div>
)

const TABS = ['All', 'Verified', 'Pending', 'Suspended']
const EMPTY_FORM = { firstName: '', lastName: '', email: '', password: '', phone: '' }

const SuperAdminUsersPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [confirmModal, setConfirmModal] = useState<{ type: 'delete' | 'suspend'; id: string; name: string; suspended?: boolean } | null>(null)
  const [viewUser, setViewUser] = useState<UserType | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [showPassword, setShowPassword] = useState(false)

  const { data: usersData, isLoading, refetch } = useUsers({ search: search || undefined, limit: 100 })
  const updateStatus = useUpdateUserStatus()
  const deleteUser = useDeleteUser()
  const createAdmin = useCreateAdmin()

  const allUsers: UserType[] = usersData?.data ?? []

  const filtered = allUsers.filter((u) =>
    tab === 0 ? true
    : tab === 1 ? u.verificationStatus === 'verified'
    : tab === 2 ? u.verificationStatus === 'pending'
    : u.verificationStatus === 'suspended'
  )

  const tabCounts = [
    allUsers.length,
    allUsers.filter((u) => u.verificationStatus === 'verified').length,
    allUsers.filter((u) => u.verificationStatus === 'pending').length,
    allUsers.filter((u) => u.verificationStatus === 'suspended').length,
  ]

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [])

  const closeModal = () => { setModalOpen(false); setForm(EMPTY_FORM); setShowPassword(false) }

  const handleConfirm = () => {
    if (!confirmModal) return
    if (confirmModal.type === 'delete') {
      deleteUser.mutate(confirmModal.id, {
        onSuccess: () => { toast.success('User deleted'); setConfirmModal(null) },
        onError: () => toast.error('Failed to delete user'),
      })
    } else {
      const newStatus = confirmModal.suspended ? 'verified' : 'suspended'
      updateStatus.mutate(
        { id: confirmModal.id, status: newStatus },
        {
          onSuccess: () => { toast.success(newStatus === 'suspended' ? 'User suspended' : 'User activated'); setConfirmModal(null) },
          onError: () => toast.error('Failed to update user status'),
        }
      )
    }
  }

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      toast.error('First name, last name, email, and password are required')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    createAdmin.mutate(
      { firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password, phone: form.phone || undefined },
      {
        onSuccess: (user) => {
          toast.success(`Admin account created for ${user.firstName} ${user.lastName}`)
          closeModal()
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to create admin'
          toast.error(msg)
        },
      }
    )
  }

  const field = (key: keyof typeof EMPTY_FORM, value: string) => setForm((f) => ({ ...f, [key]: value }))

  return (
    <div>
      <PageHeader
        eyebrow="All Users"
        title="Users"
        subtitle="Full system access to all user accounts across every role — Participant, Mentor, Admin, and Super Admin."
        icon={<Users size={14} />}
      />

      <div className={CARD} style={CARD_STYLE}>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => void refetch()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-input bg-background text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-[#061e35] transition-colors shrink-0"
            >
              <UserPlus size={14} /> Add Admin
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {TABS.map((label, i) => (
            <button
              key={label}
              onClick={() => { setTab(i) }}
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

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Role</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Joined</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-muted-foreground">
                      No users match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr
                      key={user._id}
                      className="transition-colors hover:bg-slate-50/60"
                    >
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-foreground">{user.firstName} {user.lastName}</span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold', roleBadge[user.role] ?? 'bg-slate-100 text-slate-600')}>
                          {roleLabel[user.role] ?? user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold capitalize', statusStyles[user.verificationStatus] ?? 'bg-slate-100 text-slate-600')}>
                          {statusIcon[user.verificationStatus]}{user.verificationStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View */}
                          <button
                            onClick={() => setViewUser(user)}
                            title="View user details"
                            className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-brand-teal hover:border-brand-teal/40 transition-colors"
                          >
                            <Eye size={14} />
                          </button>
                          {/* Suspend / Activate */}
                          {user.verificationStatus === 'suspended' ? (
                            <button
                              onClick={() => setConfirmModal({ type: 'suspend', id: user._id, name: `${user.firstName} ${user.lastName}`, suspended: true })}
                              title="Activate account"
                              className="w-8 h-8 flex items-center justify-center rounded-md border border-green-300 text-green-600 hover:bg-green-50 transition-colors"
                            >
                              <ShieldCheck size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirmModal({ type: 'suspend', id: user._id, name: `${user.firstName} ${user.lastName}`, suspended: false })}
                              title="Suspend account"
                              className="w-8 h-8 flex items-center justify-center rounded-md border border-amber-300 text-amber-600 hover:bg-amber-50 transition-colors"
                            >
                              <ShieldOff size={14} />
                            </button>
                          )}
                          {/* Delete */}
                          <button
                            onClick={() => setConfirmModal({ type: 'delete', id: user._id, name: `${user.firstName} ${user.lastName}` })}
                            title="Delete account"
                            className="w-8 h-8 flex items-center justify-center rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}


      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
            <div className={`w-12 h-12 rounded-full grid place-items-center mx-auto mb-4 ${confirmModal.type === 'delete' ? 'bg-red-100' : 'bg-amber-100'}`}>
              {confirmModal.type === 'delete' ? <X size={22} className="text-red-600" /> : <Ban size={22} className="text-amber-600" />}
            </div>
            <h2 className="text-lg font-bold text-center mb-1">
              {confirmModal.type === 'delete' ? 'Delete Account?' : confirmModal.suspended ? 'Activate Account?' : 'Suspend Account?'}
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {confirmModal.type === 'delete'
                ? <><span className="font-semibold text-foreground">{confirmModal.name}</span>&apos;s account will be permanently deleted.</>
                : confirmModal.suspended
                  ? <><span className="font-semibold text-foreground">{confirmModal.name}</span> will be able to access the platform again.</>
                  : <><span className="font-semibold text-foreground">{confirmModal.name}</span> will lose access to the platform.</>
              }
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal(null)} className="flex-1 h-11 rounded-full border border-border font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
              <button
                onClick={handleConfirm}
                disabled={deleteUser.isPending || updateStatus.isPending}
                className={`flex-1 h-11 rounded-full text-white font-bold text-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-2 ${confirmModal.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : confirmModal.suspended ? 'bg-[#082F49] hover:bg-[#061e35]' : 'bg-amber-600 hover:bg-amber-700'}`}
              >
                {(deleteUser.isPending || updateStatus.isPending) ? <Loader2 size={15} className="animate-spin" /> : confirmModal.type === 'delete' ? 'Delete' : confirmModal.suspended ? 'Activate' : 'Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewUser(null)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-base">User Details</h2>
              <button onClick={() => setViewUser(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">
              {/* Avatar + name + badges */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl grid place-items-center text-white font-bold text-xl flex-shrink-0"
                  style={{ background: viewUser.role === 'super-admin' ? 'linear-gradient(135deg,#8b5cf6,#6d28d9)' : viewUser.role === 'admin' ? 'linear-gradient(135deg,#0d3d6e,#082F49)' : viewUser.role === 'mentor' ? 'linear-gradient(135deg,#1AAE9F,#127C71)' : 'linear-gradient(135deg,#475569,#334155)' }}
                >
                  {viewUser.profilePhoto
                    ? <img src={viewUser.profilePhoto} alt={viewUser.firstName} className="w-full h-full rounded-2xl object-cover" />
                    : `${viewUser.firstName[0]}${viewUser.lastName[0]}`.toUpperCase()
                  }
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-lg leading-tight">{viewUser.firstName} {viewUser.lastName}</p>
                  <p className="text-sm text-muted-foreground mb-2 truncate">{viewUser.email}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold', roleBadge[viewUser.role] ?? 'bg-slate-100 text-slate-600')}>
                      {roleLabel[viewUser.role] ?? viewUser.role}
                    </span>
                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold capitalize', statusStyles[viewUser.verificationStatus] ?? 'bg-slate-100 text-slate-600')}>
                      {statusIcon[viewUser.verificationStatus]}{viewUser.verificationStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail rows */}
              <div className="flex flex-col divide-y divide-slate-100 rounded-xl border border-slate-100 overflow-hidden">
                <DetailRow label="Email" value={viewUser.email} />
                <DetailRow label="Phone" value={viewUser.phone ?? '—'} />
                <DetailRow label="Organization" value={viewUser.organization ?? '—'} />
<DetailRow label="Joined" value={new Date(viewUser.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
              </div>

              {viewUser.bio && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Bio</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{viewUser.bio}</p>
                </div>
              )}
            </div>

            <div className="px-6 pb-5">
              <button onClick={() => setViewUser(null)} className="w-full h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#061e35] transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <UserPlus size={17} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-base leading-tight">Create Admin Account</h2>
                  <p className="text-xs text-muted-foreground">Account will have admin-level access</p>
                </div>
              </div>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="px-6 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">First Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input placeholder="First name" value={form.firstName} onChange={(e) => field('firstName', e.target.value)} disabled={createAdmin.isPending} className={INPUT} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">Last Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input placeholder="Last name" value={form.lastName} onChange={(e) => field('lastName', e.target.value)} disabled={createAdmin.isPending} className={INPUT} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" placeholder="admin@example.com" value={form.email} onChange={(e) => field('email', e.target.value)} disabled={createAdmin.isPending} className={INPUT} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Phone <span className="text-slate-400 font-normal">(optional)</span></label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={(e) => field('phone', e.target.value)} disabled={createAdmin.isPending} className={INPUT} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={(e) => field('password', e.target.value)}
                    disabled={createAdmin.isPending}
                    className="w-full h-11 pl-9 pr-10 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:opacity-50"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button type="button" onClick={closeModal} disabled={createAdmin.isPending} className="flex-1 h-11 rounded-full border-2 border-slate-200 text-foreground font-semibold text-sm hover:bg-muted disabled:opacity-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={createAdmin.isPending} className="flex-1 h-11 rounded-full bg-primary text-white font-semibold text-sm hover:bg-[#061e35] disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                  {createAdmin.isPending ? <><Loader2 size={15} className="animate-spin" /> Creating…</> : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

SuperAdminUsersPage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>
export default SuperAdminUsersPage
