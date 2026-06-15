import React, { ReactNode } from 'react'
import ArtTrackIcon from '@mui/icons-material/ArtTrack'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'
import ContactSupportIcon from '@mui/icons-material/ContactSupport'

interface Data {
  title: string
  description: string
  icon?: ReactNode
}

export const data: Data[] = [
  {
    title: 'Identity & Access',
    description: 'JWT auth, password reset, NIN verification, audit logs, and role-based access control.',
    icon: <ArtTrackIcon />,
  },
  {
    title: 'Events & Attendance',
    description: 'Event CRUD, registration, waitlists, QR attendance validation, and fraud prevention.',
    icon: <AttachMoneyIcon />,
  },
  {
    title: 'Learning & Mentorship',
    description: 'Resources, progress tracking, mentor matching, bookings, and reminders.',
    icon: <LocalLibraryIcon />,
  },
  {
    title: 'Certificates & Analytics',
    description: 'Async PDF certificates, QR verification links, reporting, and engagement metrics.',
    icon: <ContactSupportIcon />,
  },
]
