import React, { FC, ReactNode } from 'react'
import NextLink from 'next/link'
import Link from '@mui/material/Link'

interface Props {
  href: string
  children: ReactNode
}

const AuthLink: FC<Props> = ({ href, children }) => {
  return (
    <Link component={NextLink} href={href} underline="none" sx={{ fontWeight: 700 }}>
      {children}
    </Link>
  )
}

export default AuthLink
