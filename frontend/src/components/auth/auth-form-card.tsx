import React, { FC, ReactNode } from 'react'

interface Props {
  title: string
  subtitle: string
  children: ReactNode
}

const AuthFormCard: FC<Props> = ({ title, subtitle, children }) => {
  return (
    <div>
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-[26px] md:text-[31px] font-bold leading-tight">{title}</h2>
        <p className="text-muted-foreground leading-relaxed max-w-[520px]">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

export default AuthFormCard
