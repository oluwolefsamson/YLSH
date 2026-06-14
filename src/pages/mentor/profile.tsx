import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import StarIcon from '@mui/icons-material/Star'
import PeopleIcon from '@mui/icons-material/People'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import WorkIcon from '@mui/icons-material/Work'
import { MentorLayout } from '@/components/layout'
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

const MentorProfilePage: NextPageWithLayout = () => {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    firstName: 'Ngozi',
    lastName: 'Adeyemi',
    email: 'ngozi.adeyemi@example.com',
    phone: '+234 801 234 5678',
    role: 'Chief Technology Officer',
    company: 'Flutterwave',
    category: 'Tech & Engineering',
    bio: 'Former Google engineer turned fintech CTO. Passionate about growing the next generation of African tech leaders.',
    linkedin: 'linkedin.com/in/ngozi-adeyemi',
    expertise: 'Software Engineering, System Design, Career Mentorship',
  })

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <Box>
      <PageHeader
        eyebrow="Mentor Profile"
        title="My Profile"
        subtitle="Manage your public mentor profile. This is what participants see when discovering mentors."
        icon={<AccountCircleIcon />}
      />

      <Grid container spacing={3}>
          {/* Left column */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Avatar + stats */}
              <Paper sx={PAPER_SX}>
                <Stack alignItems="center" spacing={2}>
                  <Avatar sx={{ width: 88, height: 88, fontSize: 32, fontWeight: 700, backgroundColor: '#127C71' }}>
                    NA
                  </Avatar>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{form.firstName} {form.lastName}</Typography>
                    <Typography variant="body2" color="text.secondary">{form.role} · {form.company}</Typography>
                    <Chip label={form.category} size="small" sx={{ mt: 1 }} />
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Rating value={4.9} precision={0.1} size="small" readOnly icon={<StarIcon fontSize="inherit" />} />
                    <Typography variant="body2" color="text.secondary">4.9 · 142 sessions</Typography>
                  </Stack>
                  <Button variant="outlined" size="small" sx={{ borderRadius: 99, textTransform: 'none', width: '100%' }}>
                    Upload photo
                  </Button>
                </Stack>
              </Paper>

              {/* Impact stats */}
              <Paper sx={{ ...PAPER_SX, background: 'linear-gradient(135deg, rgba(8,47,73,0.98) 0%, rgba(18,124,113,0.98) 100%)', color: 'common.white' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Mentor Impact</Typography>
                {[
                  { icon: <PeopleIcon sx={{ fontSize: 18 }} />, label: 'Total mentees', value: '24' },
                  { icon: <CalendarMonthIcon sx={{ fontSize: 18 }} />, label: 'Sessions completed', value: '142' },
                  { icon: <StarIcon sx={{ fontSize: 18 }} />, label: 'Average rating', value: '4.9 / 5' },
                  { icon: <WorkIcon sx={{ fontSize: 18 }} />, label: 'Years experience', value: '12+' },
                ].map((row) => (
                  <Stack key={row.label} direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ color: 'rgba(255,255,255,0.7)' }}>{row.icon}</Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>{row.label}</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.value}</Typography>
                  </Stack>
                ))}
              </Paper>
            </Stack>
          </Grid>

          {/* Right column */}
          <Grid item xs={12} md={8}>
            <Paper sx={PAPER_SX}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Profile Information</Typography>
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
                  { label: 'Role / Title', field: 'role' as const },
                  { label: 'Company / Organisation', field: 'company' as const },
                  { label: 'Mentorship category', field: 'category' as const },
                  { label: 'LinkedIn profile', field: 'linkedin' as const },
                  { label: 'Areas of expertise', field: 'expertise' as const },
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
                    rows={4}
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="body2" color="text.secondary">
                Your profile is visible to all YLSH participants when they browse mentors. Keep your bio and expertise up to date to attract the right mentees.
              </Typography>
            </Paper>
          </Grid>
      </Grid>
    </Box>
  )
}

MentorProfilePage.getLayout = (page) => <MentorLayout>{page}</MentorLayout>

export default MentorProfilePage
