import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import PeopleIcon from '@mui/icons-material/People'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import StarIcon from '@mui/icons-material/Star'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import VideocamIcon from '@mui/icons-material/Videocam'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { MentorLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'

const PAPER_SX = {
  p: { xs: 2.5, md: 3 },
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.88)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(148,163,184,0.16)',
  boxShadow: '0 12px 30px rgba(15,23,42,0.06)',
}

const stats = [
  { label: 'Total mentees', value: '24', progress: 80, icon: <PeopleIcon /> },
  { label: 'Sessions this month', value: '11', progress: 73, icon: <CalendarMonthIcon /> },
  { label: 'Average rating', value: '4.9', progress: 98, icon: <StarIcon /> },
  { label: 'Sessions completed', value: '142', progress: 100, icon: <CheckCircleIcon /> },
]

const upcomingSessions = [
  { name: 'Amina Bello', topic: 'Career roadmap in software engineering', date: 'Jun 20, 2026', time: '3:00 PM' },
  { name: 'Kelechi Obi', topic: 'Preparing for a product management role', date: 'Jun 22, 2026', time: '11:00 AM' },
  { name: 'Zahra Musa', topic: 'Transitioning from academia to industry', date: 'Jun 25, 2026', time: '5:00 PM' },
]

const recentActivity = [
  { text: 'Session completed with Amina Bello', meta: '2 days ago', done: true },
  { text: 'New booking request from Tunde Adeyemi', meta: '3 days ago', done: false },
  { text: 'Session completed with Ngozi Eze', meta: '5 days ago', done: true },
  { text: 'Profile updated — availability changed', meta: 'Last week', done: true },
]

const MentorOverviewPage: NextPageWithLayout = () => {
  return (
    <Box>
      <PageHeader
        eyebrow="Mentor Portal"
        title="Welcome back, Dr. Ngozi!"
        subtitle="Manage your mentee sessions, availability, and impact from your mentor portal."
        icon={<DashboardIcon />}
      />

      {/* Stat cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((card) => (
          <Grid key={card.label} item xs={12} sm={6} lg={3}>
            <StatCard label={card.label} value={card.value} icon={card.icon} progress={card.progress} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Upcoming sessions */}
        <Grid item xs={12} lg={7}>
          <Paper sx={PAPER_SX}>
            <Typography variant="h5" sx={{ mb: 2.5, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
              Upcoming Sessions
              </Typography>
              <Stack spacing={1.5}>
                {upcomingSessions.map((session) => (
                  <Box
                    key={session.name}
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
                      <Typography sx={{ fontWeight: 700 }}>{session.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{session.topic}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {session.date} · {session.time}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VideocamIcon />}
                      sx={{ borderRadius: 99, textTransform: 'none', flexShrink: 0 }}
                    >
                      Join
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Recent activity */}
          <Grid item xs={12} lg={5}>
            <Paper
              sx={{
                ...PAPER_SX,
                background: 'linear-gradient(135deg, rgba(8,47,73,0.98) 0%, rgba(18,124,113,0.98) 100%)',
                color: 'common.white',
              }}
            >
              <Typography variant="h5" sx={{ mb: 2.5, fontSize: 22 }}>
                Recent Activity
              </Typography>
              <Stack spacing={1.5}>
                {recentActivity.map((item) => (
                  <Box
                    key={item.text}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255,255,255,0.09)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <Box sx={{ mt: 0.25, flexShrink: 0 }}>
                        {item.done
                          ? <CheckCircleIcon sx={{ fontSize: 18, color: 'rgba(134,239,172,0.9)' }} />
                          : <HourglassEmptyIcon sx={{ fontSize: 18, color: 'rgba(253,186,116,0.9)' }} />}
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.text}</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>{item.meta}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
      </Grid>
    </Box>
  )
}

MentorOverviewPage.getLayout = (page) => <MentorLayout>{page}</MentorLayout>

export default MentorOverviewPage
