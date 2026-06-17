import React, { FC } from 'react'
import Link from 'next/link'
import { FooterSectionTitle } from '@/components/footer'

const modulesMenu = [
  { label: 'Auth & Identity', path: '/signup' },
  { label: 'Events & Attendance', path: '/signup' },
  { label: 'Mentorship & Learning', path: '/signup' },
  { label: 'Analytics & Reporting', path: '/signup' },
]

const pageMenu = [
  { label: 'Home', path: '/' },
  { label: 'Platform', path: '/#popular-course' },
  { label: 'Capabilities', path: '/#testimonial' },
  { label: 'Teams', path: '/#mentors' },
]

const supportMenu = [
  { label: 'Contact Us', path: '/signup' },
  { label: 'Privacy & Policy', path: '#' },
  { label: 'Term & Condition', path: '#' },
  { label: 'FAQ', path: '#' },
]

interface NavigationItemProps {
  label: string
  path: string
}

const NavigationItem: FC<NavigationItemProps> = ({ label, path }) => (
  <Link href={path} className="block mb-2 text-white/90 hover:text-white transition-colors text-sm">
    {label}
  </Link>
)

const FooterNavigation: FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <FooterSectionTitle title="Modules" />
        {modulesMenu.map(({ label, path }) => (
          <NavigationItem key={label} label={label} path={path} />
        ))}
      </div>
      <div>
        <FooterSectionTitle title="Menu" />
        {pageMenu.map(({ label, path }) => (
          <NavigationItem key={label} label={label} path={path} />
        ))}
      </div>
      <div>
        <FooterSectionTitle title="Support" />
        {supportMenu.map(({ label, path }) => (
          <NavigationItem key={label} label={label} path={path} />
        ))}
      </div>
    </div>
  )
}

export default FooterNavigation
