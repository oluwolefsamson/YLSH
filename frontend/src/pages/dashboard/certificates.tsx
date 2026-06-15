import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import DownloadIcon from '@mui/icons-material/Download'
import VerifiedIcon from '@mui/icons-material/Verified'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import { DashboardLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'

const certificates = [
  {
    id: 1,
    title: 'Youth Leadership Summit 2025',
    issuedDate: 'Dec 18, 2025',
    type: 'Attendance',
    status: 'issued',
    verifyCode: 'YLSH-CERT-A7X9K2',
  },
  {
    id: 2,
    title: 'Digital Skills Bootcamp',
    issuedDate: 'Nov 5, 2025',
    type: 'Completion',
    status: 'issued',
    verifyCode: 'YLSH-CERT-B3M1P8',
  },
  {
    id: 3,
    title: 'Entrepreneurship Masterclass',
    issuedDate: 'Oct 22, 2025',
    type: 'Participation',
    status: 'issued',
    verifyCode: 'YLSH-CERT-C9R4L5',
  },
  {
    id: 4,
    title: 'Climate Action Workshop',
    issuedDate: 'Pending generation',
    type: 'Attendance',
    status: 'pending',
    verifyCode: null,
  },
]

const CertificatesPage: NextPageWithLayout = () => {
  const issuedCount = certificates.filter((c) => c.status === 'issued').length
  const pendingCount = certificates.filter((c) => c.status === 'pending').length

  return (
    <Box>
      <PageHeader
        eyebrow="Certificates"
        title="My Certificates"
        subtitle="Download PDF certificates and share QR-verified links. Certificates are generated after events conclude."
        icon={<WorkspacePremiumIcon />}
      />

      {/* Stats */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard label="Total Issued" value={String(issuedCount)} icon={<WorkspacePremiumIcon />} progress={75} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="Verified" value={String(issuedCount)} icon={<VerifiedIcon />} progress={75} accent="#22c55e" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="Pending" value={String(pendingCount)} icon={<HourglassEmptyIcon />} progress={25} accent="#f59e0b" />
        </Grid>
      </Grid>

      {/* Certificate cards */}
      <Grid container spacing={2.5}>
        {certificates.map((cert) => (
            <Grid key={cert.id} item xs={12} md={6}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  border: '1px solid rgba(148,163,184,0.18)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: cert.status === 'pending' ? 0.65 : 1,
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '14px',
                      display: 'grid',
                      placeItems: 'center',
                      background: 'linear-gradient(135deg, #082F49 0%, #127C71 100%)',
                      color: 'white',
                    }}
                  >
                    <WorkspacePremiumIcon />
                  </Box>
                  <Chip
                    icon={cert.status === 'issued' ? <VerifiedIcon /> : <HourglassEmptyIcon />}
                    label={cert.status === 'issued' ? 'Issued' : 'Pending'}
                    color={cert.status === 'issued' ? 'success' : 'warning'}
                    size="small"
                  />
                </Stack>

                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {cert.title}
                </Typography>
                <Chip label={cert.type} size="small" sx={{ width: 'fit-content', mb: 1.5 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Issued: {cert.issuedDate}
                </Typography>

                {cert.verifyCode && (
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: 'rgba(18,124,113,0.06)',
                      border: '1px solid rgba(18,124,113,0.18)',
                      mb: 2,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <QrCode2Icon sx={{ fontSize: 18, color: 'primary.main' }} />
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: 'monospace', color: 'primary.main', fontWeight: 700 }}
                      >
                        {cert.verifyCode}
                      </Typography>
                    </Stack>
                  </Box>
                )}

                <Stack direction="row" spacing={1.5} sx={{ mt: 'auto' }}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    disabled={cert.status === 'pending'}
                    sx={{ flex: 1, borderRadius: 99, textTransform: 'none', fontWeight: 700 }}
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<VerifiedIcon />}
                    disabled={cert.status === 'pending'}
                    sx={{ borderRadius: 99, textTransform: 'none' }}
                  >
                    Verify
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
      </Grid>
    </Box>
  )
}

CertificatesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default CertificatesPage
