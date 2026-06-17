import React, { FC } from 'react'

const stats = [
  { value: 'NIN', label: 'Identity Verification' },
  { value: '7+', label: 'Platform Modules' },
  { value: 'RBAC', label: 'Role-Based Access' },
  { value: 'Free', label: 'No Paywall Ever' },
]

const HomeStats: FC = () => {
  return (
    <section className="bg-black py-12">
      <div className="container">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <p className="text-[36px] md:text-[44px] font-extrabold text-white leading-none mb-2">{s.value}</p>
              <p className="text-sm text-white/85 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeStats
