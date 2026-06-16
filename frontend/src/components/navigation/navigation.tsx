import React, { FC } from 'react'
import { Link as ScrollLink } from 'react-scroll'
import { navigations } from './navigation.data'

const Navigation: FC = () => {
  return (
    <nav className="flex flex-col md:flex-row">
      {navigations.map(({ path: destination, label }) => (
        <ScrollLink
          key={destination}
          activeClass="current"
          to={destination}
          spy={true}
          smooth={true}
          duration={350}
          className="relative text-muted-foreground font-semibold cursor-pointer inline-flex items-center justify-center
            px-0 md:px-5 mb-6 md:mb-0 text-lg md:text-base
            hover:text-primary transition-colors [&.current]:text-primary group"
        >
          <span
            className="absolute top-3 opacity-0 group-hover:opacity-100 [.current_&]:opacity-100 transition-opacity"
            style={{ transform: 'rotate(3deg)' }}
          >
            {/* eslint-disable-next-line */}
            <img src="/images/headline-curve.svg" alt="" className="w-11 h-auto" />
          </span>
          {label}
        </ScrollLink>
      ))}
    </nav>
  )
}

export default Navigation
