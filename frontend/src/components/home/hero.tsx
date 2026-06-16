import React, { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const stats = [
  { value: 'NIN', label: 'Identity Verification' },
  { value: '7+', label: 'Platform Modules' },
  { value: 'RBAC', label: 'Role-Based Access' },
  { value: 'Free', label: 'No Paywall Ever' },
]

const badges = [
  'Event Management',
  'QR Attendance',
  'PDF Certificates',
  'Mentorship',
  'Analytics',
]

const HomeHero: FC = () => {
  return (
    <section id="hero" className="pt-10 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 xl:gap-16 items-center">

          {/* ── Left: text ── */}
          <div className="text-center lg:text-left">

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
              Youth Platform · Free Access
            </div>

            <h1 className="text-[40px] sm:text-[54px] lg:text-[62px] font-extrabold tracking-tight leading-[1.1] mb-5 text-[#082F49]">
              One platform for{' '}
              <span className="text-primary relative">
                youth programs
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M2 6 C60 2, 140 2, 298 6" stroke="#127C71" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5"/>
                </svg>
              </span>
              {' '}and events
            </h1>

            <p className="text-[17px] text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              YLSH unifies identity verification, event management, attendance, certificates,
              mentorship, and analytics — all in one place, completely free.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
              <Link href="/signup">
                <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white font-bold text-[15px] shadow-[0_8px_24px_0_rgba(18,124,113,0.28)] hover:bg-[#0d5c54] transition-colors">
                  Get Started Free
                  <ArrowRight size={17} />
                </button>
              </Link>
              <Link href="/signin">
                <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-primary text-primary font-bold text-[15px] hover:bg-primary/8 transition-colors">
                  Sign In
                </button>
              </Link>
            </div>

            {/* Feature badge pills */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-10">
              {badges.map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-border text-sm text-muted-foreground shadow-sm">
                  <CheckCircle2 size={13} className="text-primary" />
                  {b}
                </span>
              ))}
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.value} className="rounded-2xl bg-white border border-border p-4 text-center shadow-sm">
                  <p className="text-[22px] font-extrabold text-[#082F49] leading-none mb-1">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: image card ── */}
          <div className="hidden lg:block relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60 ring-1 ring-black/5">
              <Image
                src="/images/home-hero.png"
                alt="YLSH Platform preview"
                width={960}
                height={720}
                quality={95}
                priority
                className="w-full h-auto block"
              />
            </div>

            {/* Floating cert badge */}
            <div className="absolute -bottom-4 -left-8 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl border border-slate-100">
              <Image src="/images/certificate.png" alt="Certificate" width={36} height={36} />
              <div>
                <p className="text-sm font-bold text-[#082F49] leading-none mb-0.5">PDF Certificates</p>
                <p className="text-xs text-muted-foreground">QR-verified instantly</p>
              </div>
            </div>

            {/* Floating user count badge */}
            <div className="absolute -top-4 -right-6 flex items-center gap-2 rounded-2xl bg-[#082F49] px-4 py-2.5 shadow-xl">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((n) => (
                  <Image
                    key={n}
                    src={`/images/avatars/${n}.jpg`}
                    alt=""
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full border-2 border-[#082F49] object-cover"
                  />
                ))}
              </div>
              <p className="text-white text-xs font-semibold">1k+ members</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHero
