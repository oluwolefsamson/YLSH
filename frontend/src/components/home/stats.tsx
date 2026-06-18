import React, { FC } from 'react'

const stats = [
  { value: 'NIN', label: 'Identity Verification' },
  { value: '7+', label: 'Platform Modules' },
  { value: 'RBAC', label: 'Role-Based Access' },
  { value: 'Free', label: 'No Paywall Ever' },
]

const HomeStats: FC = () => {
  return (
    <section className="bg-black py-6">
      <div className="container">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {stats.map((s) => (
            <div key={s.value} className="flex items-center gap-2.5">
              <p className="text-[22px] font-extrabold text-white leading-none">{s.value}</p>
              <p className="text-xs text-white/70 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeStats
