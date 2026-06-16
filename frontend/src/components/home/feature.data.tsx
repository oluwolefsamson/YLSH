import React, { ReactNode } from 'react'
import { ShieldCheck, CalendarCheck, BookOpen, Award } from 'lucide-react'

interface Data {
  title: string
  description: string
  icon?: ReactNode
}

export const data: Data[] = [
  {
    title: 'Identity & Access',
    description: 'JWT auth, password reset, NIN verification, audit logs, and role-based access control.',
    icon: <ShieldCheck size={24} />,
  },
  {
    title: 'Events & Attendance',
    description: 'Event CRUD, registration, waitlists, QR attendance validation, and fraud prevention.',
    icon: <CalendarCheck size={24} />,
  },
  {
    title: 'Learning & Mentorship',
    description: 'Resources, progress tracking, mentor matching, bookings, and reminders.',
    icon: <BookOpen size={24} />,
  },
  {
    title: 'Certificates & Analytics',
    description: 'Async PDF certificates, QR verification links, reporting, and engagement metrics.',
    icon: <Award size={24} />,
  },
]
