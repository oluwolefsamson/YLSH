import React, { FC } from 'react'

interface Props {
  onClick?: () => void
  variant?: 'primary' | 'light'
}

const Logo: FC<Props> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="inline-flex items-center select-none"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <img
        src="/images/yls-logo.svg"
        alt="Youth Leaders Summit"
        style={{ height: '64px', width: 'auto' }}
        draggable={false}
      />
    </div>
  )
}

export default Logo
