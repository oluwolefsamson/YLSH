import React from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import VerifiedIcon from '@mui/icons-material/Verified'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import PersonIcon from '@mui/icons-material/Person'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import HomeIcon from '@mui/icons-material/Home'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { MainLayout } from '@/components/layout'
import { NextPageWithLayout } from '@/interfaces/layout'

// Simulated certificate registry — in production this is a DB lookup
const registry: Record<string, {
  holderName: string
  eventTitle: string
  certificateType: string
  issuedDate: string
  issuedBy: string
  valid: boolean
}> = {
  'YLSH-CERT-A7X9K2': {
    holderName: 'Amina Bello',
    eventTitle: 'Youth Leadership Summit 2025',
    certificateType: 'Attendance',
    issuedDate: 'December 18, 2025',
    issuedBy: 'Young Leaders Summit Hub (YLSH)',
    valid: true,
  },
  'YLSH-CERT-B3M1P8': {
    holderName: 'Amina Bello',
    eventTitle: 'Digital Skills Bootcamp',
    certificateType: 'Completion',
    issuedDate: 'November 5, 2025',
    issuedBy: 'Young Leaders Summit Hub (YLSH)',
    valid: true,
  },
  'YLSH-CERT-C9R4L5': {
    holderName: 'Amina Bello',
    eventTitle: 'Entrepreneurship Masterclass',
    certificateType: 'Participation',
    issuedDate: 'October 22, 2025',
    issuedBy: 'Young Leaders Summit Hub (YLSH)',
    valid: true,
  },
}

const VerifyPage: NextPageWithLayout = () => {
  const router = useRouter()
  const code = typeof router.query.code === 'string' ? router.query.code : ''
  const cert = registry[code] ?? null

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(8,47,73,0.97) 0%, rgba(18,124,113,0.97) 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        {/* Header */}
        <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
          <WorkspacePremiumIcon sx={{ fontSize: 48, color: 'white' }} />
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, textAlign: 'center' }}>
            Certificate Verification
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>
            Young Leaders Summit Hub — Official Certificate Registry
          </Typography>
        </Stack>

        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.97)',
          }}
        >
          {/* Verification code display */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(18,124,113,0.06)',
              border: '1px solid rgba(18,124,113,0.2)',
              mb: 3,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <QrCode2Icon sx={{ fontSize: 20, color: 'primary.main' }} />
              <Typography
                variant="body2"
                sx={{ fontFamily: 'monospace', color: 'primary.main', fontWeight: 700 }}
              >
                {code || 'No code provided'}
              </Typography>
            </Stack>
          </Box>

          {cert ? (
            <>
              {/* Valid certificate */}
              <Stack alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: 'success.light',
                  }}
                >
                  <VerifiedIcon sx={{ fontSize: 36, color: 'success.main' }} />
                </Box>
                <Chip
                  icon={<VerifiedIcon />}
                  label="Certificate Verified"
                  color="success"
                  sx={{ fontWeight: 700, fontSize: 14, px: 1 }}
                />
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  This certificate is authentic and was issued by YLSH.
                </Typography>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Stack spacing={2.5}>
                {[
                  {
                    icon: <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />,
                    label: 'Certificate Holder',
                    value: cert.holderName,
                  },
                  {
                    icon: <WorkspacePremiumIcon sx={{ color: 'text.secondary', fontSize: 20 }} />,
                    label: 'Event / Programme',
                    value: cert.eventTitle,
                  },
                  {
                    icon: <WorkspacePremiumIcon sx={{ color: 'text.secondary', fontSize: 20 }} />,
                    label: 'Certificate Type',
                    value: cert.certificateType,
                  },
                  {
                    icon: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: 20 }} />,
                    label: 'Date Issued',
                    value: cert.issuedDate,
                  },
                  {
                    icon: <VerifiedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />,
                    label: 'Issued By',
                    value: cert.issuedBy,
                  },
                ].map((row) => (
                  <Stack key={row.label} direction="row" spacing={1.5} alignItems="flex-start">
                    <Box sx={{ mt: 0.25, flexShrink: 0 }}>{row.icon}</Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {row.label}
                      </Typography>
                      <Typography sx={{ fontWeight: 600 }}>{row.value}</Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </>
          ) : (
            <>
              {/* Invalid certificate */}
              <Stack alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: 'error.light',
                  }}
                >
                  <ErrorOutlineIcon sx={{ fontSize: 36, color: 'error.main' }} />
                </Box>
                <Chip
                  icon={<ErrorOutlineIcon />}
                  label="Certificate Not Found"
                  color="error"
                  sx={{ fontWeight: 700, fontSize: 14, px: 1 }}
                />
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  This certificate code does not match any record in the YLSH registry. It may be
                  invalid, expired, or tampered with.
                </Typography>
              </Stack>
            </>
          )}

          <Divider sx={{ my: 3 }} />

          <NextLink href="/" passHref>
            <Button
              component="a"
              fullWidth
              variant="outlined"
              startIcon={<HomeIcon />}
              sx={{ borderRadius: 99, textTransform: 'none', fontWeight: 700 }}
            >
              Back to YLSH
            </Button>
          </NextLink>
        </Paper>

        <Typography
          variant="caption"
          sx={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,0.5)', mt: 3 }}
        >
          © {new Date().getFullYear()} Young Leaders Summit Hub. All certificates are digitally
          signed and tamper-evident.
        </Typography>
      </Container>
    </Box>
  )
}

VerifyPage.getLayout = (page) => <>{page}</>

export default VerifyPage
