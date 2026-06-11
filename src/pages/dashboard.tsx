import React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SchoolIcon from '@mui/icons-material/School'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { DashboardLayout } from '@/components/layout'
import { NextPageWithLayout } from '@/interfaces/layout'

const cards = [
  { label: 'Profile completion', value: '92%', progress: 92, icon: <VerifiedUserIcon /> },
  { label: 'Upcoming events', value: '4', progress: 68, icon: <EventAvailableIcon /> },
  { label: 'Certificates', value: '12', progress: 74, icon: <WorkspacePremiumIcon /> },
  { label: 'Mentorship sessions', value: '3', progress: 45, icon: <SchoolIcon /> },
]

const activity = [
  { title: 'Completed identity verification', meta: 'Today', tag: 'NIN verified' },
  { title: 'Registered for Youth Summit 2026', meta: 'Tomorrow', tag: 'Event registration' },
  { title: 'Downloaded certificate: Digital Skills Bootcamp', meta: '2 days ago', tag: 'Certificate' },
  { title: 'Mentorship session confirmed', meta: 'This week', tag: 'Mentorship' },
]

const dashboardModules = [
  { title: 'Events', description: 'Browse events, sessions, venues, and waitlists.', icon: <CalendarMonthIcon /> },
  { title: 'Learning', description: 'Track resources, courses, PDFs, and videos.', icon: <SchoolIcon /> },
  { title: 'Opportunities', description: 'Find internships, grants, scholarships, and jobs.', icon: <EmojiEventsIcon /> },
]

const DashboardPage: NextPageWithLayout = () => {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          <Chip icon={<DashboardIcon />} label="Participant dashboard" sx={{ width: 'fit-content' }} />
          <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 40 } }}>
            Welcome back, Amina
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
            Manage identity verification, event registrations, attendance, certificates, mentorship, learning, and
            opportunities from a single place.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {cards.map((card) => (
            <Grid key={card.label} item xs={12} sm={6} lg={3}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.82)',
                  border: '1px solid rgba(148,163,184,0.18)',
                  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
                }}
              >
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
                    <Typography variant="subtitle2" color="text.secondary">
                      {card.label}
                    </Typography>
                    <Typography variant="h4" sx={{ fontSize: 28, fontWeight: 700 }}>
                      {card.value}
                    </Typography>
                  </Box>
                </Stack>
                <LinearProgress variant="determinate" value={card.progress} sx={{ height: 8, borderRadius: 99 }} />
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} lg={7}>
            <Paper
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.82)',
                border: '1px solid rgba(148,163,184,0.18)',
              }}
            >
              <Typography variant="h5" sx={{ mb: 2.5, fontSize: 22 }}>
                Recent activity
              </Typography>
              <Stack spacing={1.5}>
                {activity.map((item) => (
                  <Box
                    key={item.title}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: 2,
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: 'background.paper',
                      border: '1px solid rgba(148,163,184,0.14)',
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.meta}
                      </Typography>
                    </Box>
                    <Chip label={item.tag} size="small" icon={<CheckCircleOutlineIcon />} />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Paper
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 4,
                background:
                  'linear-gradient(135deg, rgba(8,47,73,0.98) 0%, rgba(18,124,113,0.98) 100%)',
                color: 'common.white',
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.16)',
              }}
            >
              <Typography variant="h5" sx={{ mb: 1.5, fontSize: 22 }}>
                Quick actions
              </Typography>
              <Stack spacing={1.5}>
                {dashboardModules.map((item) => (
                  <Box
                    key={item.title}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255,255,255,0.09)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '12px',
                          display: 'grid',
                          placeItems: 'center',
                          backgroundColor: 'rgba(255,255,255,0.12)',
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {item.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

DashboardPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default DashboardPage
