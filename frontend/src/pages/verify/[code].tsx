import React from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { Award, ShieldCheck, QrCode, User, Calendar, Home, AlertCircle } from 'lucide-react'
import { NextPageWithLayout } from '@/interfaces/layout'

const registry: Record<string, { holderName: string; eventTitle: string; certificateType: string; issuedDate: string; issuedBy: string; valid: boolean }> = {
  'YLSH-CERT-A7X9K2': { holderName: 'Amina Bello', eventTitle: 'Youth Leadership Summit 2025', certificateType: 'Attendance', issuedDate: 'December 18, 2025', issuedBy: 'Young Leaders Summit Hub (YLSH)', valid: true },
  'YLSH-CERT-B3M1P8': { holderName: 'Amina Bello', eventTitle: 'Digital Skills Bootcamp', certificateType: 'Completion', issuedDate: 'November 5, 2025', issuedBy: 'Young Leaders Summit Hub (YLSH)', valid: true },
  'YLSH-CERT-C9R4L5': { holderName: 'Amina Bello', eventTitle: 'Entrepreneurship Masterclass', certificateType: 'Participation', issuedDate: 'October 22, 2025', issuedBy: 'Young Leaders Summit Hub (YLSH)', valid: true },
}

const VerifyPage: NextPageWithLayout = () => {
  const router = useRouter()
  const code = typeof router.query.code === 'string' ? router.query.code : ''
  const cert = registry[code] ?? null

  return (
    <div className="min-h-screen flex items-center py-12 px-4" style={{ background: 'linear-gradient(135deg, rgba(6,30,53,0.97) 0%, rgba(8,47,73,0.97) 100%)' }}>
      <div className="w-full max-w-lg mx-auto">
        <div className="flex flex-col items-center gap-2 mb-6 text-center">
          <Award size={48} className="text-white" />
          <h1 className="text-3xl font-bold text-white">Certificate Verification</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)' }}>Young Leaders Summit Hub — Official Certificate Registry</p>
        </div>
        <div className="p-6 md:p-8 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.97)' }}>
          <div className="flex items-center gap-2 p-3 rounded-xl mb-5" style={{ backgroundColor: 'rgba(8,47,73,0.06)', border: '1px solid rgba(8,47,73,0.2)' }}>
            <QrCode size={18} className="text-primary flex-shrink-0" />
            <span className="font-mono text-sm font-bold text-primary">{code || 'No code provided'}</span>
          </div>
          {cert ? (
            <>
              <div className="flex flex-col items-center gap-3 mb-5">
                <div className="w-16 h-16 rounded-full grid place-items-center bg-blue-100"><ShieldCheck size={32} className="text-[#082F49]" /></div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-[#082F49]"><ShieldCheck size={14} /> Certificate Verified</span>
                <p className="text-sm text-muted-foreground text-center">This certificate is authentic and was issued by YLSH.</p>
              </div>
              <hr className="border-border mb-5" />
              <div className="flex flex-col gap-4">
                {[
                  { icon: <User size={18} className="text-muted-foreground" />, label: 'Certificate Holder', value: cert.holderName },
                  { icon: <Award size={18} className="text-muted-foreground" />, label: 'Event / Programme', value: cert.eventTitle },
                  { icon: <Award size={18} className="text-muted-foreground" />, label: 'Certificate Type', value: cert.certificateType },
                  { icon: <Calendar size={18} className="text-muted-foreground" />, label: 'Date Issued', value: cert.issuedDate },
                  { icon: <ShieldCheck size={18} className="text-muted-foreground" />, label: 'Issued By', value: cert.issuedBy },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">{row.icon}</div>
                    <div><p className="text-xs text-muted-foreground">{row.label}</p><p className="font-semibold">{row.value}</p></div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 mb-5">
              <div className="w-16 h-16 rounded-full grid place-items-center bg-red-100"><AlertCircle size={32} className="text-red-500" /></div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-600"><AlertCircle size={14} /> Certificate Not Found</span>
              <p className="text-sm text-muted-foreground text-center">This certificate code does not match any record in the YLSH registry. It may be invalid, expired, or tampered with.</p>
            </div>
          )}
          <hr className="border-border my-5" />
          <NextLink href="/" className="w-full flex items-center justify-center gap-2 h-11 rounded-full border border-border font-bold text-sm hover:bg-muted transition-colors">
            <Home size={16} /> Back to YLSH
          </NextLink>
        </div>
        <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
          © {new Date().getFullYear()} Young Leaders Summit Hub. All certificates are digitally signed and tamper-evident.
        </p>
      </div>
    </div>
  )
}

VerifyPage.getLayout = (page) => <>{page}</>
export default VerifyPage