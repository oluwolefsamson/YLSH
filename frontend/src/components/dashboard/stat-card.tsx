import React, { FC, ReactNode } from 'react'

interface Props {
  label: string
  value: string
  icon: ReactNode
  progress?: number
  change?: string
  accent?: string
}

const StatCard: FC<Props> = ({ label, value, icon, progress, change, accent = '#127C71' }) => {
  return (
    <div
      className="p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16 transition-transform duration-200 hover:-translate-y-0.5"
      style={{
        backgroundColor: 'rgba(255,255,255,0.88)',
        boxShadow: '0 12px 30px rgba(15,23,42,0.06)',
      }}
    >
      <div className={`flex gap-4 items-center ${progress !== undefined ? 'mb-4' : ''}`}>
        <div
          className="w-12 h-12 rounded-[14px] grid place-items-center text-white flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${accent}dd 0%, ${accent} 100%)`,
            boxShadow: `0 6px 18px ${accent}33`,
          }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-[11px] font-medium mb-0.5 uppercase tracking-[0.5px] text-muted-foreground"
          >
            {label}
          </p>
          <p className="font-bold text-[28px] leading-none tracking-[-0.03em] text-foreground">{value}</p>
          {change && <p className="text-xs font-semibold mt-0.5" style={{ color: '#127C71' }}>{change}</p>}
        </div>
      </div>
      {progress !== undefined && (
        <div className="h-[5px] rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(148,163,184,0.18)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${accent}aa, ${accent})`,
            }}
          />
        </div>
      )}
    </div>
  )
}

export default StatCard
