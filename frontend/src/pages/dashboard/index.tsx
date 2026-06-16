import React from 'react'
import NextLink from 'next/link'
import {
  LayoutDashboard,
  CalendarCheck,
  Award,
  GraduationCap,
  Trophy,
  Users,
  ArrowRight,
  CheckCircle,
  Calendar,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'

const recentActivity = [
  { icon: <CheckCircle size={18} color="#127C71" />, label: 'Certificate issued for Youth Leadership Summit 2025', time: '2 days ago' },
  { icon: <CalendarCheck size={18} color="#3b82f6" />, label: 'Registered for Digital Skills Bootcamp', time: '4 days ago' },
  { icon: <GraduationCap size={18} color="#f59e0b" />, label: 'Completed "Public Speaking Mastery" module', time: '1 week ago' },
  { icon: <Users size={18} color="#8b5cf6" />, label: 'Booked mentorship session with Ngozi Adeyemi', time: '1 week ago' },
]

const quickActions = [
  { label: 'Browse Events', href: '/dashboard/events', icon: <CalendarCheck size={20} />, color: '#127C71' },
  { label: 'View Certificates', href: '/dashboard/certificates', icon: <Award size={20} />, color: '#f59e0b' },
  { label: 'Find a Mentor', href: '/dashboard/mentorship', icon: <Users size={20} />, color: '#8b5cf6' },
  { label: 'Opportunities', href: '/dashboard/opportunities', icon: <Trophy size={20} />, color: '#3b82f6' },
]

const upcomingEvents = [
  { title: 'Youth Leadership Summit 2026', date: 'Jul 15, 2026', venue: 'Transcorp Hilton, Abuja' },
  { title: 'Digital Skills Bootcamp', date: 'Jun 28, 2026', venue: 'Co-Creation Hub, Lagos' },
]

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const DashboardOverviewPage: NextPageWithLayout = () => {
  return (
    <div>
      <PageHeader
        eyebrow="Participant Dashboard"
        title="Welcome back, Amina!"
        subtitle="Track your events, certificates, learning progress, and opportunities — all in one place."
        icon={<LayoutDashboard size={14} />}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Events Registered" value="4" icon={<CalendarCheck size={20} />} progress={80} change="+1 this month" />
        <StatCard label="Certificates Earned" value="3" icon={<Award size={20} />} progress={60} change="1 pending" accent="#f59e0b" />
        <StatCard label="Learning Progress" value="68%" icon={<GraduationCap size={20} />} progress={68} change="5 modules done" accent="#8b5cf6" />
        <StatCard label="Applications" value="2" icon={<Trophy size={20} />} progress={40} change="1 under review" accent="#3b82f6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-5 mb-5">
        {/* Quick actions */}
        <div className={CARD} style={CARD_STYLE}>
          <h2 className="font-bold text-lg tracking-tight mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <NextLink key={a.label} href={a.href}>
                <div
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-[1.5px] border-slate-200/20 text-center transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                  style={{ '--action-color': a.color } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = a.color
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = `${a.color}0d`
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = ''
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = ''
                  }}
                >
                  <span style={{ color: a.color }}>{a.icon}</span>
                  <p className="text-xs font-semibold text-foreground">{a.label}</p>
                </div>
              </NextLink>
            ))}
          </div>
        </div>

        {/* Upcoming events */}
        <div className={CARD} style={CARD_STYLE}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg tracking-tight">Upcoming Events</h2>
            <NextLink href="/dashboard/events" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              View all <ArrowRight size={14} />
            </NextLink>
          </div>
          <div className="flex flex-col gap-3">
            {upcomingEvents.map((e) => (
              <div
                key={e.title}
                className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200/18 flex-wrap"
              >
                <div>
                  <p className="font-bold text-sm">{e.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Calendar size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{e.date}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{e.venue}</span>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(18,124,113,0.1)', color: '#127C71' }}>
                  Registered
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-5">
        {/* Profile completion */}
        <div className={CARD} style={CARD_STYLE}>
          <h2 className="font-bold text-lg tracking-tight mb-0.5">Profile Completion</h2>
          <p className="text-sm text-muted-foreground mb-4">A complete profile gets more visibility with mentors and event organisers.</p>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">72% complete</p>
              <NextLink href="/dashboard/profile" className="text-sm font-semibold text-primary hover:underline">
                Complete now →
              </NextLink>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(148,163,184,0.18)' }}>
              <div className="h-full rounded-full" style={{ width: '72%', background: 'linear-gradient(90deg, #127C71aa, #127C71)' }} />
            </div>
          </div>
          {['Add profile photo', 'Upload NIN for verification', 'Complete bio'].map((item) => (
            <div key={item} className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(148,163,184,0.5)' }} />
              <p className="text-sm text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div className={CARD} style={CARD_STYLE}>
          <h2 className="font-bold text-lg tracking-tight mb-4">Recent Activity</h2>
          <div>
            {recentActivity.map((a, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 py-3 ${i < recentActivity.length - 1 ? 'border-b border-slate-200/12' : ''}`}
              >
                <div className="mt-0.5 flex-shrink-0">{a.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug">{a.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

DashboardOverviewPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default DashboardOverviewPage
