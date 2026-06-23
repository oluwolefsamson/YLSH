import React, { FC, ReactNode } from 'react'
import { cn } from '@/utils'

interface Props {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'contained' | 'outlined' | 'text'
  color?: 'default' | 'primary' | 'secondary' | 'dark' | 'light'
  size?: 'small' | 'medium' | 'large'
  disableHoverEffect?: boolean
  disabled?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
}

const StyledButton: FC<Props> = ({
  children,
  onClick,
  type = 'button',
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disableHoverEffect = false,
  disabled,
  startIcon,
  endIcon,
}) => {
  const base =
    'inline-flex items-center justify-center font-medium tracking-wide rounded-full transition-all cursor-pointer select-none whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50 disabled:pointer-events-none'

  const sizeClass =
    size === 'small' ? 'px-3 py-1.5 text-xs' : size === 'large' ? 'px-5 py-3 text-[15px]' : 'px-4 py-2 text-sm'

  const colorVariant: Record<string, Record<string, string>> = {
    contained: {
      primary: 'bg-primary text-white hover:bg-[#061e35] shadow-[0_6px_22px_rgb(8_47_73/12%)]',
      secondary: 'bg-[#082F49] text-white hover:bg-[#0a3d61]',
      default: 'bg-foreground text-white hover:opacity-90',
      dark: 'bg-[#313d56] text-white hover:opacity-90',
      light: 'bg-white text-foreground hover:bg-slate-50',
    },
    outlined: {
      primary: 'border-2 border-primary text-primary bg-transparent hover:bg-primary/6',
      secondary: 'border-2 border-[#082F49] text-[#082F49] bg-transparent hover:bg-[#082F49]/6',
      default: 'border-2 border-foreground text-foreground bg-transparent hover:bg-muted',
      dark: 'border-2 border-[#313d56] text-[#313d56] bg-transparent hover:bg-slate-100',
      light: 'border-2 border-[#313d56] text-[#313d56] bg-transparent hover:bg-slate-100',
    },
    text: {
      primary: 'bg-transparent text-primary hover:bg-primary/8',
      secondary: 'bg-transparent text-[#082F49] hover:bg-[#082F49]/8',
      default: 'bg-transparent text-foreground hover:bg-muted',
      dark: 'bg-transparent text-[#313d56] hover:bg-slate-100',
      light: 'bg-transparent text-white hover:bg-white/10',
    },
  }

  const hoverLift = !disableHoverEffect ? 'hover:-translate-y-0.5' : ''

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, sizeClass, colorVariant[variant]?.[color] ?? '', hoverLift)}
    >
      {startIcon && <span className="mr-1.5 -ml-0.5 flex items-center">{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span className="ml-1.5 -mr-0.5 flex items-center">{endIcon}</span>}
    </button>
  )
}

export default StyledButton
