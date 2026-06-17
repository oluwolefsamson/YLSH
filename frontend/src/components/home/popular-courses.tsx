import React, { FC } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  CalendarCheck,
  QrCode,
  Award,
  Briefcase,
  Users,
  BarChart3,
  GraduationCap,
  ArrowRight,
} from 'lucide-react'

const modules = [
  {
    icon: <ShieldCheck size={24} />,
    title: 'Identity & Access',
    description: 'NIN-based identity verification with role-based access control — Participant, Mentor, Admin, and Super Admin.',
    phase: 'Phase 1',
    phaseColor: 'bg-primary/10 text-primary',
  },
  {
    icon: <CalendarCheck size={24} />,
    title: 'Event Management',
    description: 'Create and manage events, handle registrations, set capacity limits, and track participation in real time.',
    phase: 'Phase 1',
    phaseColor: 'bg-primary/10 text-primary',
  },
  {
    icon: <QrCode size={24} />,
    title: 'QR Attendance',
    description: 'Generate unique QR codes per registrant, scan for check-in at the venue, and detect duplicate or fraudulent scans.',
    phase: 'Phase 1',
    phaseColor: 'bg-primary/10 text-primary',
  },
  {
    icon: <Award size={24} />,
    title: 'Certificate Engine',
    description: 'Auto-generate PDF certificates after events conclude. Every certificate carries a unique QR code for instant verification.',
    phase: 'Phase 1',
    phaseColor: 'bg-primary/10 text-primary',
  },
  {
    icon: <Briefcase size={24} />,
    title: 'Opportunities',
    description: 'Curated jobs, internships, grants, and scholarships for young Nigerians — with one-click applications and status tracking.',
    phase: 'Phase 2',
    phaseColor: 'bg-amber-100 text-amber-700',
  },
  {
    icon: <Users size={24} />,
    title: 'Mentorship',
    description: 'Discover mentors by expertise, book one-on-one sessions, set availability, and track completed sessions.',
    phase: 'Phase 2',
    phaseColor: 'bg-amber-100 text-amber-700',
  },
  {
    icon: <GraduationCap size={24} />,
    title: 'Learning Hub',
    description: 'Access curated videos, PDFs, and articles. Track progress across all resources and pick up where you left off.',
    phase: 'Phase 2',
    phaseColor: 'bg-amber-100 text-amber-700',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Analytics',
    description: 'Real-time dashboards covering registrations, attendance, certificate issuance, mentorship activity, and growth trends.',
    phase: 'Phase 3',
    phaseColor: 'bg-purple-100 text-purple-700',
  },
]

const HomePopularCourse: FC = () => {
  return (
    <section id="popular-course" className="py-16 md:py-24 bg-[#127C71]">
      <div className="container">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-sm font-semibold mb-4">
            Platform Modules
          </span>
          <h2 className="text-[30px] md:text-[44px] font-bold text-white leading-tight mb-4">
            Everything YLSH does
          </h2>
          <p className="text-white/85 max-w-xl mx-auto text-[15px] leading-relaxed">
            Eight interconnected modules covering the full lifecycle — from identity to analytics.
            All free, all in one place.
          </p>
        </div>

        {/* Modules grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map((mod) => (
            <div
              key={mod.title}
              className="group flex flex-col p-6 rounded-2xl border border-border bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #082F49 0%, #127C71 100%)' }}
              >
                {mod.icon}
              </div>

              {/* Phase badge */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold w-fit mb-3 ${mod.phaseColor}`}>
                {mod.phase}
              </span>

              <h3 className="font-bold text-[#082F49] text-[1rem] mb-2">{mod.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{mod.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link href="/signup" className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] transition-colors shadow-md">
            Get started — it&apos;s free
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  )
}

export default HomePopularCourse
