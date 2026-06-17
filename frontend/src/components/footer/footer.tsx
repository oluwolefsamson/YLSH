import React, { FC } from 'react'
import { FooterNavigation, FooterSocialLinks } from '@/components/footer'

const Footer: FC = () => {
  return (
    <footer className="bg-[#127C71] py-12 md:py-16 text-white">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-10 mb-10">
          <div className="w-full md:w-[360px]">
            <h2 className="text-3xl font-bold mb-3">YLSH</h2>
            <p className="text-white/90 leading-relaxed tracking-wide text-sm mb-4">
              Young Leaders Summit Hub is a youth ecosystem and event operating system for identity,
              participation, certification, mentorship, learning, opportunities, and analytics.
            </p>
            <FooterSocialLinks />
          </div>
          <div>
            <FooterNavigation />
          </div>
        </div>
        <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Young Leaders Summit Hub. All rights reserved.</p>
          <p>Designed by <span className="text-white font-semibold">Olstech Solution</span></p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
