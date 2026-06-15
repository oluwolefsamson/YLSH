import type { Mentor } from '@/interfaces/mentor'

export const data: Array<Mentor> = [
  {
    id: 1,
    photo: '/images/mentors/christian-buehner-DItYlc26zVI-unsplash.jpg',
    name: 'Identity Team',
    category: 'Auth & RBAC',
    description: 'Owns registration, login, refresh tokens, password reset, NIN verification, and audit logging.',
    company: {
      name: 'Core Service',
      logo: '/images/companies/grab.png',
    },
  },
  {
    id: 2,
    photo: '/images/mentors/jonas-kakaroto-KIPqvvTOC1s-unsplash.jpg',
    name: 'Events Team',
    category: 'Events & Attendance',
    description: 'Manages event CRUD, sessions, speakers, venues, registrations, waiting lists, and QR attendance.',
    company: {
      name: 'Platform Ops',
      logo: '/images/companies/google.png',
    },
  },
  {
    id: 3,
    photo: '/images/mentors/noah-buscher-8A7fD6Y5VF8-unsplash.jpg',
    name: 'Growth Team',
    category: 'Learning & Opportunities',
    description: 'Curates courses, resources, mentorship, jobs, internships, grants, and scholarships.',
    company: {
      name: 'Community',
      logo: '/images/companies/airbnb.png',
    },
  },
  {
    id: 4,
    photo: '/images/mentors/philip-martin-5aGUyCW_PJw-unsplash.jpg',
    name: 'Analytics Team',
    category: 'Reporting & Scale',
    description: 'Tracks verification, attendance, certificates, engagement, and deployment readiness.',
    company: {
      name: 'Insights',
      logo: '/images/companies/microsoft.png',
    },
  },
]
