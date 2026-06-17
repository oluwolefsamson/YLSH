import React, { FC, useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link as ScrollLink } from 'react-scroll'
import NextLink from 'next/link'
import { Logo } from '@/components/logo'
import { Navigation, AuthNavigation } from '@/components/navigation'
import { navigations } from '@/components/navigation/navigation.data'

const Header: FC = () => {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  // Close on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      <div
        className="sticky top-0 z-50 border-b border-slate-200/20"
        style={{ backgroundColor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(18px)' }}
      >
        <div className="container py-4 md:py-5">
          <div className="flex items-center justify-between">
            <Logo />

            {/* Mobile toggle */}
            <button
              className="md:hidden ml-auto p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center justify-between w-full ml-4">
              <div />
              <Navigation />
              <AuthNavigation />
            </div>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-250 ease-in-out ${
            open ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="border-t border-slate-100">
            {/* Nav links */}
            <nav className="flex flex-col px-4 pt-2 pb-1">
              {navigations.map(({ path: destination, label }) => (
                <ScrollLink
                  key={destination}
                  to={destination}
                  spy={true}
                  smooth={true}
                  duration={350}
                  onClick={close}
                  className="flex items-center px-4 py-3.5 text-[15px] font-semibold text-slate-700 hover:text-primary hover:bg-slate-50 rounded-lg cursor-pointer transition-colors select-none"
                >
                  {label}
                </ScrollLink>
              ))}
            </nav>

            {/* Divider */}
            <div className="mx-8 border-t border-slate-100" />

            {/* Auth buttons */}
            <div className="flex flex-col gap-2.5 px-8 py-5">
              <NextLink
                href="/signin"
                onClick={close}
                className="flex items-center justify-center py-2.5 border-2 border-primary text-primary font-semibold text-sm tracking-wide hover:bg-primary/10 transition-colors rounded-sm"
              >
                Sign In
              </NextLink>
              <NextLink
                href="/signup"
                onClick={close}
                className="flex items-center justify-center py-2.5 bg-primary text-white font-semibold text-sm tracking-wide hover:bg-[#0d5c54] transition-colors rounded-sm shadow-sm"
              >
                Sign Up
              </NextLink>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop — closes menu when tapping outside */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default Header
