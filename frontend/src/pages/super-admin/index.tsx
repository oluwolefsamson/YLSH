import React from 'react'
import NextLink from 'next/link'
import { Shield, Users, CalendarCheck, Award, ShieldCheck, GraduationCap, ShieldAlert, Loader2 } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useSuperDashboard, useAdminList, useAuditLog } from '@/services/hooks/analytics/analytics'
import { CARD, CARD_STYLE, ACCENT_CARD, ACCENT_CARD_STYLE } from '@/utils/card-styles'

const SuperAdminOverviewPage: NextPageWithLayout = () => {
  const { data: dashboard, isLoading: loadingStats } = useSuperDashboard()
  const { data: admins = [], isLoading: loadingAdmins } = useAdminList()
  const { data: auditData, isLoading: loadingAudit } = useAuditLog(1, 5)
  const auditLog = auditData?.data ?? []

  const v = (x?: number) => (loadingStats ? '—' : (x ?? 0).toLocaleString())
  const total = dashboard?.totalUsers ?? 0
  const verified = dashboard?.verifiedUsers ?? 0
  const certs = dashboard?.totalCertificates ?? 0
  const sessions = dashboard?.totalSessions ?? 0

  return (
    <div>
      <PageHeader
        eyebrow="Super Admin Portal"
        title="Super Admin Overview"
        subtitle="Full system access — manage all users, admins, roles, events, and view platform-wide audit logs."
        icon={<Shield size={14} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total users" value={v(total)} icon={<Users size={20} />} />
        <StatCard label="Verified" value={v(verified)} icon={<ShieldCheck size={20} />} progress={total ? (verified / total) * 100 : 0} change={total ? `${Math.round((verified / total) * 100)}% rate` : undefined} accent="#22c55e" />
        <StatCard label="Active events" value={v(dashboard?.activeEvents)} icon={<CalendarCheck size={20} />} accent="#3b82f6" />
        <StatCard label="Certificates" value={v(certs)} icon={<Award size={20} />} progress={total ? Math.min((certs / total) * 100, 100) : 0} change={total ? `of ${total} users` : undefined} accent="#f59e0b" />
        <StatCard label="Total sessions" value={v(sessions)} icon={<GraduationCap size={20} />} progress={Math.min((sessions / 200) * 100, 100)} change="of 200 target" accent="#8b5cf6" />
        <StatCard label="Admins" value={v(dashboard?.adminCount)} icon={<ShieldAlert size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Admin Accounts */}
        <div className={CARD} style={CARD_STYLE}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-bold text-slate-800">Admin Accounts</p>
            <NextLink href="/super-admin/roles" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors">
              Change Role
            </NextLink>
          </div>
          {loadingAdmins ? (
            <div className="divide-y divide-slate-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 py-3.5 animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 w-28 bg-slate-100 rounded-lg mb-1.5" />
                    <div className="h-3 w-40 bg-slate-100 rounded-lg" />
                  </div>
                  <div className="h-6 w-20 bg-slate-100 rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {admins.slice(0, 5).map((admin) => {
                const initials = `${admin.firstName?.[0] ?? ''}${admin.lastName?.[0] ?? ''}`.toUpperCase()
                const isSuperAdmin = admin.role === 'super-admin'
                return (
                  <div key={admin._id} className="flex items-center gap-3 py-3.5">
                    <div className="w-9 h-9 rounded-xl grid place-items-center text-white text-xs font-bold flex-shrink-0" style={{ background: isSuperAdmin ? 'linear-gradient(135deg,#8b5cf6,#6d28d9)' : 'linear-gradient(135deg,#0d3d6e,#082F49)' }}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800">{admin.firstName} {admin.lastName}</p>
                      <p className="text-xs text-slate-400 truncate">{admin.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={cn('inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold', isSuperAdmin ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-600')}>
                        {isSuperAdmin ? 'Super Admin' : 'Admin'}
                      </span>
                      <NextLink href="/super-admin/roles" className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors text-slate-600">
                        Edit
                      </NextLink>
                    </div>
                  </div>
                )
              })}
              {admins.length === 0 && <p className="text-sm text-slate-400 py-4 text-center">No admin accounts found.</p>}
            </div>
          )}
        </div>

        {/* Audit Log — accent panel */}
        <div className={ACCENT_CARD} style={{ ...ACCENT_CARD_STYLE, background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', boxShadow: '0 12px 30px rgba(49,46,129,0.22)' }}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-white/15 grid place-items-center"><Shield size={15} /></div>
            <p className="text-base font-bold">Audit Log</p>
          </div>
          {loadingAudit ? (
            <div className="flex items-center justify-center py-8"><Loader2 size={20} className="animate-spin text-white/70" /></div>
          ) : auditLog.length === 0 ? (
            <p className="text-sm text-white/60 py-4 text-center">No audit log entries yet.</p>
          ) : (
            <div className="flex flex-col">
              {auditLog.map((entry) => (
                <div key={entry._id} className="py-3 border-b border-white/10 last:border-0">
                  <p className="text-sm font-semibold text-white mb-1 leading-snug">{entry.action}</p>
                  <div className="flex justify-between flex-wrap gap-1">
                    <span className="text-xs text-white/60">by {entry.actorEmail ?? entry.actorName ?? 'System'}</span>
                    <span className="text-xs text-white/40">{new Date(entry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
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
