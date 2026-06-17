import React, { FC } from 'react'

interface Props {
  onClick?: () => void
  variant?: 'primary' | 'light'
}

const Logo: FC<Props> = ({ onClick, variant = 'primary' }) => {
  const light = variant === 'light'
  return (
    <div
      onClick={onClick}
      className="inline-flex items-center gap-3 select-none"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div
        className="w-[42px] h-[42px] rounded-[14px] grid place-items-center relative overflow-hidden flex-shrink-0 animate-fade-in border border-white/14"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #0f766e 54%, #14b8a6 100%)',
          boxShadow: '0 12px 28px rgba(15, 23, 42, 0.16)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 30% 28%, rgba(255,255,255,0.22), transparent 28%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1), transparent 30%)',
          }}
        />
        <span className="relative z-10 text-[18px] font-extrabold leading-none tracking-[-0.06em] text-white">
          Y
        </span>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`text-[18px] font-extrabold tracking-[0.02em] ${light ? 'text-white' : 'text-foreground'}`}>YLSH</span>
        <span className={`mt-[3px] text-[11px] font-semibold tracking-[0.16em] uppercase ${light ? 'text-white/70' : 'text-muted-foreground'}`}>
          Youth platform
        </span>
      </div>
    </div>
  )
}

export default Logo
