import React, { FC } from 'react'
import Image from 'next/image'

const partners = [
  { name: 'Google', logo: '/images/companies/google.png' },
  { name: 'Microsoft', logo: '/images/companies/microsoft.png' },
  { name: 'Airbnb', logo: '/images/companies/airbnb.png' },
  { name: 'Grab', logo: '/images/companies/grab.png' },
]

const stats = [
  { value: '10,000+', label: 'Youth reached' },
  { value: '50+', label: 'Partner organisations' },
  { value: '30+', label: 'States covered' },
  { value: '95%', label: 'Satisfaction rate' },
]

const HomePartners: FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">

        {/* Impact stats */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Our Impact
          </span>
          <h2 className="text-[30px] md:text-[44px] font-bold text-[#082F49] leading-tight mb-4">
            Trusted across Nigeria
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-[15px] leading-relaxed">
            From Abuja to Lagos, YLSH powers youth programs, events, and communities across the country.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((s) => (
            <div key={s.label} className="text-center p-6 rounded-2xl border border-border">
              <p className="text-[32px] md:text-[40px] font-extrabold text-primary leading-none mb-2">{s.value}</p>
              <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Backed & supported by</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {partners.map((p) => (
            <div key={p.name} className="flex items-center justify-center">
              <Image
                src={p.logo}
                alt={p.name}
                width={120}
                height={40}
                className="h-8 w-auto object-contain opacity-50 hover:opacity-80 transition-opacity grayscale hover:grayscale-0"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default HomePartners
