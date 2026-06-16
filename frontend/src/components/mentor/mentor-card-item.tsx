import React, { FC } from 'react'
import Image from 'next/image'
import { Mentor } from '@/interfaces/mentor'

interface Props {
  item: Mentor
}

const MentorCardItem: FC<Props> = ({ item }) => {
  return (
    <div className="px-4 py-10">
      <div className="p-4 bg-white rounded-2xl border border-border hover:shadow-md transition-shadow">
        <div className="overflow-hidden rounded-xl h-[200px] mb-4 leading-none">
          <Image src={item.photo as string} width={570} height={427} alt={'Mentor ' + item.id} className="w-full h-full object-cover" />
        </div>
        <div className="mb-3">
          <h2 className="text-[1.4rem] font-bold">{item.name}</h2>
          <p className="text-muted-foreground mb-2">{item.category}</p>
          <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
          {item.company?.logo && (
            <div>
              {/* eslint-disable-next-line */}
              <img src={item.company.logo} alt={item.company.name + ' logo'} className="h-[26px] w-auto" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default MentorCardItem
