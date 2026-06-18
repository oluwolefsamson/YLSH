import React, { useState, useRef, useEffect } from 'react'
import { Users, Search, MoreVertical, CheckCircle, Clock, Ban, Loader2, UserPlus, X, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useUsers, useUpdateUserStatus, useDeleteUser, useCreateAdmin } from '@/services/hooks/users/users'
import type { User as UserType } from '@/services/endpoints/users/users'
import { toast } from 'sonner'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }
const INPUT = 'w-full h-11 pl-9 pr-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:opacity-50'

const statusStyles: Record<string, string> = {
  verified: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  suspended: 'bg-red-100 text-red-700',
}
const statusIcon: Record<string, React.ReactNode> = {
  verified: <CheckCircle size={11} />,
  pending: <Clock size={11} />,
  suspended: <Ban size={11} />,
}
const roleBadge: Record<string, string> = {
  'super-admin': 'bg-red-100 text-red-700',
  admin: 'bg-primary/10 text-primary',
  mentor: 'bg-green-100 text-green-700',
  participant: 'bg-muted text-muted-foreground',
}
const roleLabel: Record<string, string> = {
  'super-admin': 'Super Admin',
  admin: 'Admin',
  mentor: 'Mentor',
  participant: 'Participant',
}

const TABS = ['All', 'Verified', 'Pending', 'Suspended']

const EMPTY_FORM = { firstName: '', lastName: '', email: '', password: '', phone: '' }

const SuperAdminUsersPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [menuId, setMenuId] = useState<string | null>(null)
  const [confirmModal, setConfirmModal] = useState<{ type: 'delete' | 'suspend'; id: string; name: string; suspended?: boolean } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [showPassword, setShowPassword] = useState(false)

  const { data: usersData, isLoading } = useUsers({ search: search || undefined, limit: 100 })
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
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuId(null) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // Close modal on Escape
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
    setMenuId(null)
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
      <PageHeader eyebrow="All Users" title="Users" subtitle="Full system access to all user accounts across every role — Participant, Mentor, Admin, and Super Admin." icon={<Users size={14} />} />

      <div className={CARD} style={CARD_STYLE}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…" className="w-full h-10 pl-9 pr-4 rounded-full border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-[#0d5c54] transition-colors shrink-0"
          >
            <UserPlus size={15} />
            Add Admin
          </button>
        </div>

        <div className="flex gap-1 border-b border-slate-200/18 mb-5 overflow-x-auto">
          {TABS.map((label, i) => (
            <button key={label} onClick={() => setTab(i)} className={cn('px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors whitespace-nowrap', tab === i ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              {label} ({tabCounts[i]})
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-primary" /></div>
        ) : (
          <div className="flex flex-col gap-3" ref={menuRef}>
            {filtered.map((user) => (
              <div key={user._id} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200/18 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}{user.state ? ` · ${user.state}` : ''}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold', roleBadge[user.role] ?? 'bg-muted text-muted-foreground')}>
                      {roleLabel[user.role] ?? user.role}
                    </span>
                    <span className="text-xs text-muted-foreground">Joined {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize', statusStyles[user.verificationStatus] ?? 'bg-muted text-muted-foreground')}>
                    {statusIcon[user.verificationStatus]}{user.verificationStatus}
                  </span>
                  <div className="relative">
                    <button onClick={() => setMenuId(menuId === user._id ? null : user._id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                      <MoreVertical size={16} className="text-muted-foreground" />
                    </button>
                    {menuId === user._id && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200/50 rounded-xl shadow-lg py-1 z-50 min-w-[160px]">
                        <button onClick={() => { setConfirmModal({ type: 'suspend', id: user._id, name: `${user.firstName} ${user.lastName}`, suspended: user.verificationStatus === 'suspended' }); setMenuId(null) }} className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors">
                          {user.verificationStatus === 'suspended' ? 'Activate account' : 'Suspend account'}
                        </button>
                        <button onClick={() => { setConfirmModal({ type: 'delete', id: user._id, name: `${user.firstName} ${user.lastName}` }); setMenuId(null) }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Delete account</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && !isLoading && (
              <div className="py-12 text-center text-muted-foreground">No users match your search.</div>
            )}
          </div>
        )}
      </div>

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
                ? <><span className="font-semibold text-foreground">{confirmModal.name}</span>'s account will be permanently deleted.</>
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
                className={`flex-1 h-11 rounded-full text-white font-bold text-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-2 ${confirmModal.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : confirmModal.suspended ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'}`}
              >
                {(deleteUser.isPending || updateStatus.isPending) ? <Loader2 size={15} className="animate-spin" /> : confirmModal.type === 'delete' ? 'Delete' : confirmModal.suspended ? 'Activate' : 'Suspend'}
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

            {/* Modal header */}
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

            {/* Modal form */}
            <form onSubmit={handleCreateAdmin} className="px-6 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">First Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      placeholder="First name"
                      value={form.firstName}
                      onChange={(e) => field('firstName', e.target.value)}
                      disabled={createAdmin.isPending}
                      className={INPUT}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">Last Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      placeholder="Last name"
                      value={form.lastName}
                      onChange={(e) => field('lastName', e.target.value)}
                      disabled={createAdmin.isPending}
                      className={INPUT}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={form.email}
                    onChange={(e) => field('email', e.target.value)}
                    disabled={createAdmin.isPending}
                    className={INPUT}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Phone <span className="text-slate-400 font-normal">(optional)</span></label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={form.phone}
                    onChange={(e) => field('phone', e.target.value)}
                    disabled={createAdmin.isPending}
                    className={INPUT}
                  />
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
                <button type="submit" disabled={createAdmin.isPending} className="flex-1 h-11 rounded-full bg-primary text-white font-semibold text-sm hover:bg-[#0d5c54] disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
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
