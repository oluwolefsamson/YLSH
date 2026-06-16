import React, { FC, ReactNode, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import {
  Menu,
  LayoutDashboard,
  Users,
  CalendarCheck,
  BarChart2,
  ShieldCheck,
  Shield,
  LogOut,
  X,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { cn } from '@/utils'

interface Props {
  children: ReactNode
  superAdmin?: boolean
}

const drawerWidth = 288

const adminNavItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Events', href: '/admin/events', icon: CalendarCheck },
  { label: 'Verifications', href: '/admin/verifications', icon: ShieldCheck },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
]

const superAdminNavItems = [
  { label: 'Overview', href: '/super-admin', icon: LayoutDashboard },
  { label: 'Users', href: '/super-admin/users', icon: Users },
  { label: 'Events', href: '/super-admin/events', icon: CalendarCheck },
  { label: 'Role Management', href: '/super-admin/roles', icon: Shield },
  { label: 'Analytics', href: '/super-admin/analytics', icon: BarChart2 },
]

const AdminLayout: FC<Props> = ({ children, superAdmin = false }) => {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)

  const navItems = superAdmin ? superAdminNavItems : adminNavItems
  const portalLabel = superAdmin ? 'Super Admin' : 'Admin'
  const initials = superAdmin ? 'SA' : 'AD'
  const roleName = superAdmin ? 'System Administrator' : 'Platform Admin'
  const activeColor = superAdmin ? '#7c3aed' : '#127C71'
  const sidebarGradient = superAdmin
    ? 'linear-gradient(135deg, rgba(30,10,60,0.98) 0%, rgba(90,40,140,0.97) 100%)'
    : 'linear-gradient(135deg, rgba(8,47,73,0.98) 0%, rgba(18,124,113,0.97) 100%)'

  const handleConfirmSignOut = (): void => {
    setSignOutOpen(false)
    setMobileOpen(false)
    void router.push('/signin')
  }

  const sidebar = (
    <div className="h-full flex flex-col">
      {/* Gradient header */}
      <div className="p-6 relative overflow-hidden" style={{ background: sidebarGradient }}>
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/6 pointer-events-none" />
        <div className="relative z-10 mb-5">
          <Logo />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[15px] border-2 border-white/25" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-snug">{portalLabel}</p>
            <div className="flex items-center gap-1.5">
              <Shield size={11} style={{ color: superAdmin ? 'rgba(196,181,253,0.9)' : 'rgba(159,241,210,0.9)' }} />
              <p className="text-[11px] font-semibold" style={{ color: superAdmin ? 'rgba(196,181,253,0.9)' : 'rgba(159,241,210,0.9)' }}>
                {roleName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="px-3 pt-4 pb-2 flex-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold uppercase tracking-[1px] text-muted-foreground mb-2">{portalLabel} Portal</p>
        <nav className="mt-1 flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = router.pathname === item.href
            const Icon = item.icon
            return (
              <NextLink
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                  active
                    ? 'border-l-[3px] pl-[9px] font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                style={active
                  ? { color: activeColor, borderLeftColor: activeColor, background: `linear-gradient(90deg, ${activeColor}21 0%, ${activeColor}0a 100%)` }
                  : { '--hover-color': activeColor } as React.CSSProperties
                }
              >
                <Icon size={16} />
                {item.label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeColor }} />}
              </NextLink>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3">
        <hr className="border-border mb-3" />
        <button
          onClick={() => setSignOutOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f0f7f6 0%, #f3f6fb 100%)' }}>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 bg-white/95 backdrop-blur-xl h-full overflow-y-auto" style={{ width: drawerWidth }}>
            <button className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted" onClick={() => setMobileOpen(false)}>
              <X size={18} />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        <div className="hidden md:block flex-shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-slate-200/14 bg-white/95 backdrop-blur-xl" style={{ width: drawerWidth }}>
          {sidebar}
        </div>

        <div className="flex-1 min-w-0">
          <div
            className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-40"
            style={{ background: sidebarGradient }}
          >
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg text-white hover:bg-white/10">
                <Menu size={20} />
              </button>
              <Logo />
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/20 text-white" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              {portalLabel}
            </span>
          </div>

          <div className="py-6 md:py-8 px-4 md:px-8">
            {children}
          </div>
        </div>
      </div>

      {signOutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSignOutOpen(false)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <h2 className="text-lg font-bold mb-2">Sign out of YLSH?</h2>
            <p className="text-muted-foreground mb-6">You will be taken back to the sign-in page.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setSignOutOpen(false)} className="px-5 py-2 rounded-full border-2 border-slate-300 text-foreground font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleConfirmSignOut} className="px-5 py-2 rounded-full bg-primary text-white font-semibold text-sm hover:bg-[#0d5c54] transition-colors">Sign out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLayout
