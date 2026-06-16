import React, { FC } from 'react'
import NextLink from 'next/link'

const AuthNavigation: FC = () => {
  return (
    <div className="flex gap-3">
      <NextLink
        href="/signin"
        className="inline-flex items-center justify-center px-5 py-2 rounded-full border-2 border-primary text-primary font-semibold text-sm tracking-wide hover:bg-primary/10 transition-colors"
      >
        Sign In
      </NextLink>
      <NextLink
        href="/signup"
        className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-primary text-white font-semibold text-sm tracking-wide shadow-[0_6px_22px_0_rgb(18_124_113_/_12%)] hover:bg-[#0d5c54] transition-colors"
      >
        Sign Up
      </NextLink>
    </div>
  )
}

export default AuthNavigation
