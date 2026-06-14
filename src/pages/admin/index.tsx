import React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PeopleIcon from '@mui/icons-material/People'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import { AdminLayout } from '@/components/layout'
import { NextPageWithLayout } from '@/interfaces/layout'

const PAPER_SX = {
  p: { xs: 2.5, md: 3 },
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.82)',
  border: '1px solid rgba(148,163,184,0.18)',
  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
}

const stats = [
  { label: 'Total users', value: '4,821', progress: 48, icon: <PeopleIcon /> },
  { label: 'Active events', value: '12', progress: 80, icon: <EventAvailableIcon /> },
  { label: 'Certificates issued', value: '3,104', progress: 62, icon: <WorkspacePremiumIcon /> },
  { label: 'NIN verified users', value: '3,940', progress: 82, icon: <VerifiedUserIcon /> },
]

const recentUsers = [
  { name: 'Amina Bello', email: 'amina.bello@example.com', role: 'Participant', status: 'verified', joined: 'Jun 14, 2026' },
  { name: 'Emeka Obi', email: 'emeka.obi@example.com', role: 'Participant', status: 'pending', joined: 'Jun 13, 2026' },
  { name: 'Fatima Al-Hassan', email: 'fatima@example.com', role: 'Mentor', status: 'verified', joined: 'Jun 12, 2026' },
  { name: 'Chidi Nwosu', email: 'chidi@example.com', role: 'Participant', status: 'verified', joined: 'Jun 11, 2026' },
  { name: 'Zahra Musa', email: 'zahra@example.com', role: 'Participant', status: 'suspended', joined: 'Jun 10, 2026' },
]

const recentEvents = [
  { title: 'Youth Leadership Summit 2026', date: 'Jul 15, 2026', registered: 412, capacity: 500, status: 'upcoming' },
  { title: 'Digital Skills Bootcamp', date: 'Jun 28, 2026', registered: 148, capacity: 150, status: 'upcoming' },
  { title: 'Climate Action Workshop', date: 'May 10, 2026', registered: 185, capacity: 200, status: 'past' },
]

const statusColor: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  verified: 'success',
  pending: 'warning',
  suspended: 'error',
}

const AdminOverviewPage: NextPageWithLayout = () => {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          <Chip icon={<AdminPanelSettingsIcon />} label="Admin portal" sx={{ width: 'fit-content' }} />
          <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 40 } }}>
            Admin Overview
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
            Monitor platform health, manage users, events, and certificates across the YLSH ecosystem.
          </Typography>
        </Stack>

        {/* Stat cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((card) => (
            <Grid key={card.label} item xs={12} sm={6} lg={3}>
              <Paper sx={PAPER_SX}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '14px',
                      display: 'grid',
                      placeItems: 'center',
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">{card.label}</Typography>
                    <Typography variant="h4" sx={{ fontSize: 28, fontWeight: 700 }}>{card.value}</Typography>
                  </Box>
                </Stack>
                <LinearProgress variant="determinate" value={card.progress} sx={{ height: 8, borderRadius: 99 }} />
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Recent users */}
          <Grid item xs={12} lg={7}>
            <Paper sx={PAPER_SX}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                <Typography variant="h5" sx={{ fontSize: 22 }}>Recent Users</Typography>
                <Chip label="View all" variant="outlined" size="small" clickable />
              </Stack>
              <Stack spacing={1.5}>
                {recentUsers.map((user) => (
                  <Box
                    key={user.email}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      border: '1px solid rgba(148,163,184,0.18)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email} · {user.role}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">Joined {user.joined}</Typography>
                    </Box>
                    <Chip
                      icon={user.status === 'verified' ? <CheckCircleIcon /> : user.status === 'pending' ? <HourglassEmptyIcon /> : undefined}
                      label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      color={statusColor[user.status]}
                      size="small"
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Events + growth */}
          <Grid item xs={12} lg={5}>
            <Stack spacing={3}>
              <Paper sx={PAPER_SX}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                  <Typography variant="h5" sx={{ fontSize: 22 }}>Events</Typography>
                  <Chip label="Manage" variant="outlined" size="small" clickable />
                </Stack>
                <Stack spacing={1.5}>
                  {recentEvents.map((event) => (
                    <Box
                      key={event.title}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: '1px solid rgba(148,163,184,0.18)',
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 14, flex: 1, pr: 1 }}>{event.title}</Typography>
                        <Chip label={event.status} color={event.status === 'upcoming' ? 'success' : 'default'} size="small" />
                      </Stack>
                      <Typography variant="caption" color="text.secondary">{event.date}</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(event.registered / event.capacity) * 100}
                        sx={{ height: 5, borderRadius: 99, mt: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {event.registered}/{event.capacity} registered
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>

              <Paper
                sx={{
                  ...PAPER_SX,
                  background: 'linear-gradient(135deg, rgba(8,47,73,0.98) 0%, rgba(18,124,113,0.98) 100%)',
                  color: 'common.white',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <TrendingUpIcon />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Growth this month</Typography>
                </Stack>
                {[
                  { label: 'New registrations', value: '+318' },
                  { label: 'Verifications completed', value: '+204' },
                  { label: 'Certificates issued', value: '+87' },
                  { label: 'Active mentorship sessions', value: '+43' },
                ].map((row) => (
                  <Stack key={row.label} direction="row" justifyContent="space-between" sx={{ mt: 1.5 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>{row.label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'rgba(134,239,172,0.9)' }}>{row.value}</Typography>
                  </Stack>
                ))}
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

AdminOverviewPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>

export default AdminOverviewPage
