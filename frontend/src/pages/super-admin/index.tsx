import React from 'react'
import { Shield, Users, CalendarCheck, Award, ShieldCheck, GraduationCap, ShieldAlert } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const stats = [
  { label: 'Total users', value: '4,821', progress: 48, icon: <Users size={20} /> },
  { label: 'Verified', value: '3,940', progress: 82, icon: <ShieldCheck size={20} /> },
  { label: 'Events', value: '28', progress: 70, icon: <CalendarCheck size={20} /> },
  { label: 'Certificates', value: '3,104', progress: 62, icon: <Award size={20} /> },
  { label: 'Mentors', value: '47', progress: 55, icon: <GraduationCap size={20} /> },
  { label: 'Admins', value: '6', progress: 30, icon: <ShieldAlert size={20} /> },
]

const adminAccounts = [
  { name: 'Obiora Chukwu', email: 'obiora@ylsh.org', role: 'Admin', lastActive: '1 hr ago', status: 'active' },
  { name: 'Mariam Suleiman', email: 'mariam@ylsh.org', role: 'Admin', lastActive: '3 hrs ago', status: 'active' },
  { name: 'Emeka Nwofor', email: 'emeka.n@ylsh.org', role: 'Admin', lastActive: 'Yesterday', status: 'active' },
  { name: 'Aisha Mohammed', email: 'aisha@ylsh.org', role: 'Super Admin', lastActive: 'Now', status: 'active' },
]

const auditLog = [
  { action: 'Role changed: emeka.n@ylsh.org → Admin', actor: 'aisha@ylsh.org', time: '2 hrs ago' },
  { action: 'User suspended: zahra@example.com', actor: 'mariam@ylsh.org', time: '5 hrs ago' },
  { action: 'New event created: Youth Leadership Summit 2026', actor: 'obiora@ylsh.org', time: 'Yesterday' },
  { action: 'Certificate batch issued: 87 records', actor: 'System (BullMQ)', time: 'Yesterday' },
  { action: 'NIN verification cleared: batch 412', actor: 'System', time: '2 days ago' },
]

const SuperAdminOverviewPage: NextPageWithLayout = () => {
  return (
    <div>
      <PageHeader eyebrow="Super Admin Portal" title="Super Admin Overview" subtitle="Full system access — manage all users, admins, roles, events, and view platform-wide audit logs." icon={<Shield size={14} />} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} icon={card.icon} progress={card.progress} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Admin accounts */}
        <div className={CARD} style={CARD_STYLE}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Admin Accounts</h2>
            <button className="px-4 py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-[#0d5c54] transition-colors">+ Add admin</button>
          </div>
          <div className="flex flex-col gap-3">
            {adminAccounts.map((admin) => (
              <div key={admin.email} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200/18 flex-wrap">
                <div>
                  <p className="font-bold text-sm">{admin.name}</p>
                  <p className="text-xs text-muted-foreground">{admin.email}</p>
                  <p className="text-xs text-muted-foreground">Last active: {admin.lastActive}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', admin.role === 'Super Admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
                    {admin.role}
                  </span>
                  <button className="px-3 py-1 rounded-full border border-border text-xs font-semibold hover:bg-muted transition-colors">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit log */}
        <div className="p-5 md:p-6 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, rgba(8,47,73,0.98) 0%, rgba(18,124,113,0.98) 100%)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} />
            <h2 className="text-xl font-bold">Audit Log</h2>
          </div>
          <div className="flex flex-col gap-3">
            {auditLog.map((entry, i) => (
              <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p className="text-sm font-semibold mb-1">{entry.action}</p>
                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>by {entry.actor}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{entry.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

SuperAdminOverviewPage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>
export default SuperAdminOverviewPage
