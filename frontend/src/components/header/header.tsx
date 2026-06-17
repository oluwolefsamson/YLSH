import React, { FC, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Navigation, AuthNavigation } from '@/components/navigation'

const Header: FC = () => {
  const [visibleMenu, setVisibleMenu] = useState(false)

  return (
    <div className="sticky top-0 z-50 border-b border-slate-200/18" style={{ backgroundColor: 'rgba(255,255,255,0.84)', backdropFilter: 'blur(18px)' }}>
      <div className="container py-4 md:py-5">
        <div className="flex items-center justify-between">
          <Logo />

          {/* Mobile toggle */}
          <button
            className="md:hidden ml-auto p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setVisibleMenu(!visibleMenu)}
            aria-label="Toggle menu"
          >
            {visibleMenu ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center justify-between w-full ml-4">
            <div />
            <Navigation />
            <AuthNavigation />
          </div>
        </div>
      </div>

      {/* Mobile overlay menu */}
      {visibleMenu && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.96)' }}
        >
          <button
            className="absolute top-3 right-3 p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setVisibleMenu(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
          <Navigation onSelect={() => setVisibleMenu(false)} />
          <div className="mt-8">
            <AuthNavigation />
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
