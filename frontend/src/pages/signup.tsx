import { useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import {
  Mail,
  Lock,
  User,
  BadgeCheck,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react'
import AuthShell from '@/components/auth/auth-shell'
import AuthFormCard from '@/components/auth/auth-form-card'
import AuthLink from '@/components/auth/auth-link'
import { cn } from '@/utils'

const steps = ['Verify NIN', 'Personal information', 'Account details']

const SignUpPage: NextPage = () => {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [isCreated, setIsCreated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const isBusy = isCreated || isSubmitting

  const handleNext = (): void => {
    if (!isBusy) setActiveStep((step) => Math.min(step + 1, steps.length - 1))
  }
  const handleBack = (): void => {
    if (!isBusy) setActiveStep((step) => Math.max(step - 1, 0))
  }
  const handleSubmit = async (): Promise<void> => {
    if (activeStep !== 2 || isBusy) return
    setIsSubmitting(true)
    setIsCreated(true)
    await new Promise((resolve) => window.setTimeout(resolve, 1200))
    await router.push('/dashboard')
  }

  return (
    <AuthShell
      eyebrow="Create account"
      title="Join the YLSH platform"
      description="Complete onboarding in steps so identity verification happens first, then profile details, then your final account setup."
      footer={
        <p className="text-center text-muted-foreground">
          Already have an account? <AuthLink href="/signin">Sign in</AuthLink>
        </p>
      }
    >
      <AuthFormCard
        title="Participant onboarding"
        subtitle="Step through identity verification, personal details, and account setup before creating your account."
      >
        <div className="relative flex flex-col gap-5">
          {/* Google sign-up */}
          <button
            type="button"
            className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path d="M47.532 24.552c0-1.636-.147-3.2-.42-4.704H24.48v8.896h12.96c-.56 3.008-2.24 5.552-4.768 7.264v6.032h7.712c4.512-4.16 7.148-10.288 7.148-17.488z" fill="#4285F4"/>
              <path d="M24.48 48c6.48 0 11.92-2.144 15.904-5.808l-7.712-6.032c-2.144 1.44-4.88 2.288-8.192 2.288-6.304 0-11.648-4.256-13.552-9.984H3.008v6.224C6.976 42.8 15.136 48 24.48 48z" fill="#34A853"/>
              <path d="M10.928 28.464A14.44 14.44 0 0 1 10.4 24c0-1.552.272-3.056.528-4.464V13.312H3.008A23.968 23.968 0 0 0 .48 24c0 3.872.928 7.52 2.528 10.688l7.92-6.224z" fill="#FBBC05"/>
              <path d="M24.48 9.552c3.552 0 6.736 1.216 9.248 3.616l6.912-6.912C36.4 2.368 30.96 0 24.48 0 15.136 0 6.976 5.2 3.008 13.312l7.92 6.224c1.904-5.728 7.248-9.984 13.552-9.984z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <div className="flex items-center gap-3">
            <hr className="flex-1 border-border" />
            <span className="text-xs text-muted-foreground">or create account with NIN</span>
            <hr className="flex-1 border-border" />
          </div>

          {isCreated && (
            <div className="absolute inset-0 z-20 rounded-2xl bg-white/78 backdrop-blur-sm grid place-items-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Step indicator */}
          <div className="flex items-center justify-between mb-1">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors',
                      i < activeStep
                        ? 'bg-primary border-primary text-white'
                        : i === activeStep
                        ? 'border-primary text-primary bg-primary/10'
                        : 'border-border text-muted-foreground'
                    )}
                  >
                    {i < activeStep ? '✓' : i + 1}
                  </div>
                  <p className={cn('text-[10px] font-medium mt-1 text-center max-w-[70px]', i === activeStep ? 'text-primary' : 'text-muted-foreground')}>
                    {label}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className={cn('flex-1 h-0.5 mx-1 mb-4 rounded-full', i < activeStep ? 'bg-primary' : 'bg-border')} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: NIN */}
          {activeStep === 0 && (
            <div className="p-5 rounded-2xl bg-foreground/3 border border-slate-200/18 flex flex-col gap-4">
              <div>
                <p className="font-bold mb-1">Step 1: Verify your NIN</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Start with identity verification. YLSH uses the NIN to support secure onboarding without storing raw sensitive values.
                </p>
              </div>
              <div className="relative">
                <ShieldCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter your 11-digit NIN"
                  disabled={isBusy}
                  className="w-full h-11 pl-9 pr-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-colors"
                />
              </div>
              <div className="flex gap-3 p-3 rounded-xl border border-primary/16 bg-primary/7">
                <ShieldCheck size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Verify first so your event registrations, certificates, and attendance records remain tied to one authenticated identity.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Personal info */}
          {activeStep === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-bold mb-1">Step 2: Personal information</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Add the profile details needed for your participant dashboard and future event interactions.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[{ placeholder: 'First name', label: 'Amina' }, { placeholder: 'Last name', label: 'Bello' }].map((f) => (
                  <div key={f.placeholder} className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input placeholder={f.label} disabled={isBusy} className="w-full h-11 pl-9 pr-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-colors" />
                  </div>
                ))}
              </div>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="email" placeholder="you@example.com" disabled={isBusy} className="w-full h-11 pl-9 pr-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-colors" />
              </div>
              <input type="tel" placeholder="+234 800 000 0000" disabled={isBusy} className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-colors" />
              <input placeholder="Organization / school" disabled={isBusy} className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-colors" />
            </div>
          )}

          {/* Step 3: Account details */}
          {activeStep === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-bold mb-1">Step 3: Account details and review</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Finish by setting your role, password, and preferences.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select disabled={isBusy} className="h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-colors">
                  <option value="participant">Participant</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="relative">
                  <BadgeCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input placeholder="@aminab" disabled={isBusy} className="w-full h-11 pl-9 pr-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-colors" />
                </div>
              </div>
              {[
                { key: 'pw', show: showPassword, toggle: () => setShowPassword(v => !v), placeholder: 'Create a strong password' },
                { key: 'cpw', show: showConfirmPassword, toggle: () => setShowConfirmPassword(v => !v), placeholder: 'Repeat your password' },
              ].map((f) => (
                <div key={f.key} className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type={f.show ? 'text' : 'password'} placeholder={f.placeholder} disabled={isBusy} className="w-full h-11 pl-9 pr-10 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-colors" />
                  <button type="button" onClick={f.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {f.show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              ))}
              <div className="p-4 rounded-2xl bg-foreground/3 border border-slate-200/20">
                <p className="font-bold mb-1.5">Final account creation</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Use this step to review your details. The account is created only when you submit here, not on the earlier steps.
                </p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button type="button" onClick={handleBack} disabled={isBusy} className="px-5 py-2.5 rounded-full border-2 border-slate-300 text-foreground font-semibold text-sm hover:bg-muted disabled:opacity-50 transition-colors">
              Back
            </button>
            {activeStep < steps.length - 1 ? (
              <button type="button" onClick={handleNext} disabled={isBusy} className="px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-[#0d5c54] disabled:opacity-50 transition-colors">
                Continue
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={isBusy} className="px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-[#0d5c54] disabled:opacity-50 transition-colors">
                {isSubmitting ? 'Creating...' : 'Create Account'}
              </button>
            )}
          </div>

          {activeStep === 2 && (
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-primary mt-0.5" />
              I agree to the YLSH terms and data verification policy.
            </label>
          )}

        </div>
      </AuthFormCard>
    </AuthShell>
  )
}

export default SignUpPage
