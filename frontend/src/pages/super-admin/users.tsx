import React, { useState, useRef, useEffect } from 'react'
import { Users, Search, MoreVertical, CheckCircle, Clock, Ban } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import type { AdminUser, UserStatus, UserRole } from '@/types'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const allUsers: AdminUser[] = [
  { id: 1, name: 'Amina Bello', email: 'amina@example.com', role: 'Participant', status: 'verified', joined: 'Jun 14, 2026', state: 'Kaduna' },
  { id: 2, name: 'Emeka Obi', email: 'emeka@example.com', role: 'Participant', status: 'pending', joined: 'Jun 13, 2026', state: 'Lagos' },
  { id: 3, name: 'Fatima Al-Hassan', email: 'fatima@example.com', role: 'Mentor', status: 'verified', joined: 'Jun 12, 2026', state: 'Abuja' },
  { id: 4, name: 'Obiora Chukwu', email: 'obiora@ylsh.org', role: 'Admin', status: 'verified', joined: 'Jan 1, 2026', state: 'Enugu' },
  { id: 5, name: 'Aisha Mohammed', email: 'aisha@ylsh.org', role: 'Super Admin', status: 'verified', joined: 'Jan 1, 2026', state: 'Abuja' },
  { id: 6, name: 'Zahra Musa', email: 'zahra@example.com', role: 'Participant', status: 'suspended', joined: 'Jun 10, 2026', state: 'Kano' },
  { id: 7, name: 'Tunde Adeyemi', email: 'tunde@example.com', role: 'Mentor', status: 'verified', joined: 'Jun 9, 2026', state: 'Lagos' },
  { id: 8, name: 'Sule Ibrahim', email: 'sule@example.com', role: 'Participant', status: 'pending', joined: 'Jun 7, 2026', state: 'Katsina' },
]

const statusStyles: Record<UserStatus, string> = { verified: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', suspended: 'bg-red-100 text-red-700' }
const statusIcon: Record<UserStatus, React.ReactNode> = { verified: <CheckCircle size={11} />, pending: <Clock size={11} />, suspended: <Ban size={11} /> }
const roleBadge: Record<UserRole, string> = { 'Super Admin': 'bg-red-100 text-red-700', Admin: 'bg-primary/10 text-primary', Mentor: 'bg-green-100 text-green-700', Participant: 'bg-muted text-muted-foreground' }

const TABS = ['All', 'Verified', 'Pending', 'Suspended']

const SuperAdminUsersPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [menuId, setMenuId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const filtered = allUsers
    .filter((u) => tab === 0 ? true : tab === 1 ? u.status === 'verified' : tab === 2 ? u.status === 'pending' : u.status === 'suspended')
    .filter((u) => search === '' || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuId(null) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const tabCounts = [allUsers.length, allUsers.filter((u) => u.status === 'verified').length, allUsers.filter((u) => u.status === 'pending').length, allUsers.filter((u) => u.status === 'suspended').length]

  return (
    <div>
      <PageHeader eyebrow="All Users" title="Users" subtitle="Full system access to all user accounts across every role — Participant, Mentor, Admin, and Super Admin." icon={<Users size={14} />} />

      <div className={CARD} style={CARD_STYLE}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…" className="w-full h-10 pl-9 pr-4 rounded-full border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
          </div>
          <button className="px-4 py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-[#0d5c54] transition-colors">+ Invite user</button>
        </div>

        <div className="flex gap-1 border-b border-slate-200/18 mb-5">
          {TABS.map((label, i) => (
            <button key={label} onClick={() => setTab(i)} className={cn('px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors whitespace-nowrap', tab === i ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              {label} ({tabCounts[i]})
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3" ref={menuRef}>
          {filtered.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200/18 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email} · {user.state}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold', roleBadge[user.role])}>{user.role}</span>
                  <span className="text-xs text-muted-foreground">Joined {user.joined}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize', statusStyles[user.status])}>
                  {statusIcon[user.status]}{user.status}
                </span>
                <div className="relative">
                  <button onClick={() => setMenuId(menuId === user.id ? null : user.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                    <MoreVertical size={16} className="text-muted-foreground" />
                  </button>
                  {menuId === user.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200/50 rounded-xl shadow-lg py-1 z-50 min-w-[160px]">
                      {['View profile', 'Change role', 'Suspend account'].map((action) => (
                        <button key={action} onClick={() => setMenuId(null)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors">{action}</button>
                      ))}
                      <button onClick={() => setMenuId(null)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Delete account</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="py-12 text-center text-muted-foreground">No users match your search.</div>}
        </div>
      </div>
    </div>
  )
}

SuperAdminUsersPage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>
export default SuperAdminUsersPage
