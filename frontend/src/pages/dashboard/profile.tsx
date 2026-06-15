import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import LockIcon from '@mui/icons-material/Lock'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import BadgeIcon from '@mui/icons-material/Badge'
import { DashboardLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'

const PAPER_SX = {
  p: { xs: 2.5, md: 3 },
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.88)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(148,163,184,0.16)',
  boxShadow: '0 12px 30px rgba(15,23,42,0.06)',
}

const completionItems = [
  { label: 'Email verified', done: true },
  { label: 'Phone number added', done: true },
  { label: 'NIN verified', done: true },
  { label: 'Profile photo uploaded', done: false },
  { label: 'Bio completed', done: true },
  { label: 'State of origin set', done: false },
]

const ProfilePage: NextPageWithLayout = () => {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    firstName: 'Amina',
    lastName: 'Bello',
    email: 'amina.bello@example.com',
    phone: '+234 803 456 7890',
    state: 'Kaduna',
    bio: 'Youth advocate and aspiring software engineer from northern Nigeria.',
    occupation: 'Student',
    institution: 'Ahmadu Bello University',
  })

  const completedCount = completionItems.filter((i) => i.done).length
  const completionPct = Math.round((completedCount / completionItems.length) * 100)

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <Box>
      <PageHeader
        eyebrow="Profile"
        title="My Profile"
        subtitle="Manage your personal information, identity verification, and account security."
        icon={<AccountCircleIcon />}
      />

      <Grid container spacing={3}>
          {/* Left column */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Avatar card */}
              <Paper sx={PAPER_SX}>
                <Stack alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      width: 88,
                      height: 88,
                      fontSize: 32,
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #082F49 0%, #127C71 100%)',
                    }}
                  >
                    AB
                  </Avatar>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {form.firstName} {form.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {form.occupation} · {form.institution}
                    </Typography>
                  </Box>
                  <Chip
                    icon={<VerifiedUserIcon />}
                    label="NIN Verified"
                    color="success"
                    size="small"
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: 99, textTransform: 'none', width: '100%' }}
                  >
                    Upload photo
                  </Button>
                </Stack>
              </Paper>

              {/* Profile completion */}
              <Paper sx={PAPER_SX}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Profile completion
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {completionPct}% complete
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={completionPct}
                  sx={{ height: 8, borderRadius: 99, mb: 2.5 }}
                />
                <Stack spacing={1}>
                  {completionItems.map((item) => (
                    <Stack key={item.label} direction="row" spacing={1} alignItems="center">
                      {item.done ? (
                        <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                      ) : (
                        <HourglassEmptyIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                      )}
                      <Typography
                        variant="body2"
                        sx={{ color: item.done ? 'text.primary' : 'text.disabled' }}
                      >
                        {item.label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>

              {/* Identity verification */}
              <Paper
                sx={{
                  ...PAPER_SX,
                  background: 'linear-gradient(135deg, rgba(8,47,73,0.97) 0%, rgba(18,124,113,0.97) 100%)',
                  color: 'common.white',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                  <BadgeIcon />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Identity Verification
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                  Your NIN has been verified. Your identity reference is securely encrypted and
                  never stored in plain text.
                </Typography>
                <Chip
                  icon={<VerifiedUserIcon />}
                  label="Verified · Jun 2, 2026"
                  size="small"
                  sx={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: 'none' }}
                  variant="outlined"
                />
              </Paper>
            </Stack>
          </Grid>

          {/* Right column */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Personal info */}
              <Paper sx={PAPER_SX}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Personal Information
                  </Typography>
                  <Button
                    size="small"
                    variant={editing ? 'contained' : 'outlined'}
                    startIcon={editing ? <SaveIcon /> : <EditIcon />}
                    onClick={() => setEditing((v) => !v)}
                    sx={{ borderRadius: 99, textTransform: 'none' }}
                  >
                    {editing ? 'Save changes' : 'Edit'}
                  </Button>
                </Stack>

                <Grid container spacing={2.5}>
                  {[
                    { label: 'First name', field: 'firstName' as const },
                    { label: 'Last name', field: 'lastName' as const },
                    { label: 'Email address', field: 'email' as const },
                    { label: 'Phone number', field: 'phone' as const },
                    { label: 'State of origin', field: 'state' as const },
                    { label: 'Occupation', field: 'occupation' as const },
                    { label: 'Institution / Employer', field: 'institution' as const },
                  ].map(({ label, field }) => (
                    <Grid key={field} item xs={12} sm={6}>
                      <TextField
                        label={label}
                        value={form[field]}
                        onChange={handleChange(field)}
                        disabled={!editing}
                        fullWidth
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <TextField
                      label="Bio"
                      value={form.bio}
                      onChange={handleChange('bio')}
                      disabled={!editing}
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Account security */}
              <Paper sx={PAPER_SX}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <LockIcon sx={{ color: 'text.secondary' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Account Security
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  {[
                    {
                      label: 'Password',
                      value: 'Last changed 30 days ago',
                      action: 'Change password',
                    },
                    {
                      label: 'Two-factor authentication',
                      value: 'Not enabled',
                      action: 'Enable 2FA',
                    },
                    {
                      label: 'Active sessions',
                      value: '1 device · Chrome on Windows',
                      action: 'Manage sessions',
                    },
                  ].map((row) => (
                    <Box key={row.label}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        gap={1}
                      >
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>{row.label}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {row.value}
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 99, textTransform: 'none', flexShrink: 0 }}
                        >
                          {row.action}
                        </Button>
                      </Stack>
                      <Divider sx={{ mt: 2 }} />
                    </Box>
                  ))}

                  <Box sx={{ pt: 1 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{ borderRadius: 99, textTransform: 'none' }}
                    >
                      Delete account
                    </Button>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
      </Grid>
    </Box>
  )
}

ProfilePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default ProfilePage
