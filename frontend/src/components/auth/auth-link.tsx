import React, { FC, ReactNode } from 'react'
import NextLink from 'next/link'

interface Props {
  href: string
  children: ReactNode
}

const AuthLink: FC<Props> = ({ href, children }) => {
  return (
    <NextLink href={href} className="font-bold text-primary hover:underline transition-colors">
      {children}
    </NextLink>
  )
}

export default AuthLink
