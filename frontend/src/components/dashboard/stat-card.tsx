import React, { FC, ReactNode } from 'react'

interface Props {
  label: string
  value: string
  icon: ReactNode
  progress?: number
  change?: string
  accent?: string
}

const StatCard: FC<Props> = ({ label, value, icon, progress, change, accent = '#082F49' }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{label}</p>
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-full grid place-items-center flex-shrink-0"
          style={{ backgroundColor: `${accent}18`, color: accent }}
        >
          {icon}
        </div>
        <div>
          <p className="text-2xl font-extrabold text-slate-800 leading-none tracking-tight">{value}</p>
          {change && <p className="text-xs font-semibold mt-1" style={{ color: accent }}>{change}</p>}
        </div>
      </div>
      {progress !== undefined && (
        <div className="mt-4 h-1.5 rounded-full overflow-hidden bg-slate-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: accent }}
          />
        </div>
      )}
    </div>
  )
}

export default StatCard
