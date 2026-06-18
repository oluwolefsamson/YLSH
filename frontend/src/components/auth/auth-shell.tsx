import React, { FC, ReactNode } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/logo'

interface Props {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

const AuthShell: FC<Props> = ({ eyebrow, title, description, children, footer }) => {
  return (
    <div
      className="min-h-screen py-6 md:py-10"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(18,124,113,0.14), transparent 30%), radial-gradient(circle at bottom right, rgba(8,47,73,0.08), transparent 28%), linear-gradient(180deg, #f0f7f6 0%, #f3f6fb 100%)',
      }}
    >
      <div className="container max-w-7xl">
        <div className="mb-6 md:mb-8">
          <Link href="/" className="cursor-pointer inline-block"><Logo /></Link>
        </div>

        {/* Two-column card */}
        <div
          className="rounded-2xl md:rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_0.9fr] max-w-lg md:max-w-none mx-auto"
          style={{ boxShadow: '0 40px 80px rgba(15,23,42,0.14)' }}
        >
          {/* Left — gradient brand panel */}
          <div
            className="hidden md:block p-8 md:p-12 text-white relative overflow-hidden"
            style={{
              background:
                'linear-gradient(145deg, rgba(8,47,73,0.99) 0%, rgba(18,124,113,0.97) 55%, rgba(14,116,144,0.93) 100%)',
            }}
          >
            <div
              className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.055)' }}
            />
            <div
              className="absolute -bottom-15 -left-15 w-60 h-60 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            />

            <div className="relative z-10">
              <span
                className="inline-block mb-6 px-3 py-1 rounded-full border border-white/18 text-[11px] font-bold tracking-[0.08em] uppercase"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              >
                {eyebrow}
              </span>
              <h1 className="text-[32px] md:text-[50px] leading-[1.05] font-bold mb-5 max-w-[520px]">{title}</h1>
              <p className="text-white/82 max-w-[560px] leading-[1.8] text-sm md:text-[15px]">{description}</p>

              <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'RBAC', value: 'Protected access' },
                  { label: 'NIN', value: 'Identity verified' },
                  { label: 'QR', value: 'Attendance ready' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl p-4 border border-white/12 backdrop-blur-sm"
                    style={{ backgroundColor: 'rgba(255,255,255,0.09)' }}
                  >
                    <p className="text-[11px] tracking-[1.6px] opacity-68 mb-1.5 uppercase">{item.label}</p>
                    <p className="font-bold text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form panel */}
          <div
            className="p-6 md:p-9 flex flex-col justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex flex-col gap-3 mb-6">
              <p className="text-[11px] tracking-[1.4px] text-primary font-bold uppercase">YLSH ACCESS</p>
              <hr className="border-border" />
            </div>
            {children}
          </div>
        </div>

        {footer ? <div className="mt-4">{footer}</div> : null}
      </div>
    </div>
  )
}

export default AuthShell
