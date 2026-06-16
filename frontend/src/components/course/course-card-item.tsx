import React, { FC } from 'react'
import Image from 'next/image'
import { ArrowRight, Star } from 'lucide-react'
import { Course } from '@/interfaces/course'

interface Props {
  item: Course
}

const CourseCardItem: FC<Props> = ({ item }) => {
  return (
    <div className="px-3 py-6">
      <div
        className="p-4 rounded-2xl border border-slate-200/16 backdrop-blur-sm group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
        style={{ backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 18px 40px rgba(15,23,42,0.06)' }}
      >
        <div className="overflow-hidden rounded-xl mb-4 leading-none">
          <Image src={item.cover} width={760} height={760} alt={'Course ' + item.id} className="w-full h-auto" />
        </div>
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[0.78rem] font-bold mb-3">
            {item.category}
          </span>
          <h2 className="text-[1.15rem] font-semibold mb-3 min-h-[56px] overflow-hidden">{item.title}</h2>
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(item.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}
                />
              ))}
            </div>
            <span className="text-sm font-medium">({item.ratingCount})</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-primary">Free</span>
            <span className="text-sm text-muted-foreground">access</span>
          </div>
          <button className="p-2 rounded-full border border-border text-primary hover:bg-primary hover:text-white hover:border-primary transition-colors group-hover:bg-primary group-hover:text-white group-hover:border-primary">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseCardItem
