import React, { FC, ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import {
  Menu,
  LayoutDashboard,
  CalendarCheck,
  Award,
  GraduationCap,
  Trophy,
  Users,
  UserCircle,
  LogOut,
  ShieldCheck,
  X,
  QrCode,
  Search,
  Bell,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/utils'
import { useAuth, ROLE_REDIRECTS } from '@/contexts/AuthContext'
import type { NavItem } from '@/types'

interface Props { children: ReactNode }

const SIDEBAR_W = 260
const COLLAPSED_W = 68
const ACCENT = '#127C71'

const navItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Events', href: '/dashboard/events', icon: CalendarCheck },
  { label: 'My Registrations', href: '/dashboard/registrations', icon: QrCode },
  { label: 'Certificates', href: '/dashboard/certificates', icon: Award },
  { label: 'Learning', href: '/dashboard/learning', icon: GraduationCap },
  { label: 'Opportunities', href: '/dashboard/opportunities', icon: Trophy },
  { label: 'Mentorship', href: '/dashboard/mentorship', icon: Users },
  { label: 'Profile', href: '/dashboard/profile', icon: UserCircle },
]

const DashboardLayout: FC<Props> = ({ children }) => {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (!isLoading && user && user.role !== 'participant') {
      void router.replace(ROLE_REDIRECTS[user.role] ?? '/signin')
    }
  }, [user, isLoading, router])

  const handleConfirmSignOut = (): void => {
    setSignOutOpen(false)
    setMobileOpen(false)
    void logout()
  }

  if (!isLoading && user && user.role !== 'participant') return null

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || '?'
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Participant'

  const sidebarContent = (isCollapsed: boolean, allowCollapse = true) => (
    <div className="h-full flex flex-col">
      {/* Brand */}
      <div className={cn('flex items-center h-16 border-b border-slate-100 flex-shrink-0', isCollapsed ? 'px-4 justify-center' : 'px-5 justify-between')}>
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg grid place-items-center text-white font-extrabold text-sm flex-shrink-0"
              style={{ backgroundColor: ACCENT }}
            >
              Y
            </div>
            <span className="text-[18px] font-extrabold tracking-tight text-slate-800">
              YL<span style={{ color: ACCENT }}>SH</span>
            </span>
          </div>
        )}
        {isCollapsed && (
          <div
            className="w-8 h-8 rounded-lg grid place-items-center text-white font-extrabold text-sm"
            style={{ backgroundColor: ACCENT }}
          >
            Y
          </div>
        )}
        {allowCollapse && !isCollapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <Menu size={17} />
          </button>
        )}
        {allowCollapse && isCollapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors z-10"
          >
            <ChevronDown size={12} className="-rotate-90" />
          </button>
        )}
      </div>

      {/* Nav */}
      <div className={cn('flex-1 overflow-y-auto py-4', isCollapsed ? 'px-2' : 'px-3')}>
        {!isCollapsed && (
          <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
            Navigation
          </p>
        )}
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
                  active
                    ? 'font-semibold text-white'
                    : 'text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900'
                )}
                style={active ? { backgroundColor: ACCENT } : undefined}
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
          className={cn(
            'flex items-center gap-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full',
            isCollapsed ? 'justify-center w-10 h-10 mx-auto' : 'px-3 py-2.5'
          )}
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
              <button
                className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={20} />
              </button>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-800">Participant Portal</p>
                <div className="flex items-center gap-1">
                  <ShieldCheck size={11} style={{ color: ACCENT }} />
                  <p className="text-xs text-slate-400">
                    {user?.verificationStatus === 'verified' ? 'Verified' : 'Unverified'} Participant
                  </p>
                </div>
              </div>
              <span className="md:hidden text-slate-800 font-extrabold text-base tracking-tight">
                YL<span style={{ color: ACCENT }}>SH</span>
              </span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1">
              <button className="w-9 h-9 grid place-items-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
                <Search size={18} />
              </button>
              <button className="relative w-9 h-9 grid place-items-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />
              </button>
              <div className="flex items-center gap-2 ml-1 pl-2 border-l border-slate-200">
                <div
                  className="w-8 h-8 rounded-full grid place-items-center text-white font-bold text-xs flex-shrink-0"
                  style={{ backgroundColor: ACCENT }}
                >
                  {initials}
                </div>
                <div className="hidden lg:block leading-tight">
                  <p className="text-sm font-semibold text-slate-800">{fullName}</p>
                  <p className="text-[11px] text-slate-400">Participant</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden lg:block" />
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
              <button
                onClick={() => setSignOutOpen(false)}
                className="px-5 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSignOut}
                className="px-5 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-[#061e35] transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardLayout
