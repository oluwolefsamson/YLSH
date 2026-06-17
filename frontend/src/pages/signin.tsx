import React, { useState } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import { toast } from "sonner"
import {
  Mail, Lock, Eye, EyeOff, KeyRound,
  LayoutDashboard, Users, ShieldCheck, Shield, ArrowRight, ChevronLeft,
} from "lucide-react"
import AuthShell from "@/components/auth/auth-shell"
import AuthFormCard from "@/components/auth/auth-form-card"
import AuthLink from "@/components/auth/auth-link"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useAuth } from "@/contexts/AuthContext"
import { login as apiLogin, loginVerifyOtp, type AuthUser, type AuthResponse } from "@/services/endpoints/auth/auth"

type SigninStep = "select" | "form" | "otp"

const portals = [
  {
    label: "Participant",
    description: "Events, certificates, learning & opportunities",
    href: "/dashboard",
    icon: <LayoutDashboard size={22} />,
    color: "#127C71",
    role: "participant",
  },
  {
    label: "Mentor",
    description: "Sessions, mentees & availability",
    href: "/mentor",
    icon: <Users size={22} />,
    color: "#082F49",
    role: "mentor",
  },
  {
    label: "Admin",
    description: "User & event management, analytics",
    href: "/admin",
    icon: <ShieldCheck size={22} />,
    color: "#7C3AED",
    role: "admin",
  },
  {
    label: "Super Admin",
    description: "Full system access, roles & audit logs",
    href: "/super-admin",
    icon: <Shield size={22} />,
    color: "#B91C1C",
    role: "super-admin",
  },
]

type Portal = (typeof portals)[0]

const ROLE_HREF: Record<string, string> = {
  participant: "/dashboard",
  mentor: "/mentor",
  admin: "/admin",
  "super-admin": "/super-admin",
}

const shellConfig = (step: SigninStep, portal: Portal | null) => {
  if (step === "select") return {
    eyebrow: "YLSH Platform",
    title: "Sign in to your YLSH account",
    description: "Select your role below to access your personalised workspace — events, certificates, mentorship, analytics, and more.",
  }
  if (step === "otp") return {
    eyebrow: "Super Admin access",
    title: "Security verification",
    description: "A 6-digit one-time code was sent to your registered email. Enter it to complete super admin sign-in.",
  }
  return {
    eyebrow: portal ? `${portal.label} access` : "Participant access",
    title: portal ? `Sign in as ${portal.label}` : "Sign in to your YLSH account",
    description: portal?.description ?? "Access your events, attendance records, certificates, mentorship, and learning resources.",
  }
}

const SignInPage: NextPage = () => {
  const router = useRouter()
  const { setUser } = useAuth()

  const [step, setStep] = useState<SigninStep>("select")
  const [selectedPortal, setSelectedPortal] = useState<Portal | null>(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [preAuthToken, setPreAuthToken] = useState("")
  const [otp, setOtp] = useState("")

  const { eyebrow, title, description } = shellConfig(step, selectedPortal)

  const storeAndSetUser = (token: string, u: AuthUser) => {
    localStorage.setItem("token", token)
    setUser(u)
  }

  const handlePortalSelect = (portal: Portal) => {
    setSelectedPortal(portal)
    setStep("form")
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { toast.error("Please enter your email and password"); return }
    setIsLoading(true)
    try {
      const resp = await apiLogin(email, password)

      if ("requiresOtp" in resp && resp.requiresOtp) {
        setPreAuthToken(resp.preAuthToken)
        setStep("otp")
        toast.info("A 6-digit code was sent to your email.")
        return
      }

      const { token, user } = resp as AuthResponse

      if (user.role === "mentor" && user.approvalStatus !== "approved") {
        storeAndSetUser(token, user)
        void router.push("/mentor/pending")
        return
      }

      storeAndSetUser(token, user)
      void router.push(ROLE_HREF[user.role] ?? "/dashboard")
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Invalid email or password"
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) { toast.error("Please enter the 6-digit code"); return }
    setIsLoading(true)
    try {
      const { token, user } = await loginVerifyOtp(preAuthToken, otp)
      storeAndSetUser(token, user)
      void router.push("/super-admin")
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Invalid or expired code"
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow={eyebrow}
      title={title}
      description={description}
      footer={<p className="text-center text-muted-foreground">New here? <AuthLink href="/signup">Create an account</AuthLink></p>}
    >
      <AuthFormCard
        title={step === "select" ? "Who are you?" : step === "otp" ? "Verify your identity" : `Welcome back`}
        subtitle={
          step === "select"
            ? "Choose your role to continue to the login form."
            : step === "otp"
            ? "Enter the 6-digit code sent to your email."
            : "Use your verified credentials to sign in."
        }
      >

        {/* ── Step 1: Role selection ── */}
        {step === "select" && (
          <div className="grid grid-cols-2 gap-3">
            {portals.map((portal) => (
              <button
                key={portal.role}
                onClick={() => handlePortalSelect(portal)}
                className="group relative flex flex-col items-start gap-3 p-4 rounded-2xl border-2 border-slate-100 bg-white text-left transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                style={{ '--portal-color': portal.color } as React.CSSProperties}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = portal.color
                  el.style.backgroundColor = `${portal.color}0a`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = ""
                  el.style.backgroundColor = ""
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: portal.color }}
                >
                  {portal.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-800 leading-snug">{portal.label}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">{portal.description}</p>
                </div>
                <ArrowRight
                  size={14}
                  className="absolute top-3.5 right-3.5 text-slate-300 group-hover:text-slate-500 transition-colors"
                />
              </button>
            ))}
          </div>
        )}

        {/* ── Step 2: Email + password form ── */}
        {step === "form" && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-4">

            {/* Selected role badge */}
            {selectedPortal && (
              <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: selectedPortal.color }}
                  >
                    {React.cloneElement(selectedPortal.icon as React.ReactElement, { size: 14 })}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{selectedPortal.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setStep("select"); setEmail(""); setPassword("") }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <ChevronLeft size={13} />
                  Change
                </button>
              </div>
            )}

            <button type="button" className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                <path d="M47.532 24.552c0-1.636-.147-3.2-.42-4.704H24.48v8.896h12.96c-.56 3.008-2.24 5.552-4.768 7.264v6.032h7.712c4.512-4.16 7.148-10.288 7.148-17.488z" fill="#4285F4"/>
                <path d="M24.48 48c6.48 0 11.92-2.144 15.904-5.808l-7.712-6.032c-2.144 1.44-4.88 2.288-8.192 2.288-6.304 0-11.648-4.256-13.552-9.984H3.008v6.224C6.976 42.8 15.136 48 24.48 48z" fill="#34A853"/>
                <path d="M10.928 28.464A14.44 14.44 0 0 1 10.4 24c0-1.552.272-3.056.528-4.464V13.312H3.008A23.968 23.968 0 0 0 .48 24c0 3.872.928 7.52 2.528 10.688l7.92-6.224z" fill="#FBBC05"/>
                <path d="M24.48 9.552c3.552 0 6.736 1.216 9.248 3.616l6.912-6.912C36.4 2.368 30.96 0 24.48 0 15.136 0 6.976 5.2 3.008 13.312l7.92 6.224c1.904-5.728 7.248-9.984 13.552-9.984z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <hr className="flex-1 border-border" />
              <span className="text-xs text-muted-foreground">or sign in with email</span>
              <hr className="flex-1 border-border" />
            </div>

            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-9 pr-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              disabled={isLoading}
              className="w-full h-11 rounded-full text-white font-semibold text-sm disabled:opacity-60 transition-colors"
              style={{ backgroundColor: selectedPortal?.color ?? "#127C71" }}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {/* ── Step 3: OTP verification (super-admin only) ── */}
        {step === "otp" && (
          <form onSubmit={handleOtpVerify} className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 text-center py-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(185,28,28,0.10)" }}>
                <KeyRound size={22} style={{ color: "#B91C1C" }} />
              </div>
              <div>
                <p className="font-bold text-base">Admin Verification Required</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  A 6-digit security code was sent to your registered email. Enter it below to complete sign-in.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full h-11 rounded-full text-white font-semibold text-sm disabled:opacity-60 transition-colors"
              style={{ backgroundColor: "#B91C1C" }}
            >
              {isLoading ? "Verifying..." : "Verify & Sign In"}
            </button>

            <button
              type="button"
              onClick={() => { setStep("form"); setOtp(""); setPreAuthToken("") }}
              className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft size={14} />
              Back to sign in
            </button>
          </form>
        )}

      </AuthFormCard>
    </AuthShell>
  )
}

export default SignInPage
