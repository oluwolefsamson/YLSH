import React, { useState } from 'react'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import { StyledButton } from '@/components/styled-button'
import AuthShell from '@/components/auth/auth-shell'
import AuthFormCard from '@/components/auth/auth-form-card'
import AuthLink from '@/components/auth/auth-link'
const steps = ['Verify NIN', 'Personal information', 'Account details']

const SignUpPage: NextPage = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [isCreated, setIsCreated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleNext = (): void => setActiveStep((step) => Math.min(step + 1, steps.length - 1))
  const handleBack = (): void => setActiveStep((step) => Math.max(step - 1, 0))
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    if (activeStep !== 2) {
      return
    }
    setIsCreated(true)
    window.setTimeout(() => {
      void router.push('/dashboard')
    }, 1200)
  }

  return (
    <AuthShell
      eyebrow="Create account"
      title="Join the YLSH platform"
      description="Complete onboarding in steps so identity verification happens first, then profile details, then your final account setup."
      footer={
        <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
          Already have an account? <AuthLink href="/signin">Sign in</AuthLink>
        </Typography>
      }
    >
      <AuthFormCard
        title="Participant onboarding"
        subtitle="Step through identity verification, personal details, and account setup before creating your account."
      >
        <Box sx={{ display: 'grid', gap: 2.2, position: 'relative' }}>
          {isCreated ? (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                zIndex: 2,
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.78)',
                display: 'grid',
                placeItems: 'center',
                textAlign: 'center',
                px: 3,
                backdropFilter: 'blur(8px)',
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Account created
                </Typography>
                <Typography color="text.secondary">
                  Preparing your dashboard now.
                </Typography>
              </Box>
            </Box>
          ) : null}

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 1 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Box
              sx={{
                p: 2.5,
                borderRadius: 4,
                backgroundColor: 'rgba(15,23,42,0.03)',
                border: '1px solid rgba(148,163,184,0.18)',
                display: 'grid',
                gap: 2,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Step 1: Verify your NIN</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Start with identity verification. YLSH uses the NIN to support secure onboarding without storing raw
                  sensitive values.
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="NIN"
                placeholder="Enter your 11-digit NIN"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VerifiedUserOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />

              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: 'rgba(18,124,113,0.07)',
                  border: '1px solid rgba(18,124,113,0.16)',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <VerifiedUserOutlinedIcon color="primary" />
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    Verify first so your event registrations, certificates, and attendance records remain tied to one
                    authenticated identity.
                  </Typography>
                </Stack>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box sx={{ display: 'grid', gap: 2.1 }}>
              <Box>
                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Step 2: Personal information</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Add the profile details needed for your participant dashboard and future event interactions.
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.1 }}>
                <TextField
                  fullWidth
                  label="First name"
                  placeholder="Amina"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                <TextField
                  fullWidth
                  label="Last name"
                  placeholder="Bello"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Box>

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
                label="Phone number"
                placeholder="+234 800 000 0000"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />

              <TextField
                fullWidth
                label="Organization / school"
                placeholder="Youth Summit Club"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Box>
          )}

          {activeStep === 2 ? (
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2.1 }}>
              <Box>
                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Step 3: Account details and review</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Finish by setting your role, password, and preferences. Creating your account happens only after you
                  press Create Account on this step.
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.1 }}>
                <TextField
                  select
                  fullWidth
                  label="Account type"
                  defaultValue="participant"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                >
                  <MenuItem value="participant">Participant</MenuItem>
                  <MenuItem value="mentor">Mentor</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="Username"
                  placeholder="@aminab"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Box>

              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Create a strong password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" size="small" onClick={() => setShowPassword((value) => !value)}>
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />

              <TextField
                fullWidth
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm password"
                placeholder="Repeat your password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => setShowConfirmPassword((value) => !value)}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />

              <Box
                sx={{
                  p: 2.2,
                  borderRadius: 4,
                  backgroundColor: 'rgba(15,23,42,0.03)',
                  border: '1px solid rgba(148,163,184,0.2)',
                }}
              >
                <Typography sx={{ fontWeight: 700, mb: 1 }}>Final account creation</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Use this step to review your details. The account is created only when you submit here, not on the
                  earlier steps.
                </Typography>
              </Box>
            </Box>
          ) : null}

          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'space-between', pt: 0.5 }}>
            <StyledButton
              size="large"
              color="dark"
              variant="outlined"
              disableHoverEffect
              type="button"
              onClick={handleBack}
            >
              Back
            </StyledButton>
            {activeStep < steps.length - 1 ? (
              <StyledButton size="large" color="primary" disableHoverEffect type="button" onClick={handleNext}>
                Continue
              </StyledButton>
            ) : (
              <StyledButton size="large" color="primary" disableHoverEffect type="submit">
                Create Account
              </StyledButton>
            )}
          </Box>

          {activeStep === 2 ? (
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="I agree to the YLSH terms and data verification policy."
            />
          ) : null}

          <Divider sx={{ my: 0.5 }}>or</Divider>

          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            Step-based onboarding keeps NIN verification first, then profile details, then account creation at the
            Account details step.
          </Typography>
        </Box>
      </AuthFormCard>
    </AuthShell>
  )
}

export default SignUpPage
