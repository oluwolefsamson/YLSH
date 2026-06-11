import React, { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
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
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 3, md: 4 },
        background:
          'radial-gradient(circle at top left, rgba(18,124,113,0.18), transparent 28%), radial-gradient(circle at bottom right, rgba(15,23,42,0.08), transparent 26%), linear-gradient(180deg, #f7fbff 0%, #edf3f8 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Logo />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 0.88fr' },
            gap: { xs: 2.5, md: 3.5 },
            alignItems: 'stretch',
          }}
        >
          <Box
            sx={{
              p: { xs: 3, md: 5.5 },
              borderRadius: 0,
              background: 'linear-gradient(145deg, rgba(8,47,73,0.98) 0%, rgba(18,124,113,0.96) 55%, rgba(14,116,144,0.92) 100%)',
              color: 'common.white',
              boxShadow: '0 30px 70px rgba(15, 23, 42, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 22%), radial-gradient(circle at bottom left, rgba(255,255,255,0.08), transparent 24%)',
                pointerEvents: 'none',
              },
            }}
          >
            <Chip
              label={eyebrow}
              sx={{
                mb: 2.5,
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'common.white',
                border: '1px solid rgba(255,255,255,0.16)',
                fontWeight: 700,
                letterSpacing: 0.8,
              }}
            />
            <Typography
              component="h1"
              sx={{ fontSize: { xs: 34, md: 54 }, lineHeight: 1.02, fontWeight: 700, mb: 2, maxWidth: 560 }}
            >
              {title}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.88)', maxWidth: 580, lineHeight: 1.75 }}>
              {description}
            </Typography>

            <Box
              sx={{
                mt: { xs: 4, md: 6.5 },
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                gap: 1.5,
                position: 'relative',
                zIndex: 1,
              }}
            >
              {[
                { label: 'RBAC', value: 'Protected access' },
                { label: 'NIN', value: 'Identity verified' },
                { label: 'QR', value: 'Attendance ready' },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    borderRadius: 4,
                    p: 2.2,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    backdropFilter: 'blur(14px)',
                  }}
                >
                  <Typography sx={{ fontSize: 12, letterSpacing: 1.4, opacity: 0.72, mb: 1 }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 0,
              backgroundColor: 'rgba(255,255,255,0.86)',
              border: '1px solid rgba(148,163,184,0.18)',
              boxShadow: '0 22px 60px rgba(15, 23, 42, 0.08)',
              backdropFilter: 'blur(18px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Stack spacing={2} sx={{ mb: 2.5 }}>
              <Typography variant="subtitle2" sx={{ letterSpacing: 1.2, color: 'text.secondary', fontWeight: 700 }}>
                YLSH ACCESS
              </Typography>
              <Divider />
            </Stack>
            {children}
          </Box>
        </Box>

        {footer ? <Box sx={{ mt: 3 }}>{footer}</Box> : null}
      </Container>
    </Box>
  )
}

export default AuthShell
