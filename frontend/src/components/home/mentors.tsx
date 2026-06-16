import React, { FC } from 'react'
import Image from 'next/image'
import { data } from './mentors.data'

const HomeOurMentors: FC = () => {
  return (
    <section id="mentors" className="py-16 md:py-20 bg-white">
      <div className="container">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
            Service Teams
          </span>
          <h2 className="text-[30px] md:text-[40px] font-bold text-[#082F49]">Built by dedicated teams</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm">
            Each module is owned by a focused team responsible for design, build, and delivery.
          </p>
        </div>

        {/* 4-column grid — no slider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl overflow-hidden bg-white border border-border hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
            >
              <div className="h-48 overflow-hidden">
                <Image
                  src={item.photo as string}
                  alt={item.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-[#082F49] text-[1.05rem] mb-0.5">{item.name}</h3>
                <p className="text-primary text-xs font-semibold mb-2">{item.category}</p>
                <p className="text-muted-foreground text-sm leading-snug flex-1">{item.description}</p>
                {item.company?.logo && (
                  <div className="mt-4 pt-4 border-t border-border">
                    {/* eslint-disable-next-line */}
                    <img src={item.company.logo} alt={item.company.name} className="h-5 w-auto opacity-60" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default HomeOurMentors
