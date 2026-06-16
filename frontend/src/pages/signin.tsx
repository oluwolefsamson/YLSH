import React, { useState } from 'react'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Shield,
  ArrowRight,
} from 'lucide-react'
import AuthShell from '@/components/auth/auth-shell'
import AuthFormCard from '@/components/auth/auth-form-card'
import AuthLink from '@/components/auth/auth-link'

const portals = [
  {
    label: 'Participant',
    description: 'Events, certificates, learning & opportunities',
    href: '/dashboard',
    icon: <LayoutDashboard size={20} />,
    color: '#127C71',
  },
  {
    label: 'Mentor',
    description: 'Sessions, mentees & availability',
    href: '/mentor',
    icon: <Users size={20} />,
    color: '#082F49',
  },
  {
    label: 'Admin',
    description: 'User & event management, analytics',
    href: '/admin',
    icon: <ShieldCheck size={20} />,
    color: '#7C3AED',
  },
  {
    label: 'Super Admin',
    description: 'Full system access, roles & audit logs',
    href: '/super-admin',
    icon: <Shield size={20} />,
    color: '#B91C1C',
  },
]

const SignInPage: NextPage = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showPortals, setShowPortals] = useState(false)

  const handleSignIn = (e: React.FormEvent): void => {
    e.preventDefault()
    setShowPortals(true)
  }

  return (
    <AuthShell
      eyebrow="Participant access"
      title="Sign in to your YLSH account"
      description="Access your events, attendance records, certificates, mentorship, and learning resources through a clean participant dashboard."
      footer={
        <p className="text-center text-muted-foreground">
          New here? <AuthLink href="/signup">Create an account</AuthLink>
        </p>
      }
    >
      <AuthFormCard
        title="Welcome back"
        subtitle="Use your verified credentials to continue into your personal YLSH workspace."
      >
        {!showPortals ? (
          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            {/* Email field */}
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full h-11 pl-9 pr-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full h-11 pl-9 pr-10 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input type="checkbox" defaultChecked className="accent-primary" />
                Remember this device
              </label>
              <AuthLink href="#">Forgot password?</AuthLink>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-full bg-primary text-white font-semibold text-sm hover:bg-[#0d5c54] transition-colors"
            >
              Sign In
            </button>
          </form>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                Signed in
              </span>
              <p className="text-sm text-muted-foreground">Choose a portal to enter</p>
            </div>

            <hr className="border-border mb-4" />

            <div className="flex flex-col gap-2">
              {portals.map((portal) => (
                <button
                  key={portal.label}
                  onClick={() => void router.push(portal.href)}
                  className="w-full flex items-center gap-4 p-3 rounded-xl border border-slate-200/22 text-left transition-all duration-150 hover:translate-x-1 group"
                  style={{ '--portal-color': portal.color } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = portal.color
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = `${portal.color}0d`
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = ''
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = ''
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: portal.color }}
                  >
                    {portal.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{portal.label} Dashboard</p>
                    <p className="text-xs text-muted-foreground">{portal.description}</p>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>

            <hr className="border-border my-4" />

            <button
              onClick={() => setShowPortals(false)}
              className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to sign in
            </button>
          </div>
        )}
      </AuthFormCard>
    </AuthShell>
  )
}

export default SignInPage
