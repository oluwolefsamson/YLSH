import React, { FC, ReactNode, useState, useRef, useEffect } from 'react'
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
  UserCircle,
  ScanLine,
  Search,
  Bell,
  ChevronDown,
  GraduationCap,
  Trophy,
  Award,
} from 'lucide-react'
import { cn } from '@/utils'
import { useAuth } from '@/contexts/AuthContext'
import type { NavItem } from '@/types'

interface Props {
  children: ReactNode
  superAdmin?: boolean
}

const SIDEBAR_W = 260
const COLLAPSED_W = 68

const adminNavItems: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Events', href: '/admin/events', icon: CalendarCheck },
  { label: 'Check-in', href: '/admin/checkin', icon: ScanLine },
  { label: 'Learning', href: '/admin/learning', icon: GraduationCap },
  { label: 'Opportunities', href: '/admin/opportunities', icon: Trophy },
  { label: 'Certificates', href: '/admin/certificates', icon: Award },
  { label: 'Verifications', href: '/admin/verifications', icon: ShieldCheck },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { label: 'Profile', href: '/admin/profile', icon: UserCircle },
]

const superAdminNavItems: NavItem[] = [
  { label: 'Overview', href: '/super-admin', icon: LayoutDashboard },
  { label: 'Users', href: '/super-admin/users', icon: Users },
  { label: 'Events', href: '/super-admin/events', icon: CalendarCheck },
  { label: 'Learning', href: '/super-admin/learning', icon: GraduationCap },
  { label: 'Opportunities', href: '/super-admin/opportunities', icon: Trophy },
  { label: 'Certificates', href: '/super-admin/certificates', icon: Award },
  { label: 'Verifications', href: '/super-admin/verifications', icon: ShieldCheck },
  { label: 'Role Management', href: '/super-admin/roles', icon: Shield },
  { label: 'Analytics', href: '/super-admin/analytics', icon: BarChart2 },
  { label: 'Profile', href: '/super-admin/profile', icon: UserCircle },
]

const AdminLayout: FC<Props> = ({ children, superAdmin = false }) => {
  const router = useRouter()
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const navItems = superAdmin ? superAdminNavItems : adminNavItems
  const portalLabel = superAdmin ? 'Super Admin' : 'Admin'
  const profileHref = superAdmin ? '/super-admin/profile' : '/admin/profile'
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : superAdmin ? 'SA' : 'AD'
  const displayName = user ? `${user.firstName} ${user.lastName}` : portalLabel
  const roleName = superAdmin ? 'System Administrator' : 'Platform Admin'
  const accentColor = superAdmin ? '#7c3aed' : '#082F49'

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleConfirmSignOut = (): void => {
    setSignOutOpen(false)
    setMobileOpen(false)
    setUserMenuOpen(false)
    void router.push('/signin')
  }

  const sidebarContent = (isCollapsed: boolean, allowCollapse = true) => (
    <div className="h-full flex flex-col">
      {/* Brand */}
      <div className={cn('flex items-center h-16 border-b border-slate-100 flex-shrink-0', isCollapsed ? 'px-4 justify-center' : 'px-5 justify-between')}>
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg grid place-items-center text-white font-extrabold text-sm flex-shrink-0" style={{ backgroundColor: accentColor }}>Y</div>
            <span className="text-[18px] font-extrabold tracking-tight text-slate-800">YL<span style={{ color: accentColor }}>SH</span></span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg grid place-items-center text-white font-extrabold text-sm" style={{ backgroundColor: accentColor }}>Y</div>
        )}
        {allowCollapse && !isCollapsed && (
          <button onClick={() => setCollapsed(true)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <Menu size={17} />
          </button>
        )}
        {allowCollapse && isCollapsed && (
          <button onClick={() => setCollapsed(false)} className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors z-10">
            <ChevronDown size={12} className="-rotate-90" />
          </button>
        )}
      </div>

      {/* Nav */}
      <div className={cn('flex-1 overflow-y-auto py-4', isCollapsed ? 'px-2' : 'px-3')}>
        {!isCollapsed && <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{portalLabel} Portal</p>}
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = router.pathname === item.href
            const Icon = item.icon
            return (
              <NextLink
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg text-sm transition-colors',
                  isCollapsed ? 'justify-center w-10 h-10 mx-auto' : 'px-3 py-2.5',
                  active ? 'bg-primary text-white font-semibold' : 'text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <Icon size={17} className="flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NextLink>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className={cn('py-3 border-t border-slate-100', isCollapsed ? 'px-2' : 'px-3')}>
        <button
          onClick={() => setSignOutOpen(true)}
          title={isCollapsed ? 'Sign out' : undefined}
          className={cn('flex items-center gap-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full', isCollapsed ? 'justify-center w-10 h-10 mx-auto' : 'px-3 py-2.5')}
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 bg-white h-full overflow-y-auto shadow-xl" style={{ width: SIDEBAR_W }}>
            <button className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-slate-100" onClick={() => setMobileOpen(false)}>
              <X size={17} className="text-slate-500" />
            </button>
            {sidebarContent(false, false)}
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside
          className="hidden md:flex flex-col flex-shrink-0 sticky top-0 h-screen bg-white border-r border-slate-200 transition-all duration-200"
          style={{ width: collapsed ? COLLAPSED_W : SIDEBAR_W }}
        >
          {sidebarContent(collapsed)}
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Sticky top bar */}
          <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 px-4 md:px-6 flex items-center justify-between flex-shrink-0">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors" onClick={() => setMobileOpen(true)}>
                <Menu size={20} />
              </button>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-800">{portalLabel} Portal</p>
                <p className="text-xs text-slate-400">{roleName}</p>
              </div>
              <span className="md:hidden text-slate-800 font-extrabold text-base tracking-tight">
                YL<span style={{ color: accentColor }}>SH</span>
              </span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1">
              {/* Search — navigates to users/events list */}
              <NextLink
                href={superAdmin ? '/super-admin/users' : '/admin/users'}
                className="w-9 h-9 grid place-items-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                title="Search users"
              >
                <Search size={18} />
              </NextLink>

              {/* Bell — navigates to verifications */}
              <NextLink
                href={superAdmin ? '/super-admin/verifications' : '/admin/verifications'}
                className="relative w-9 h-9 grid place-items-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                title="Pending verifications"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />
              </NextLink>

              {/* User menu */}
              <div className="relative ml-1 pl-2 border-l border-slate-200" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full grid place-items-center text-white font-bold text-xs flex-shrink-0" style={{ backgroundColor: accentColor }}>
                    {initials}
                  </div>
                  <div className="hidden lg:block leading-tight text-left">
                    <p className="text-sm font-semibold text-slate-800">{displayName}</p>
                    <p className="text-[11px] text-slate-400">{roleName}</p>
                  </div>
                  <ChevronDown size={14} className={cn('text-slate-400 hidden lg:block transition-transform', userMenuOpen && 'rotate-180')} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-semibold text-slate-800 truncate">{displayName}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <NextLink
                      href={profileHref}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <UserCircle size={15} className="text-slate-400" />
                      View Profile
                    </NextLink>
                    <button
                      onClick={() => { setUserMenuOpen(false); setSignOutOpen(true) }}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>

      {/* Sign out dialog */}
      {signOutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSignOutOpen(false)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <h2 className="text-lg font-bold mb-2">Sign out of YLSH?</h2>
            <p className="text-slate-500 mb-6">You will be taken back to the sign-in page.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setSignOutOpen(false)} className="px-5 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleConfirmSignOut} className="px-5 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-[#061e35] transition-colors">
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLayout
