import React, { FC } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const badges = [
  'Event Management',
  'QR Attendance',
  'PDF Certificates',
  'Mentorship',
  'Analytics',
]

const HomeHero: FC = () => {
  return (
    <section id="hero" className="relative min-h-[60vh] flex flex-col justify-center overflow-hidden bg-black">

      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://res.cloudinary.com/duk9xwahb/video/upload/v1781685160/j0psnlm9e0jmxazrn0on.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 container py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" />
            Youth Platform · Free Access
          </div>

          <h1 className="text-[42px] sm:text-[58px] lg:text-[68px] font-extrabold tracking-tight leading-[1.08] mb-6 text-white">
            One platform for{' '}
            <span className="relative inline-block">
              youth programs
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 6 C60 2, 140 2, 298 6" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" fill="none"/>
              </svg>
            </span>
            {' '}and events
          </h1>

          <p className="text-[17px] text-white/85 leading-relaxed mb-8 max-w-xl mx-auto">
            YLSH unifies identity verification, event management, attendance, certificates,
            mentorship, and analytics — all in one place, completely free.
          </p>

          {/* Feature badge pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {badges.map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-sm font-medium">
                <CheckCircle2 size={13} className="text-white/80" />
                {b}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <Link href="/signup">
              <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#082F49] font-bold text-[15px] shadow-lg hover:bg-white/90 transition-colors">
                Get Started Free
                <ArrowRight size={17} />
              </button>
            </Link>
            <Link href="/signin">
              <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/60 text-white font-bold text-[15px] hover:bg-white/10 transition-colors">
                Sign In
              </button>
            </Link>
          </div>

        </div>
      </div>

    </section>
  )
}

export default HomeHero
