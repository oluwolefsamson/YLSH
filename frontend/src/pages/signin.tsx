import React, { useState } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import { toast } from "sonner"
import {
  Mail, Lock, Eye, EyeOff, KeyRound,
  LayoutDashboard, Users, ShieldCheck, Shield, ArrowRight,
} from "lucide-react"
import AuthShell from "@/components/auth/auth-shell"
import AuthFormCard from "@/components/auth/auth-form-card"
import AuthLink from "@/components/auth/auth-link"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useAuth } from "@/contexts/AuthContext"
import { login as apiLogin, loginVerifyOtp, type AuthUser } from "@/services/endpoints/auth/auth"

type SigninStep = "form" | "otp" | "portals"

const portals = [
  { label: "Participant", description: "Events, certificates, learning & opportunities", href: "/dashboard", icon: <LayoutDashboard size={20} />, color: "#127C71", role: "participant" },
  { label: "Mentor", description: "Sessions, mentees & availability", href: "/mentor", icon: <Users size={20} />, color: "#082F49", role: "mentor" },
  { label: "Admin", description: "User & event management, analytics", href: "/admin", icon: <ShieldCheck size={20} />, color: "#7C3AED", role: "admin" },
  { label: "Super Admin", description: "Full system access, roles & audit logs", href: "/super-admin", icon: <Shield size={20} />, color: "#B91C1C", role: "super-admin" },
]

const ROLE_HREF: Record<string, string> = {
  participant: "/dashboard",
  mentor: "/mentor",
  admin: "/admin",
  "super-admin": "/super-admin",
}

const SignInPage: NextPage = () => {
  const router = useRouter()
  const { setUser } = useAuth()

  const [step, setStep] = useState<SigninStep>("form")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // OTP step state (super-admin)
  const [preAuthToken, setPreAuthToken] = useState("")
  const [otp, setOtp] = useState("")

  // Portals step state
  const [signedInRole, setSignedInRole] = useState("")

  const storeAndSetUser = (token: string, u: AuthUser) => {
    localStorage.setItem("token", token)
    setUser(u)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { toast.error("Please enter your email and password"); return }
    setIsLoading(true)
    try {
      const resp = await apiLogin(email, password)

      // Super-admin OTP required
      if ("requiresOtp" in resp && resp.requiresOtp) {
        setPreAuthToken(resp.preAuthToken)
        setStep("otp")
        toast.info("A 6-digit code was sent to your email.")
        return
      }

      const { token, user } = resp

      // Mentor pending approval — redirect to tracking page
      if (user.role === "mentor" && user.approvalStatus !== "approved") {
        storeAndSetUser(token, user)
        void router.push("/mentor/pending")
        return
      }

      storeAndSetUser(token, user)
      setSignedInRole(user.role)
      setStep("portals")
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

  const handlePortalSelect = (href: string) => {
    void router.push(href)
  }

  return (
    <AuthShell
      eyebrow="Participant access"
      title="Sign in to your YLSH account"
      description="Access your events, attendance records, certificates, mentorship, and learning resources through a clean participant dashboard."
      footer={<p className="text-center text-muted-foreground">New here? <AuthLink href="/signup">Create an account</AuthLink></p>}
    >
      <AuthFormCard title="Welcome back" subtitle="Use your verified credentials to continue into your personal YLSH workspace.">

        {/* ── Step 1: Email + password form ── */}
        {step === "form" && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            <button type="button" className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                <path d="M47.532 24.552c0-1.636-.147-3.2-.42-4.704H24.48v8.896h12.96c-.56 3.008-2.24 5.552-4.768 7.264v6.032h7.712c4.512-4.16 7.148-10.288 7.148-17.488z" fill="#4285F4"/>
                <path d="M24.48 48c6.48 0 11.92-2.144 15.904-5.808l-7.712-6.032c-2.144 1.44-4.88 2.288-8.192 2.288-6.304 0-11.648-4.256-13.552-9.984H3.008v6.224C6.976 42.8 15.136 48 24.48 48z" fill="#34A853"/>
                <path d="M10.928 28.464A14.44 14.44 0 0 1 10.4 24c0-1.552.272-3.056.528-4.464V13.312H3.008A23.968 23.968 0 0 0 .48 24c0 3.872.928 7.52 2.528 10.688l7.92-6.224z" fill="#FBBC05"/>
                <path d="M24.48 9.552c3.552 0 6.736 1.216 9.248 3.616l6.912-6.912C36.4 2.368 30.96 0 24.48 0 15.136 0 6.976 5.2 3.008 13.312l7.92 6.224c1.904-5.728 7.248-9.984 13.552-9.984z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <div className="flex items-center gap-3"><hr className="flex-1 border-border" /><span className="text-xs text-muted-foreground">or sign in with email</span><hr className="flex-1 border-border" /></div>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-11 pl-9 pr-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-11 pl-9 pr-10 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none"><input type="checkbox" defaultChecked className="accent-primary" />Remember this device</label>
              <AuthLink href="#">Forgot password?</AuthLink>
            </div>
            <button type="submit" disabled={isLoading} className="w-full h-11 rounded-full bg-primary text-white font-semibold text-sm hover:bg-[#0d5c54] disabled:opacity-60 transition-colors">
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {/* ── Step 2: OTP verification (super-admin only) ── */}
        {step === "otp" && (
          <form onSubmit={handleOtpVerify} className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 text-center py-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(185,28,28,0.10)" }}>
                <KeyRound size={22} style={{ color: "#B91C1C" }} />
              </div>
              <div>
                <p className="font-bold text-base">Admin Verification Required</p>
                <p className="text-sm text-muted-foreground mt-0.5">A 6-digit security code was sent to your registered email. Enter it below to complete sign-in.</p>
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
            <button type="submit" disabled={isLoading || otp.length !== 6} className="w-full h-11 rounded-full text-white font-semibold text-sm disabled:opacity-60 transition-colors" style={{ backgroundColor: "#B91C1C" }}>
              {isLoading ? "Verifying..." : "Verify & Sign In"}
            </button>
            <button type="button" onClick={() => { setStep("form"); setOtp(""); setPreAuthToken("") }} className="text-center text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Back to sign in
            </button>
          </form>
        )}

        {/* ── Step 3: Portal selection ── */}
        {step === "portals" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">Signed in</span>
              <p className="text-sm text-muted-foreground">Choose a portal to enter</p>
            </div>
            <hr className="border-border mb-4" />
            <div className="flex flex-col gap-2">
              {portals
                .filter((p) => p.role === signedInRole || signedInRole === "super-admin")
                .map((portal) => (
                  <button key={portal.label} onClick={() => handlePortalSelect(ROLE_HREF[signedInRole] ?? portal.href)}
                    className="w-full flex items-center gap-4 p-3 rounded-xl border border-slate-200/22 text-left transition-all duration-150 hover:translate-x-1"
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = portal.color; (e.currentTarget as HTMLElement).style.backgroundColor = `${portal.color}0d` }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; (e.currentTarget as HTMLElement).style.backgroundColor = "" }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: portal.color }}>{portal.icon}</div>
                    <div className="flex-1 min-w-0"><p className="font-bold text-sm">{portal.label} Dashboard</p><p className="text-xs text-muted-foreground">{portal.description}</p></div>
                    <ArrowRight size={16} className="text-muted-foreground flex-shrink-0" />
                  </button>
                ))}
            </div>
            <hr className="border-border my-4" />
            <button onClick={() => setStep("form")} className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors">← Back to sign in</button>
          </div>
        )}

      </AuthFormCard>
    </AuthShell>
  )
}

export default SignInPage
