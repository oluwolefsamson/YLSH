import React, { FC } from 'react'

interface Props {
  title: string
}

const FooterSectionTitle: FC<Props> = ({ title }) => {
  return (
    <div className="flex flex-col mb-4">
      <p className="text-white font-bold text-lg">{title}</p>
    </div>
  )
}

export default FooterSectionTitle
