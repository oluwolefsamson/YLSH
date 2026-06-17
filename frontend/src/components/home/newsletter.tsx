import React, { FC } from 'react'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Zap, Users, Award } from 'lucide-react'

const perks = [
  { icon: <ShieldCheck size={15} />, text: 'NIN Identity Verification' },
  { icon: <Zap size={15} />, text: 'Real-time Attendance' },
  { icon: <Award size={15} />, text: 'PDF Certificates' },
  { icon: <Users size={15} />, text: 'Mentorship Matching' },
]

const HomeNewsLetter: FC = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container">
        <div
          className="rounded-3xl py-14 px-8 md:px-16"
          style={{
            background: 'linear-gradient(135deg, #082F49 0%, #0d5c54 50%, #127C71 100%)',
            boxShadow: '0 30px 70px rgba(18,124,113,0.22)',
          }}
        >
          <div className="max-w-3xl mx-auto text-center">

            <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-semibold mb-5">
              Free Access · No Paywall
            </span>

            <h2 className="text-[32px] md:text-[50px] font-extrabold text-white mb-4 leading-tight">
              Join YLSH today —<br className="hidden sm:block" /> it&apos;s completely free
            </h2>

            <p className="text-white/90 mb-10 text-lg max-w-xl mx-auto leading-relaxed">
              Manage events, verify identities, issue certificates, and grow your community.
              Every module, zero cost.
            </p>

            {/* Perk chips */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {perks.map((p, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/12 text-white text-sm font-medium">
                  <span className="opacity-75">{p.icon}</span>
                  {p.text}
                </div>
              ))}
            </div>

            {/* Email capture + CTA */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 h-12 px-5 rounded-full bg-white text-foreground placeholder:text-muted-foreground outline-none border-0 text-sm shadow-inner"
              />
              <button className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full bg-primary text-white font-bold text-sm tracking-wide hover:bg-[#0d5c54] transition-colors shadow-lg whitespace-nowrap">
                Join Free
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-6">
              <Link href="/signup">
                <button className="text-white/90 text-sm hover:text-white underline underline-offset-2 transition-colors">
                  Create account →
                </button>
              </Link>
              <Link href="/signin">
                <button className="text-white/90 text-sm hover:text-white underline underline-offset-2 transition-colors">
                  Already have one? Sign in
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeNewsLetter
