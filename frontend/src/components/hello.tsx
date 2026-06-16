import React, { FC } from 'react'

interface Props {
  name: string
}

const Hello: FC<Props> = ({ name }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <p>Hello {name}</p>
    </div>
  )
}

export default Hello
