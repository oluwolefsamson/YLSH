import React, { useState, useRef, useEffect } from 'react'
import { Users, Search, MoreVertical, CheckCircle, Clock, Ban, Loader2 } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useUsers, useUpdateUserStatus, useDeleteUser } from '@/services/hooks/users/users'
import type { User } from '@/services/endpoints/users/users'
import { toast } from 'sonner'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

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

const SuperAdminUsersPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [menuId, setMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const { data: usersData, isLoading } = useUsers({ search: search || undefined, limit: 100 })
  const updateStatus = useUpdateUserStatus()
  const deleteUser = useDeleteUser()

  const allUsers: User[] = usersData?.data ?? []

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

  const handleSuspend = (user: User) => {
    const newStatus = user.verificationStatus === 'suspended' ? 'verified' : 'suspended'
    updateStatus.mutate(
      { id: user._id, status: newStatus },
      {
        onSuccess: () => toast.success(`User ${newStatus === 'suspended' ? 'suspended' : 'unsuspended'}`),
        onError: () => toast.error('Failed to update user status'),
      }
    )
    setMenuId(null)
  }

  const handleDelete = (user: User) => {
    deleteUser.mutate(user._id, {
      onSuccess: () => toast.success('User deleted'),
      onError: () => toast.error('Failed to delete user'),
    })
    setMenuId(null)
  }

  return (
    <div>
      <PageHeader eyebrow="All Users" title="Users" subtitle="Full system access to all user accounts across every role — Participant, Mentor, Admin, and Super Admin." icon={<Users size={14} />} />

      <div className={CARD} style={CARD_STYLE}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…" className="w-full h-10 pl-9 pr-4 rounded-full border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
          </div>
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
                        <button onClick={() => handleSuspend(user)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors">
                          {user.verificationStatus === 'suspended' ? 'Unsuspend account' : 'Suspend account'}
                        </button>
                        <button onClick={() => handleDelete(user)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Delete account</button>
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
    </div>
  )
}

SuperAdminUsersPage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>
export default SuperAdminUsersPage
