import React, { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { gallery } from './gallery.data'

const spans = ['row-span-2', '', '', 'row-span-2', '', '', '', '']

const HomeGallery: FC = () => {
  const items = gallery.items?.slice(4, 12) ?? []

  return (
    <section className="py-16 md:py-24 bg-[#127C71]">
      <div className="container">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-sm font-semibold mb-3">
              Gallery
            </span>
            <h2 className="text-[30px] md:text-[44px] font-bold text-white leading-tight">
              Moments from YLSH
            </h2>
          </div>
          <p className="text-white/60 max-w-xs text-sm leading-relaxed">
            Snapshots from events, workshops, mentorship sessions, and certificate ceremonies.
          </p>
        </div>

        {/* Masonry grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-3">
          {items.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl group ${spans[i] ?? ''}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-sm font-medium">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link href="/signup" className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
            Join the community
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  )
}

export default HomeGallery
