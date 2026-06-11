import React, { useState } from 'react'
import type { NextPage } from 'next'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
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
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { StyledButton } from '@/components/styled-button'
import AuthShell from '@/components/auth/auth-shell'
import AuthFormCard from '@/components/auth/auth-form-card'
import AuthLink from '@/components/auth/auth-link'

const SignInPage: NextPage = () => {
  const [showPassword, setShowPassword] = useState(false)

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
        <Box component="form" sx={{ display: 'grid', gap: 2.1 }}>
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
                  <IconButton edge="end" size="small" onClick={() => setShowPassword((value) => !value)}>
                    {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
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

          <StyledButton size="large" color="primary" disableHoverEffect>
            Sign In
          </StyledButton>

          <Divider sx={{ my: 0.5 }}>or</Divider>

          <Box
            sx={{
              p: 2.2,
              borderRadius: 4,
              backgroundColor: 'rgba(18,124,113,0.06)',
              border: '1px solid rgba(18,124,113,0.16)',
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <CheckCircleRoundedIcon color="success" />
              <Box>
                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Protected sign in</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  RBAC, audit logs, and identity checks keep participant access controlled and traceable.
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </AuthFormCard>
    </AuthShell>
  )
}

export default SignInPage
