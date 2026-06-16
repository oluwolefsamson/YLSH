import React, { FC } from 'react'
import Link from 'next/link'
import type { Navigation } from '@/interfaces/navigation'
import { navigations as headerNavigations } from '@/components/navigation/navigation.data'
import { FooterSectionTitle } from '@/components/footer'

const courseMenu: Array<Navigation> = [
  { label: 'Auth & Identity', path: '#' },
  { label: 'Events & Attendance', path: '#' },
  { label: 'Mentorship & Learning', path: '#' },
  { label: 'Analytics & Reporting', path: '#' },
]

const pageMenu = headerNavigations

const companyMenu: Array<Navigation> = [
  { label: 'Contact Us', path: '#' },
  { label: 'Privacy & Policy', path: '#' },
  { label: 'Term & Condition', path: '#' },
  { label: 'FAQ', path: '#' },
]

interface NavigationItemProps {
  label: string
  path: string
}

const NavigationItem: FC<NavigationItemProps> = ({ label, path }) => {
  return (
    <Link href={path} className="block mb-2 text-white/80 hover:text-white transition-colors text-sm">
      {label}
    </Link>
  )
}

const FooterNavigation: FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <FooterSectionTitle title="Modules" />
        {courseMenu.map(({ label, path }, index) => (
          <NavigationItem key={index + path} label={label} path="#" />
        ))}
      </div>
      <div>
        <FooterSectionTitle title="Menu" />
        {pageMenu.map(({ label, path }, index) => (
          <NavigationItem key={index + path} label={label} path={path} />
        ))}
      </div>
      <div>
        <FooterSectionTitle title="Support" />
        {companyMenu.map(({ label, path }, index) => (
          <NavigationItem key={index + path} label={label} path={path} />
        ))}
      </div>
    </div>
  )
}

export default FooterNavigation
