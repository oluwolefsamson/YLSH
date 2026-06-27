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
    <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          {icon && <span className="text-slate-400 [&>svg]:w-3.5 [&>svg]:h-3.5">{icon}</span>}
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{eyebrow}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-1.5 text-sm text-slate-500 max-w-[560px] leading-relaxed">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

export default PageHeader
