import React, { FC } from 'react'
import Image from 'next/image'
import { Testimonial } from '@/interfaces/testimonial'

interface Props {
  item: Testimonial
}

const TestimonialItem: FC<Props> = ({ item }) => {
  return (
    <div className="px-8 py-2">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-3">{item.title}</h2>
        <p className="text-muted-foreground mb-3">{item.content}</p>
      </div>
      <div className="shadow-sm rounded flex items-center px-4 py-3 overflow-hidden w-[270px] bg-white border border-border">
        <div className="rounded-full h-[52px] w-[52px] overflow-hidden mr-4 flex-shrink-0">
          <Image
            src={`/images/avatars/${item.user.photo}`}
            width={100}
            height={100}
            quality={97}
            alt={item.user.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-sm">{item.user.name}</p>
          <p className="text-muted-foreground text-sm">{item.user.professional}</p>
        </div>
      </div>
    </div>
  )
}
export default TestimonialItem
