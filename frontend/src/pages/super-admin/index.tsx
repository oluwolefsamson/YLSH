import React from 'react'
import NextLink from 'next/link'
import { Shield, Users, CalendarCheck, Award, ShieldCheck, GraduationCap, ShieldAlert, Loader2 } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useSuperDashboard, useAdminList, useAuditLog } from '@/services/hooks/analytics/analytics'
import { CARD, CARD_STYLE } from '@/utils/card-styles'


const SuperAdminOverviewPage: NextPageWithLayout = () => {
  const { data: dashboard, isLoading: loadingStats } = useSuperDashboard()
  const { data: admins = [], isLoading: loadingAdmins } = useAdminList()
  const { data: auditData, isLoading: loadingAudit } = useAuditLog(1, 5)
  const auditLog = auditData?.data ?? []

  const v = (x?: number) => (loadingStats ? '—' : (x ?? 0).toLocaleString())

  return (
    <div>
      <PageHeader eyebrow="Super Admin Portal" title="Super Admin Overview" subtitle="Full system access — manage all users, admins, roles, events, and view platform-wide audit logs." icon={<Shield size={14} />} />

      {(() => {
        const total = dashboard?.totalUsers ?? 0
        const verified = dashboard?.verifiedUsers ?? 0
        const certs = dashboard?.totalCertificates ?? 0
        const sessions = dashboard?.totalSessions ?? 0
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatCard label="Total users" value={v(total)} icon={<Users size={20} />} progress={undefined} />
            <StatCard label="Verified" value={v(verified)} icon={<ShieldCheck size={20} />} progress={total ? (verified / total) * 100 : 0} change={total ? `${Math.round((verified / total) * 100)}% rate` : undefined} />
            <StatCard label="Active events" value={v(dashboard?.activeEvents)} icon={<CalendarCheck size={20} />} progress={undefined} />
            <StatCard label="Certificates" value={v(certs)} icon={<Award size={20} />} progress={total ? Math.min((certs / total) * 100, 100) : 0} change={total ? `of ${total} users` : undefined} />
            <StatCard label="Total sessions" value={v(sessions)} icon={<GraduationCap size={20} />} progress={Math.min((sessions / 200) * 100, 100)} change={`of 200 target`} />
            <StatCard label="Admins" value={v(dashboard?.adminCount)} icon={<ShieldAlert size={20} />} progress={undefined} />
          </div>
        )
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className={CARD} style={CARD_STYLE}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Admin Accounts</h2>
            <NextLink href="/super-admin/roles" className="px-4 py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-[#061e35] transition-colors">Change Role</NextLink>
          </div>
          {loadingAdmins ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200/18 animate-pulse">
                  <div className="flex-1">
                    <div className="h-4 w-28 bg-muted rounded mb-2" />
                    <div className="h-3 w-40 bg-muted rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-20 bg-muted rounded-full" />
                    <div className="h-6 w-12 bg-muted rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {admins.slice(0, 5).map((admin) => (
                <div key={admin._id} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200/18 flex-wrap">
                  <div>
                    <p className="font-bold text-sm">{admin.firstName} {admin.lastName}</p>
                    <p className="text-xs text-muted-foreground">{admin.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', admin.role === 'super-admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
                      {admin.role === 'super-admin' ? 'Super Admin' : 'Admin'}
                    </span>
                    <NextLink href="/super-admin/roles" className="px-3 py-1 rounded-full border border-border text-xs font-semibold hover:bg-muted transition-colors">Edit</NextLink>
                  </div>
                </div>
              ))}
              {admins.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No admin accounts found.</p>}
            </div>
          )}
        </div>

        <div className="p-5 md:p-6 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, rgba(6,30,53,0.98) 0%, rgba(8,47,73,0.98) 100%)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} />
            <h2 className="text-xl font-bold">Audit Log</h2>
          </div>
          {loadingAudit ? (
            <div className="flex items-center justify-center py-8"><Loader2 size={20} className="animate-spin" style={{ color: 'rgba(255,255,255,0.7)' }} /></div>
          ) : auditLog.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>No audit log entries yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {auditLog.map((entry) => (
                <div key={entry._id} className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <p className="text-sm font-semibold mb-1">{entry.action}</p>
                  <div className="flex justify-between flex-wrap gap-1">
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>by {entry.actorEmail ?? entry.actorName ?? 'System'}</span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{new Date(entry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

SuperAdminOverviewPage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>
export default SuperAdminOverviewPage
