import React, { FC } from 'react'
import { FooterNavigation, FooterSocialLinks } from '@/components/footer'

const Footer: FC = () => {
  return (
    <footer className="bg-[#127C71] py-12 md:py-16 text-white">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-10">
          <div className="w-full md:w-[360px]">
            <h2 className="text-3xl font-bold mb-3">YLSH</h2>
            <p className="text-white/80 leading-relaxed tracking-wide text-sm mb-4">
              Young Leaders Summit Hub is a youth ecosystem and event operating system for identity,
              participation, certification, mentorship, learning, opportunities, and analytics.
            </p>
            <FooterSocialLinks />
          </div>
          <div>
            <FooterNavigation />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
