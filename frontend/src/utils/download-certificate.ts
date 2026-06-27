import type { CertificateTemplateProps } from '@/components/certificate-template'

export async function downloadCertificateAsPDF(
  props: CertificateTemplateProps,
  filename = 'YLSH_Certificate.pdf'
): Promise<void> {
  // Dynamically import heavy libs so they don't bloat the main bundle
  const [{ default: html2canvas }, { default: jsPDF }, React, { createRoot }, { default: CertificateTemplate }] =
    await Promise.all([
      import('html2canvas'),
      import('jspdf'),
      import('react'),
      import('react-dom/client'),
      import('@/components/certificate-template'),
    ])

  // Mount template off-screen
  const container = document.createElement('div')
  container.style.cssText =
    'position:fixed;left:-9999px;top:-9999px;z-index:-1;pointer-events:none;'
  document.body.appendChild(container)

  const root = createRoot(container)

  await new Promise<void>((resolve) => {
    root.render(React.createElement(CertificateTemplate, props))
    // Wait two frames for fonts/images to paint
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })

  // Extra wait for cursive fonts to load
  if (document.fonts?.ready) await document.fonts.ready

  try {
    const el = container.firstElementChild as HTMLElement
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/jpeg', 0.95)
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210)
    pdf.save(filename)
  } finally {
    root.unmount()
    document.body.removeChild(container)
  }
}
