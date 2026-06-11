import type { Testimonial } from '@/interfaces/testimonial'

export const data: Array<Testimonial> = [
  {
    id: 1,
    title: 'Centralized operational control',
    content:
      'The platform gives us one place to handle identity verification, events, attendance, certificates, and audit trails without moving between tools.',
    user: {
      id: 1,
      name: 'Program Admin',
      professional: 'Operations Team',
      photo: '1.jpg',
    },
  },
  {
    id: 2,
    title: 'Cleaner participant experience',
    content:
      'Participants can register, check in, access resources, and download verified certificates from a single workflow.',
    user: {
      id: 1,
      name: 'Participant',
      professional: 'Youth Member',
      photo: '2.jpg',
    },
  },
  {
    id: 3,
    title: 'Scalable architecture',
    content:
      'The PRD clearly separates frontend, services, queues, cache, and storage, which makes the system ready for growth and automation.',
    user: {
      id: 1,
      name: 'Engineering Lead',
      professional: 'Technical Team',
      photo: '3.jpg',
    },
  },
  {
    id: 4,
    title: 'Built for trust',
    content:
      'RBAC, audit logs, secure verification, and async certificate generation make the platform suitable for enterprise operations.',
    user: {
      id: 1,
      name: 'Security Reviewer',
      professional: 'Compliance Team',
      photo: '4.jpg',
    },
  },
  {
    id: 5,
    title: 'A practical phase roadmap',
    content:
      'The MVP roadmap is clear: auth and users first, then opportunities, mentorship, learning, and analytics.',
    user: {
      id: 1,
      name: 'Project Sponsor',
      professional: 'Leadership Team',
      photo: '5.jpg',
    },
  },
]
