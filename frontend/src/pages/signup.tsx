import { useState, useRef, useEffect, Fragment } from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { toast } from "sonner"
import {
  Mail, Lock, User, BadgeCheck, Eye, EyeOff,
  ShieldCheck, ChevronDown, Check,
} from "lucide-react"
import AuthShell from "@/components/auth/auth-shell"
import AuthFormCard from "@/components/auth/auth-form-card"
import AuthLink from "@/components/auth/auth-link"
import { cn } from "@/utils"
import { useAuth, ROLE_REDIRECTS } from "@/contexts/AuthContext"
import { verifyNIN, register } from "@/services/endpoints/auth/auth"
import type { SignupRole } from "@/types"

const steps = ["Verify NIN", "Personal info", "Account details"]

const SignUpPage: NextPage = () => {
  const router = useRouter()
  const { setUser } = useAuth()
  const [activeStep, setActiveStep] = useState(0)
  const [isCreated, setIsCreated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [nin, setNin] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [organization, setOrganization] = useState("")

  const [role, setRole] = useState<SignupRole>("Participant")
  const [roleOpen, setRoleOpen] = useState(false)
  const roleRef = useRef<HTMLDivElement>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const roles: SignupRole[] = ["Participant", "Mentor"]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const isBusy = isCreated || isSubmitting

  const handleNext = async () => {
    if (isBusy) return
    setIsSubmitting(true)
    try {
      if (activeStep === 0) {
        if (!/^\d{11}$/.test(nin.trim())) { toast.error("NIN must be exactly 11 digits"); return }
        await verifyNIN(nin.trim())
        toast.success("NIN verified")
      }
      if (activeStep === 1) {
        if (!firstName || !lastName || !email) { toast.error("Please fill all required fields"); return }
      }
      setActiveStep((s) => Math.min(s + 1, steps.length - 1))
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Something went wrong"
      toast.error(msg)
    } finally { setIsSubmitting(false) }
  }

  const handleBack = () => { if (!isBusy) setActiveStep((s) => Math.max(s - 1, 0)) }

  const handleSubmit = async () => {
    if (activeStep !== steps.length - 1 || isBusy) return
    if (password !== confirmPassword) { toast.error("Passwords do not match"); return }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return }
    setIsSubmitting(true); setIsCreated(true)
    try {
      const { token, user } = await register({ firstName, lastName, email, phone, organization, nin, role: role.toLowerCase(), username, password })
      localStorage.setItem("token", token)
      setUser(user)
      toast.success("Account created! Redirecting...")
      if (user.role === "mentor" && user.approvalStatus !== "approved") {
        void router.push("/mentor/pending")
      } else {
        void router.push(ROLE_REDIRECTS[user.role] ?? "/dashboard")
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Registration failed"
      toast.error(msg); setIsCreated(false)
    } finally { setIsSubmitting(false) }
  }

  const INPUT = "w-full h-11 pl-9 pr-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-colors"
  const INPUT_PLAIN = "w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-colors"

  return (
    <AuthShell
      eyebrow="Create account"
      title="Join the YLSH platform"
      description="Complete onboarding in steps so identity verification happens first, then profile details, then your final account setup."
      footer={<p className="text-center text-muted-foreground">Already have an account? <AuthLink href="/signin">Sign in</AuthLink></p>}
    >
      <AuthFormCard title="Participant onboarding" subtitle="Step through identity verification, personal details, and account setup before creating your account.">
        <div className="relative flex flex-col gap-5">
          <button type="button" className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path d="M47.532 24.552c0-1.636-.147-3.2-.42-4.704H24.48v8.896h12.96c-.56 3.008-2.24 5.552-4.768 7.264v6.032h7.712c4.512-4.16 7.148-10.288 7.148-17.488z" fill="#4285F4"/>
              <path d="M24.48 48c6.48 0 11.92-2.144 15.904-5.808l-7.712-6.032c-2.144 1.44-4.88 2.288-8.192 2.288-6.304 0-11.648-4.256-13.552-9.984H3.008v6.224C6.976 42.8 15.136 48 24.48 48z" fill="#34A853"/>
              <path d="M10.928 28.464A14.44 14.44 0 0 1 10.4 24c0-1.552.272-3.056.528-4.464V13.312H3.008A23.968 23.968 0 0 0 .48 24c0 3.872.928 7.52 2.528 10.688l7.92-6.224z" fill="#FBBC05"/>
              <path d="M24.48 9.552c3.552 0 6.736 1.216 9.248 3.616l6.912-6.912C36.4 2.368 30.96 0 24.48 0 15.136 0 6.976 5.2 3.008 13.312l7.92 6.224c1.904-5.728 7.248-9.984 13.552-9.984z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>
          <div className="flex items-center gap-3"><hr className="flex-1 border-border" /><span className="text-xs text-muted-foreground">or create account with NIN</span><hr className="flex-1 border-border" /></div>
          {isCreated && (<div className="absolute inset-0 z-20 rounded-2xl bg-white/78 backdrop-blur-sm grid place-items-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>)}
          <div className="flex items-center mb-1">
            {steps.map((label, i) => (
              <Fragment key={label}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors", i < activeStep ? "bg-primary border-primary text-white" : i === activeStep ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground")}>{i < activeStep ? "✓" : i + 1}</div>
                  <p className={cn("text-[10px] font-medium mt-1 text-center max-w-[56px]", i === activeStep ? "text-primary" : "text-muted-foreground")}>{label}</p>
                </div>
                {i < steps.length - 1 && <div className={cn("flex-1 h-0.5 mx-2 mb-4 rounded-full", i < activeStep ? "bg-primary" : "bg-border")} />}
              </Fragment>
            ))}
          </div>

          {activeStep === 0 && (
            <div className="p-5 rounded-2xl bg-foreground/3 border border-slate-200/18 flex flex-col gap-4">
              <div><p className="font-bold mb-1">Step 1: Verify your NIN</p><p className="text-sm text-muted-foreground leading-relaxed">Start with identity verification. YLSH uses the NIN to support secure onboarding without storing raw sensitive values.</p></div>
              <div className="relative"><ShieldCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="text" placeholder="Enter your 11-digit NIN" value={nin} onChange={(e) => setNin(e.target.value.replace(/\D/g, "").slice(0, 11))} disabled={isBusy} maxLength={11} className={INPUT} /></div>
              <div className="flex gap-3 p-3 rounded-xl border border-primary/16 bg-primary/7"><ShieldCheck size={18} className="text-primary flex-shrink-0 mt-0.5" /><p className="text-sm text-muted-foreground leading-relaxed">Verify first so your event registrations, certificates, and attendance records remain tied to one authenticated identity.</p></div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="flex flex-col gap-4">
              <div><p className="font-bold mb-1">Step 2: Personal information</p><p className="text-sm text-muted-foreground leading-relaxed">Add the profile details needed for your participant dashboard and future event interactions.</p></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative"><User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={isBusy} className={INPUT} /></div>
                <div className="relative"><User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isBusy} className={INPUT} /></div>
              </div>
              <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isBusy} className={INPUT} /></div>
              <input type="tel" placeholder="+234 800 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isBusy} className={INPUT_PLAIN} />
              <input placeholder="Organization / school" value={organization} onChange={(e) => setOrganization(e.target.value)} disabled={isBusy} className={INPUT_PLAIN} />
            </div>
          )}

          {activeStep === 2 && (
            <div className="flex flex-col gap-4">
              <div><p className="font-bold mb-1">Step 3: Account details and review</p><p className="text-sm text-muted-foreground leading-relaxed">Finish by setting your role, password, and preferences.</p></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div ref={roleRef} className="relative">
                  <button type="button" disabled={isBusy} onClick={() => setRoleOpen((v) => !v)} className={cn("w-full h-11 px-4 rounded-xl border border-input bg-background text-sm text-left flex items-center justify-between gap-2 transition-colors disabled:opacity-50", roleOpen ? "border-primary ring-2 ring-primary/20" : "hover:border-slate-300")}>
                    <span className="font-medium">{role}</span><ChevronDown size={15} className={cn("text-muted-foreground transition-transform", roleOpen && "rotate-180")} />
                  </button>
                  {roleOpen && (
                    <div className="absolute z-30 top-[calc(100%+6px)] left-0 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                      {roles.map((r) => (<button key={r} type="button" onClick={() => { setRole(r); setRoleOpen(false) }} className={cn("w-full px-4 py-2.5 text-sm text-left flex items-center justify-between gap-2 transition-colors", r === role ? "bg-primary/8 text-primary font-semibold" : "hover:bg-slate-50 text-foreground")}>{r}{r === role && <Check size={14} className="text-primary" />}</button>))}
                    </div>
                  )}
                </div>
                <div className="relative"><BadgeCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input placeholder="@username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isBusy} className={INPUT} /></div>
              </div>
              {[
                { key: "pw", val: password, set: setPassword, show: showPassword, toggle: () => setShowPassword((v) => !v), placeholder: "Create a strong password" },
                { key: "cpw", val: confirmPassword, set: setConfirmPassword, show: showConfirmPassword, toggle: () => setShowConfirmPassword((v) => !v), placeholder: "Repeat your password" },
              ].map((f) => (
                <div key={f.key} className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type={f.show ? "text" : "password"} placeholder={f.placeholder} value={f.val} onChange={(e) => f.set(e.target.value)} disabled={isBusy} className="w-full h-11 pl-9 pr-10 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-colors" />
                  <button type="button" onClick={f.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">{f.show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              ))}
              <div className="p-4 rounded-2xl bg-foreground/3 border border-slate-200/20"><p className="font-bold mb-1.5">Final account creation</p><p className="text-sm text-muted-foreground leading-relaxed">The account is created only when you submit here.</p></div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-1">
            <button type="button" onClick={handleBack} disabled={isBusy || activeStep === 0} className="px-5 py-2.5 rounded-full border-2 border-slate-300 text-foreground font-semibold text-sm hover:bg-muted disabled:opacity-50 transition-colors">Back</button>
            {activeStep < steps.length - 1 ? (
              <button type="button" onClick={handleNext} disabled={isBusy} className="px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-[#0d5c54] disabled:opacity-50 transition-colors">{isSubmitting ? "Verifying..." : "Continue"}</button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={isBusy} className="px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-[#0d5c54] disabled:opacity-50 transition-colors">{isSubmitting ? "Creating..." : "Create Account"}</button>
            )}
          </div>
          {activeStep === steps.length - 1 && (<label className="flex items-start gap-2 text-sm cursor-pointer"><input type="checkbox" defaultChecked className="accent-primary mt-0.5" />I agree to the YLSH terms and data verification policy.</label>)}
        </div>
      </AuthFormCard>
    </AuthShell>
  )
}

export default SignUpPage
