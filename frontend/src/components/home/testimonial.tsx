import React, { FC } from 'react'
import Image from 'next/image'
import { Quote } from 'lucide-react'
import { data } from './testimonial.data'

const HomeTestimonial: FC = () => {
  return (
    <section id="testimonial" className="py-16 md:py-20 bg-[#082F49]">
      <div className="container">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-sm font-semibold mb-3">
            Testimonials
          </span>
          <h2 className="text-[30px] md:text-[40px] font-bold text-white">What the team says</h2>
          <p className="text-white/85 mt-2 max-w-md mx-auto text-sm">
            Feedback from across the program — admins, participants, engineers, and leadership.
          </p>
        </div>

        {/* 3-column grid — no slider */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex flex-col bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
            >
              <Quote size={28} className="text-primary/25 mb-4 flex-shrink-0" />
              <h3 className="font-bold text-[#082F49] mb-2 text-[1rem]">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">{item.content}</p>
              <div className="flex items-center gap-3 pt-5 mt-5 border-t border-border">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={`/images/avatars/${item.user.photo}`}
                    alt={item.user.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#082F49] leading-none mb-0.5">{item.user.name}</p>
                  <p className="text-xs text-muted-foreground">{item.user.professional}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Remaining 2 testimonials in a wider 2-col row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {data.slice(3).map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-5 bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 mt-1">
                <Image
                  src={`/images/avatars/${item.user.photo}`}
                  alt={item.user.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-[#082F49] mb-1 text-[0.95rem]">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">{item.content}</p>
                <div>
                  <p className="text-sm font-semibold text-[#082F49] leading-none mb-0.5">{item.user.name}</p>
                  <p className="text-xs text-muted-foreground">{item.user.professional}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default HomeTestimonial
