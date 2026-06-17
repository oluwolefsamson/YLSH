import React, { useState } from "react"
import { toast } from "sonner"
import { Award, Download, ShieldCheck, QrCode, Clock, X } from "lucide-react"
import { DashboardLayout } from "@/components/layout"
import { PageHeader, StatCard } from "@/components/dashboard"
import { NextPageWithLayout } from "@/interfaces/layout"
import { cn } from "@/utils"
import { useMyCertificates } from "@/services/hooks/certificates/certificates"
import { useAuth } from "@/contexts/AuthContext"
import type { Certificate } from "@/services/endpoints/certificates/certificates"

const CARD_STYLE = { backgroundColor: "rgba(255,255,255,0.88)", boxShadow: "0 12px 30px rgba(15,23,42,0.06)" }

const CertificatesPage: NextPageWithLayout = () => {
  const { user } = useAuth()
  const { data: certificates = [], isLoading } = useMyCertificates()
  const [verifyModal, setVerifyModal] = useState<Certificate | null>(null)

  const issuedCount = certificates.filter((c) => c.status === "issued").length
  const pendingCount = certificates.filter((c) => c.status === "pending").length

  const handleDownload = (cert: Certificate) => {
    const recipientName = user ? `${user.firstName} ${user.lastName}` : "Participant"
    const issuedStr = cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Pending"
    const content = [
      "YLSH — YOUTH LEADERSHIP & SKILLS HUB",
      `CERTIFICATE OF ${cert.type.toUpperCase()}`,
      "",
      `Event: ${cert.event?.title ?? ""}`,
      `Recipient: ${recipientName}`,
      `Issued: ${issuedStr}`,
      `Verification Code: ${cert.verifyCode ?? "N/A"}`,
      "",
      "This certificate is digitally signed and verifiable at ylsh.ng/verify",
    ].join("\n")
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${(cert.event?.title ?? "Certificate").replace(/\s+/g, "_")}_YLSH_Certificate.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Certificate downloaded")
  }

  return (
    <div>
      <PageHeader eyebrow="Certificates" title="My Certificates" subtitle="Download PDF certificates and share QR-verified links. Certificates are generated after events conclude." icon={<Award size={14} />} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Issued" value={String(issuedCount)} icon={<Award size={20} />} progress={issuedCount > 0 ? 75 : 0} />
        <StatCard label="Verified" value={String(issuedCount)} icon={<ShieldCheck size={20} />} progress={issuedCount > 0 ? 75 : 0} accent="#22c55e" />
        <StatCard label="Pending" value={String(pendingCount)} icon={<Clock size={20} />} progress={pendingCount > 0 ? 25 : 0} accent="#f59e0b" />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading certificates...</div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No certificates yet. Attend an event to earn one.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div key={cert._id} className={cn("flex flex-col p-5 md:p-6 rounded-2xl border border-slate-200/16", cert.status === "pending" ? "opacity-65" : "")} style={CARD_STYLE}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-[14px] grid place-items-center text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #082F49 0%, #127C71 100%)" }}>
                  <Award size={22} />
                </div>
                <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold", cert.status === "issued" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                  {cert.status === "issued" ? <ShieldCheck size={11} /> : <Clock size={11} />}
                  {cert.status === "issued" ? "Issued" : "Pending"}
                </span>
              </div>
              <h3 className="font-bold mb-1">{cert.event?.title}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground w-fit mb-2">{cert.type}</span>
              <p className="text-sm text-muted-foreground mb-3">
                Issued: {cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Pending generation"}
              </p>
              {cert.verifyCode && (
                <div className="flex items-center gap-2 p-3 rounded-xl mb-3" style={{ backgroundColor: "rgba(18,124,113,0.06)", border: "1px solid rgba(18,124,113,0.18)" }}>
                  <QrCode size={16} className="text-primary flex-shrink-0" />
                  <span className="font-mono text-xs font-bold text-primary">{cert.verifyCode}</span>
                </div>
              )}
              <div className="flex gap-3 mt-auto">
                <button disabled={cert.status === "pending"} onClick={() => handleDownload(cert)} className="flex-1 flex items-center justify-center gap-2 h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] disabled:opacity-50 disabled:cursor-default transition-colors">
                  <Download size={15} /> Download PDF
                </button>
                <button disabled={cert.status === "pending"} onClick={() => setVerifyModal(cert)} className="flex items-center gap-2 h-10 px-4 rounded-full border border-primary text-primary font-semibold text-sm hover:bg-primary/5 disabled:opacity-50 disabled:cursor-default transition-colors">
                  <ShieldCheck size={15} /> Verify
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {verifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setVerifyModal(null)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">Certificate Verification</h3>
              <button onClick={() => setVerifyModal(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X size={18} /></button>
            </div>
            <div className="w-24 h-24 mx-auto rounded-2xl border-4 border-primary/20 grid place-items-center mb-5" style={{ backgroundColor: "rgba(18,124,113,0.06)" }}>
              <QrCode size={48} className="text-primary" />
            </div>
            <div className="flex flex-col gap-3 mb-5">
              <div className="p-3 rounded-xl bg-muted"><p className="text-xs text-muted-foreground mb-0.5">Certificate</p><p className="font-semibold text-sm">{verifyModal.event?.title}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-muted"><p className="text-xs text-muted-foreground mb-0.5">Type</p><p className="font-semibold text-sm">{verifyModal.type}</p></div>
                <div className="p-3 rounded-xl bg-muted"><p className="text-xs text-muted-foreground mb-0.5">Issued</p><p className="font-semibold text-sm">{verifyModal.issuedDate ? new Date(verifyModal.issuedDate).toLocaleDateString() : "Pending"}</p></div>
              </div>
              <div className="p-3 rounded-xl border border-primary/20" style={{ backgroundColor: "rgba(18,124,113,0.05)" }}>
                <p className="text-xs text-muted-foreground mb-0.5">Verification Code</p>
                <p className="font-mono font-bold text-primary">{verifyModal.verifyCode}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 mb-4">
              <ShieldCheck size={16} className="text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700 font-medium">This certificate is verified and authentic.</p>
            </div>
            <button onClick={() => setVerifyModal(null)} className="w-full h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

CertificatesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default CertificatesPage
