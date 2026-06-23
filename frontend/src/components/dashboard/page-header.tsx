import React, { FC, ReactNode } from 'react'

interface Props {
  eyebrow: string
  title: string
  subtitle?: string
  icon?: ReactNode
  action?: ReactNode
}

const PageHeader: FC<Props> = ({ eyebrow, title, subtitle, icon, action }) => {
  return (
    <div
      className="relative overflow-hidden rounded-2xl mb-6 p-6 md:p-8"
      style={{
        background: 'linear-gradient(135deg, #082F49 0%, #0d3d6e 100%)',
        boxShadow: '0 20px 60px rgba(8,47,73,0.25)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-15 -right-15 w-55 h-55 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-10 left-[40%] w-40 h-40 rounded-full bg-white/4 pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span
            className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-[0.05em] border border-white/18"
            style={{ backgroundColor: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,1)' }}
          >
            {icon && <span className="flex text-white/90 [&>svg]:w-3.5 [&>svg]:h-3.5">{icon}</span>}
            {eyebrow}
          </span>
          <h1
            className="text-white font-bold leading-[1.15] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(26px, 4vw, 34px)' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-white/90 max-w-[560px] leading-relaxed">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  )
}

export default PageHeader
