import React from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Clock, CheckCircle, XCircle, ArrowRight, LogOut, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const STATUS_CONFIG = {
  pending: {
    icon: <Clock size={40} style={{ color: '#F59E0B' }} />,
    badge: 'Under Review',
    badgeColor: 'bg-amber-100 text-amber-700',
    title: 'Application Under Review',
    message:
      'Your mentor application has been submitted successfully and is currently being reviewed by our team. This usually takes 2–5 business days.',
    sub: 'You\'ll receive an email notification once a decision has been made.',
  },
  approved: {
    icon: <CheckCircle size={40} style={{ color: '#22C55E' }} />,
    badge: 'Approved',
    badgeColor: 'bg-blue-100 text-[#082F49]',
    title: 'Application Approved!',
    message:
      'Congratulations! Your mentor application has been approved. You now have full access to your Mentor Portal.',
    sub: 'Click below to go to your dashboard.',
  },
  declined: {
    icon: <XCircle size={40} style={{ color: '#EF4444' }} />,
    badge: 'Not Approved',
    badgeColor: 'bg-red-100 text-red-700',
    title: 'Application Not Approved',
    message:
      'After careful review, we were unable to approve your mentor application at this time. Thank you for your interest in the programme.',
    sub: 'You\'re welcome to re-apply in a future cohort.',
  },
}

const steps = [
  { label: 'Application submitted', done: true },
  { label: 'Under team review', done: true },
  { label: 'Decision communicated', done: false },
  { label: 'Profile activated', done: false },
]

const MentorPendingPage: NextPage = () => {
  const { user, logout } = useAuth()
  const router = useRouter()

  const status = (user?.approvalStatus ?? 'pending') as 'pending' | 'approved' | 'declined'
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending
  const appliedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #f8fafc 60%, #eff6ff 100%)' }}>

      {/* Card */}
      <div className="w-full max-w-lg rounded-3xl border border-slate-200/60 shadow-xl p-8 md:p-10" style={{ backgroundColor: 'rgba(255,255,255,0.96)' }}>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: 'linear-gradient(135deg, #061e35, #082F49)' }}>Y</div>
          <span className="font-bold text-slate-800">YLSH Summit</span>
        </div>

        {/* Status icon + badge */}
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
            {cfg.icon}
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${cfg.badgeColor}`}>
            {cfg.badge}
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{cfg.title}</h1>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{cfg.message}</p>
            <p className="text-xs text-slate-400 mt-1">{cfg.sub}</p>
          </div>
        </div>

        {/* Application info */}
        <div className="rounded-2xl border border-slate-100 p-4 mb-6 flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Applicant</span>
            <span className="font-semibold">{user?.firstName} {user?.lastName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Email</span>
            <span className="font-mono text-xs">{user?.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Applied</span>
            <span>{appliedDate}</span>
          </div>
          {user?.approvalNote && (
            <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-100 flex gap-2">
              <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-700">{user.approvalNote}</p>
            </div>
          )}
        </div>

        {/* Timeline — only shown while pending */}
        {status === 'pending' && (
          <div className="mb-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Application Progress</p>
            <div className="flex flex-col gap-3">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? 'bg-primary' : 'border-2 border-slate-200'}`}>
                    {s.done && <CheckCircle size={12} className="text-white" />}
                  </div>
                  <span className={`text-sm ${s.done ? 'font-semibold text-slate-900' : 'text-muted-foreground'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action button */}
        {status === 'approved' ? (
          <button onClick={() => void router.push('/mentor')} className="w-full h-11 rounded-full bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#061e35] transition-colors">
            Go to Mentor Portal <ArrowRight size={16} />
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-center text-xs text-muted-foreground">You&apos;ll be notified by email when a decision is made.</p>
            <button onClick={() => void logout()} className="w-full h-10 rounded-full border border-slate-200 text-sm font-semibold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default MentorPendingPage
