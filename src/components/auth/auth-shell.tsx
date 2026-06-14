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
        py: { xs: 3, md: 5 },
        background:
          'radial-gradient(circle at top left, rgba(18,124,113,0.14), transparent 30%), radial-gradient(circle at bottom right, rgba(8,47,73,0.08), transparent 28%), linear-gradient(180deg, #f0f7f6 0%, #f3f6fb 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Logo />
        </Box>

        {/* Two-column card with rounded corners */}
        <Box
          sx={{
            borderRadius: { xs: 3, md: 4 },
            overflow: 'hidden',
            boxShadow: '0 40px 80px rgba(15,23,42,0.14)',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 0.9fr' },
          }}
        >
          {/* Left — gradient brand panel */}
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              background:
                'linear-gradient(145deg, rgba(8,47,73,0.99) 0%, rgba(18,124,113,0.97) 55%, rgba(14,116,144,0.93) 100%)',
              color: 'common.white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-80px',
                right: '-80px',
                width: 320,
                height: 320,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.055)',
                pointerEvents: 'none',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-60px',
                left: '-60px',
                width: 240,
                height: 240,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Chip
                label={eyebrow}
                sx={{
                  mb: 3,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  color: 'common.white',
                  border: '1px solid rgba(255,255,255,0.18)',
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  fontSize: 11,
                  textTransform: 'uppercase',
                }}
              />
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: 32, md: 50 },
                  lineHeight: 1.05,
                  fontWeight: 700,
                  mb: 2.5,
                  maxWidth: 520,
                }}
              >
                {title}
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.82)',
                  maxWidth: 560,
                  lineHeight: 1.8,
                  fontSize: { xs: 14, md: 15 },
                }}
              >
                {description}
              </Typography>

              <Box
                sx={{
                  mt: { xs: 5, md: 7 },
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                  gap: 1.5,
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
                      borderRadius: 3,
                      p: 2.2,
                      backgroundColor: 'rgba(255,255,255,0.09)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 11,
                        letterSpacing: 1.6,
                        opacity: 0.68,
                        mb: 0.75,
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right — glassmorphism form panel */}
          <Box
            sx={{
              p: { xs: 3, md: 4.5 },
              backgroundColor: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  letterSpacing: 1.4,
                  color: '#127C71',
                  fontWeight: 700,
                  fontSize: 11,
                  textTransform: 'uppercase',
                }}
              >
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
