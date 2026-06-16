import React, { FC } from 'react'
import Image from 'next/image'
import { Star, ArrowRight } from 'lucide-react'
import { data } from './popular-course.data'

const HomePopularCourse: FC = () => {
  return (
    <section id="popular-course" className="py-16 md:py-20" style={{ background: 'linear-gradient(180deg, #f3f6fb 0%, #ffffff 100%)' }}>
      <div className="container">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
              Platform Modules
            </span>
            <h2 className="text-[30px] md:text-[40px] font-bold text-[#082F49] leading-tight">
              Phase 1 — Core Services
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
            Seven modules covering the full lifecycle from identity to analytics.
          </p>
        </div>

        {/* Cards grid — no slider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {data.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl overflow-hidden bg-white border border-border hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
            >
              <div className="h-40 overflow-hidden">
                <Image
                  src={item.cover}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold mb-2 self-start">
                  {item.category}
                </span>
                <h3 className="font-semibold text-[0.9rem] text-[#082F49] leading-snug mb-3 flex-1">{item.title}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className={i < Math.round(item.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}
                      />
                    ))}
                    <span className="text-[11px] text-muted-foreground ml-1">({item.ratingCount})</span>
                  </div>
                  <span className="text-sm font-bold text-primary">Free</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors">
            View Full Roadmap
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default HomePopularCourse
