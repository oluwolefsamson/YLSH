import React, { useState, useRef, useEffect } from 'react'
import { ShieldAlert, Pencil, X, Loader2, ChevronDown, Check } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useUsers, useUpdateUserRole } from '@/services/hooks/users/users'
import type { User } from '@/services/endpoints/users/users'
import { toast } from 'sonner'
import { CARD, CARD_STYLE } from '@/utils/card-styles'

const INPUT = 'w-full h-10 px-3 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:bg-muted transition-colors'

const rbacRoles = [
  { name: 'Participant', color: 'bg-muted text-muted-foreground', permissions: ['Register for events', 'View and download certificates', 'Access learning resources', 'Apply to opportunities', 'Book mentorship sessions'] },
  { name: 'Mentor', color: 'bg-blue-100 text-[#082F49]', permissions: ['All Participant permissions', 'Manage mentorship sessions', 'Set availability', 'View assigned mentees'] },
  { name: 'Admin', color: 'bg-primary/10 text-primary', permissions: ['All Mentor permissions', 'Manage users and events', 'Issue certificates', 'View analytics', 'Handle identity verifications'] },
  { name: 'Super Admin', color: 'bg-red-100 text-red-700', permissions: ['Full system access', 'Manage admin accounts', 'Assign/revoke roles', 'View audit logs', 'System configuration'] },
]

const roleBadge: Record<string, string> = {
  'super-admin': 'bg-red-100 text-red-700',
  admin: 'bg-primary/10 text-primary',
  mentor: 'bg-blue-100 text-[#082F49]',
  participant: 'bg-muted text-muted-foreground',
}
const roleLabel: Record<string, string> = {
  'super-admin': 'Super Admin', admin: 'Admin', mentor: 'Mentor', participant: 'Participant',
}

const ROLES = ['participant', 'mentor', 'admin', 'super-admin'] as const

const RoleManagementPage: NextPageWithLayout = () => {
  const [editUser, setEditUser] = useState<User | null>(null)
  const [newRole, setNewRole] = useState('')
  const [roleOpen, setRoleOpen] = useState(false)
  const roleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const { data: usersData, isLoading } = useUsers({ limit: 50 })
  const updateRole = useUpdateUserRole()
  const users: User[] = usersData?.data ?? []

  const handleSave = () => {
    if (!editUser) return
    updateRole.mutate(
      { id: editUser._id, role: newRole },
      {
        onSuccess: () => { toast.success('Role updated'); setEditUser(null) },
        onError: () => toast.error('Failed to update role'),
      }
    )
  }

  return (
    <div>
      <PageHeader eyebrow="Role Management" title="Role Management" subtitle="View the RBAC matrix and assign or revoke roles for any user account." icon={<ShieldAlert size={14} />} />

      <div className={cn(CARD, 'mb-5')} style={CARD_STYLE}>
        <h2 className="text-xl font-bold mb-4">RBAC Matrix</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rbacRoles.map((role) => (
            <div key={role.name} className="flex flex-col p-4 rounded-xl border border-slate-200/18">
              <div className="flex items-center justify-between mb-3">
                <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', role.color)}>{role.name}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {role.permissions.map((perm) => (
                  <p key={perm} className="text-xs text-muted-foreground">· {perm}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={CARD} style={CARD_STYLE}>
        <h2 className="text-xl font-bold mb-4">User Role Assignments</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-10"><Loader2 size={20} className="animate-spin text-primary" /></div>
        ) : (
          <div className="flex flex-col gap-3">
            {users.map((user) => (
              <div key={user._id} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200/18 flex-wrap">
                <div>
                  <p className="font-bold text-sm">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', roleBadge[user.role] ?? 'bg-muted text-muted-foreground')}>
                    {roleLabel[user.role] ?? user.role}
                  </span>
                  <button onClick={() => { setEditUser(user); setNewRole(user.role); setRoleOpen(false) }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors">
                    <Pencil size={13} /> Change role
                  </button>
                </div>
              </div>
            ))}
            {users.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">No users found.</p>}
          </div>
        )}
      </div>

      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setEditUser(null); setRoleOpen(false) }} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Change role for {editUser.firstName} {editUser.lastName}</h2>
              <button onClick={() => { setEditUser(null); setRoleOpen(false) }} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X size={18} /></button>
            </div>
            <div className="flex flex-col gap-3 mb-6">
              <input value={editUser.email} disabled className={INPUT} />
              <div ref={roleRef} className="relative">
                <button
                  type="button"
                  onClick={() => setRoleOpen((v) => !v)}
                  className={cn(
                    'w-full h-10 px-3 rounded-xl border border-input bg-background text-sm text-left flex items-center justify-between gap-2 transition-colors',
                    roleOpen ? 'border-primary ring-2 ring-primary/20' : 'hover:border-slate-300'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold', roleBadge[newRole] ?? 'bg-muted text-muted-foreground')}>
                      {roleLabel[newRole] ?? newRole}
                    </span>
                  </div>
                  <ChevronDown size={15} className={cn('text-muted-foreground transition-transform flex-shrink-0', roleOpen && 'rotate-180')} />
                </button>
                {roleOpen && (
                  <div className="absolute z-30 top-[calc(100%+6px)] left-0 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                    {ROLES.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => { setNewRole(r); setRoleOpen(false) }}
                        className={cn(
                          'w-full px-3 py-2.5 text-sm text-left flex items-center justify-between gap-2 transition-colors',
                          r === newRole ? 'bg-primary/8 text-primary font-semibold' : 'hover:bg-slate-50 text-foreground'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold', roleBadge[r] ?? 'bg-muted text-muted-foreground')}>
                            {roleLabel[r]}
                          </span>
                        </div>
                        {r === newRole && <Check size={14} className="text-primary flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditUser(null)} className="px-5 py-2.5 rounded-full border-2 border-slate-300 font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={updateRole.isPending} className="px-5 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#061e35] disabled:opacity-50 transition-colors flex items-center gap-2">
                {updateRole.isPending ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

RoleManagementPage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>
export default RoleManagementPage
