import React, { useState } from 'react'
import { ShieldAlert, Pencil, X } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import type { RbacRole, RoleUser, UserRole } from '@/types'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }
const INPUT = 'w-full h-10 px-3 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:bg-muted transition-colors'

const roles: RbacRole[] = [
  { name: 'Participant', count: 4, color: 'bg-muted text-muted-foreground', permissions: ['Register for events', 'View and download certificates', 'Access learning resources', 'Apply to opportunities', 'Book mentorship sessions'] },
  { name: 'Mentor', count: 47, color: 'bg-green-100 text-green-700', permissions: ['All Participant permissions', 'Manage mentorship sessions', 'Set availability', 'View assigned mentees'] },
  { name: 'Admin', count: 5, color: 'bg-primary/10 text-primary', permissions: ['All Mentor permissions', 'Manage users and events', 'Issue certificates', 'View analytics', 'Handle identity verifications'] },
  { name: 'Super Admin', count: 1, color: 'bg-red-100 text-red-700', permissions: ['Full system access', 'Manage admin accounts', 'Assign/revoke roles', 'View audit logs', 'System configuration'] },
]

const users: RoleUser[] = [
  { id: 1, name: 'Amina Bello', email: 'amina@example.com', role: 'Participant' },
  { id: 2, name: 'Emeka Obi', email: 'emeka@example.com', role: 'Participant' },
  { id: 3, name: 'Fatima Al-Hassan', email: 'fatima@example.com', role: 'Mentor' },
  { id: 4, name: 'Obiora Chukwu', email: 'obiora@ylsh.org', role: 'Admin' },
  { id: 5, name: 'Aisha Mohammed', email: 'aisha@ylsh.org', role: 'Super Admin' },
]

const roleBadge: Record<UserRole, string> = { 'Super Admin': 'bg-red-100 text-red-700', Admin: 'bg-primary/10 text-primary', Mentor: 'bg-green-100 text-green-700', Participant: 'bg-muted text-muted-foreground' }

const RoleManagementPage: NextPageWithLayout = () => {
  const [editUser, setEditUser] = useState<RoleUser | null>(null)
  const [newRole, setNewRole] = useState('')

  return (
    <div>
      <PageHeader eyebrow="Role Management" title="Role Management" subtitle="View the RBAC matrix and assign or revoke roles for any user account." icon={<ShieldAlert size={14} />} />

      <div className={cn(CARD, 'mb-5')} style={CARD_STYLE}>
        <h2 className="text-xl font-bold mb-4">RBAC Matrix</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role) => (
            <div key={role.name} className="flex flex-col p-4 rounded-xl border border-slate-200/18">
              <div className="flex items-center justify-between mb-3">
                <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', role.color)}>{role.name}</span>
                <span className="text-xs text-muted-foreground">{role.count} users</span>
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
        <div className="flex flex-col gap-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200/18 flex-wrap">
              <div>
                <p className="font-bold text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', roleBadge[user.role])}>{user.role}</span>
                <button onClick={() => { setEditUser(user); setNewRole(user.role) }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors">
                  <Pencil size={13} /> Change role
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditUser(null)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Change role for {editUser.name}</h2>
              <button onClick={() => setEditUser(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X size={18} /></button>
            </div>
            <div className="flex flex-col gap-3 mb-6">
              <input value={editUser.email} disabled className={INPUT} />
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className={INPUT}>
                {['Participant', 'Mentor', 'Admin', 'Super Admin'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditUser(null)} className="px-5 py-2.5 rounded-full border-2 border-slate-300 font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
              <button onClick={() => setEditUser(null)} className="px-5 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

RoleManagementPage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>
export default RoleManagementPage
