import React, { useState } from 'react'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import SecurityIcon from '@mui/icons-material/Security'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { StyledButton } from '@/components/styled-button'
import AuthShell from '@/components/auth/auth-shell'
import AuthFormCard from '@/components/auth/auth-form-card'
import AuthLink from '@/components/auth/auth-link'

const portals = [
  {
    label: 'Participant',
    description: 'Events, certificates, learning & opportunities',
    href: '/dashboard',
    icon: <DashboardIcon />,
    color: '#127C71',
  },
  {
    label: 'Mentor',
    description: 'Sessions, mentees & availability',
    href: '/mentor',
    icon: <PeopleIcon />,
    color: '#082F49',
  },
  {
    label: 'Admin',
    description: 'User & event management, analytics',
    href: '/admin',
    icon: <AdminPanelSettingsIcon />,
    color: '#7C3AED',
  },
  {
    label: 'Super Admin',
    description: 'Full system access, roles & audit logs',
    href: '/super-admin',
    icon: <SecurityIcon />,
    color: '#B91C1C',
  },
]

const SignInPage: NextPage = () => {
  const router = useRouter()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showPortals, setShowPortals] = useState(false)

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setShowPortals(true)
  }

  return (
    <AuthShell
      eyebrow="Participant access"
      title="Sign in to your YLSH account"
      description="Access your events, attendance records, certificates, mentorship, and learning resources through a clean participant dashboard."
      footer={
        <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
          New here? <AuthLink href="/signup">Create an account</AuthLink>
        </Typography>
      }
    >
      <AuthFormCard
        title="Welcome back"
        subtitle="Use your verified credentials to continue into your personal YLSH workspace."
      >
        {!showPortals ? (
          <Box component="form" onSubmit={handleSignIn} sx={{ display: 'grid', gap: 2.1 }}>
            <TextField
              fullWidth
              label="Email address"
              placeholder="you@example.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" size="small" onClick={() => setShowPassword((v) => !v)}>
                      {showPassword
                        ? <VisibilityOffOutlinedIcon fontSize="small" />
                        : <VisibilityOutlinedIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Remember this device" />
              <AuthLink href="#">Forgot password?</AuthLink>
            </Stack>

            <StyledButton type="submit" size="large" color="primary" disableHoverEffect>
              Sign In
            </StyledButton>
          </Box>
        ) : (
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
              <Chip label="Signed in" color="success" size="small" />
              <Typography variant="body2" color="text.secondary">
                Choose a portal to enter
              </Typography>
            </Stack>

            <Divider sx={{ mb: 2.5 }} />

            <Stack spacing={1.5}>
              {portals.map((portal) => (
                <Box
                  key={portal.label}
                  onClick={() => void router.push(portal.href)}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: '1px solid rgba(148,163,184,0.22)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 0.18s ease',
                    '&:hover': {
                      borderColor: portal.color,
                      backgroundColor: `${portal.color}0d`,
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      display: 'grid',
                      placeItems: 'center',
                      backgroundColor: portal.color,
                      color: 'white',
                      flexShrink: 0,
                    }}
                  >
                    {portal.icon}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700 }}>{portal.label} Dashboard</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {portal.description}
                    </Typography>
                  </Box>
                  <ArrowForwardIcon sx={{ color: 'text.disabled', flexShrink: 0 }} />
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 2.5 }} />

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
              onClick={() => setShowPortals(false)}
            >
              ← Back to sign in
            </Typography>
          </Box>
        )}
      </AuthFormCard>
    </AuthShell>
  )
}

export default SignInPage
