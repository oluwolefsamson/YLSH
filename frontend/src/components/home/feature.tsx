import React, { FC } from 'react'
import Image from 'next/image'
import { data } from './feature.data'

const HomeFeature: FC = () => {
  return (
    <section id="feature" className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Image column */}
          <div className="relative order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60">
              <Image
                src="/images/home-feature.png"
                alt="YLSH platform features"
                width={650}
                height={500}
                quality={95}
                className="w-full h-auto block"
              />
            </div>
            {/* Floating readiness card */}
            <div className="absolute -top-6 -right-4 md:right-4 rounded-2xl bg-white shadow-xl border border-slate-100 px-5 py-4 w-[210px]">
              <p className="text-sm font-bold text-[#082F49] mb-3">Platform Readiness</p>
              {[
                { label: 'Auth & Identity', pct: 65, color: '#127C71' },
                { label: 'Event Engine', pct: 50, color: '#082F49' },
                { label: 'Certificates', pct: 40, color: '#0891b2' },
              ].map((bar) => (
                <div key={bar.label} className="mb-2.5">
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] text-muted-foreground">{bar.label}</span>
                    <span className="text-[11px] font-semibold" style={{ color: bar.color }}>{bar.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${bar.pct}%`, backgroundColor: bar.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content column */}
          <div className="order-1 lg:order-2">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              Platform Features
            </span>
            <h2 className="text-[30px] md:text-[44px] font-bold text-[#082F49] leading-tight mb-4">
              Everything your youth program needs
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              YLSH is structured around clearly defined PRD modules: identity, users, events,
              attendance, certificates, opportunities, mentorship, learning, and analytics.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.map(({ title, description, icon }, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-slate-50/70 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#082F49] text-sm mb-1">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-snug">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HomeFeature
