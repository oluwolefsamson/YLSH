import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import DashboardIcon from '@mui/icons-material/Dashboard'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import SchoolIcon from '@mui/icons-material/School'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PeopleIcon from '@mui/icons-material/People'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { DashboardLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import NextLink from 'next/link'

const CARD_SX = {
  p: { xs: 2.5, md: 3 },
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.88)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(148,163,184,0.16)',
  boxShadow: '0 12px 30px rgba(15,23,42,0.06)',
}

const recentActivity = [
  { icon: <CheckCircleIcon sx={{ color: '#127C71', fontSize: 18 }} />, label: 'Certificate issued for Youth Leadership Summit 2025', time: '2 days ago' },
  { icon: <EventAvailableIcon sx={{ color: '#3b82f6', fontSize: 18 }} />, label: 'Registered for Digital Skills Bootcamp', time: '4 days ago' },
  { icon: <SchoolIcon sx={{ color: '#f59e0b', fontSize: 18 }} />, label: 'Completed "Public Speaking Mastery" module', time: '1 week ago' },
  { icon: <PeopleIcon sx={{ color: '#8b5cf6', fontSize: 18 }} />, label: 'Booked mentorship session with Ngozi Adeyemi', time: '1 week ago' },
]

const quickActions = [
  { label: 'Browse Events', href: '/dashboard/events', icon: <EventAvailableIcon />, color: '#127C71' },
  { label: 'View Certificates', href: '/dashboard/certificates', icon: <WorkspacePremiumIcon />, color: '#f59e0b' },
  { label: 'Find a Mentor', href: '/dashboard/mentorship', icon: <PeopleIcon />, color: '#8b5cf6' },
  { label: 'Opportunities', href: '/dashboard/opportunities', icon: <EmojiEventsIcon />, color: '#3b82f6' },
]

const upcomingEvents = [
  { title: 'Youth Leadership Summit 2026', date: 'Jul 15, 2026', venue: 'Transcorp Hilton, Abuja' },
  { title: 'Digital Skills Bootcamp', date: 'Jun 28, 2026', venue: 'Co-Creation Hub, Lagos' },
]

const DashboardOverviewPage: NextPageWithLayout = () => {
  return (
    <Box>
      <PageHeader
        eyebrow="Participant Dashboard"
        title="Welcome back, Amina!"
        subtitle="Track your events, certificates, learning progress, and opportunities — all in one place."
        icon={<DashboardIcon />}
      />

      {/* Stats */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Events Registered" value="4" icon={<EventAvailableIcon />} progress={80} change="+1 this month" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Certificates Earned" value="3" icon={<WorkspacePremiumIcon />} progress={60} change="1 pending" accent="#f59e0b" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Learning Progress" value="68%" icon={<SchoolIcon />} progress={68} change="5 modules done" accent="#8b5cf6" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Applications" value="2" icon={<EmojiEventsIcon />} progress={40} change="1 under review" accent="#3b82f6" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick actions */}
        <Grid item xs={12} md={5}>
          <Paper sx={CARD_SX}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, letterSpacing: '-0.02em' }}>
              Quick Actions
            </Typography>
            <Grid container spacing={1.5}>
              {quickActions.map((a) => (
                <Grid key={a.label} item xs={6}>
                  <NextLink href={a.href} passHref>
                    <Box
                      component="a"
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        p: 2,
                        borderRadius: 3,
                        border: '1.5px solid rgba(148,163,184,0.2)',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: a.color,
                          backgroundColor: `${a.color}0d`,
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      <Box sx={{ color: a.color, display: 'flex' }}>{a.icon}</Box>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary', textAlign: 'center' }}>
                        {a.label}
                      </Typography>
                    </Box>
                  </NextLink>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Upcoming events */}
        <Grid item xs={12} md={7}>
          <Paper sx={CARD_SX}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                Upcoming Events
              </Typography>
              <NextLink href="/dashboard/events" passHref>
                <Button
                  component="a"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ textTransform: 'none', color: '#127C71', fontWeight: 600 }}
                >
                  View all
                </Button>
              </NextLink>
            </Stack>
            <Stack spacing={2}>
              {upcomingEvents.map((e) => (
                <Box
                  key={e.title}
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
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{e.title}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                      <CalendarMonthIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">{e.date}</Typography>
                      <Typography variant="caption" color="text.disabled">·</Typography>
                      <Typography variant="caption" color="text.secondary">{e.venue}</Typography>
                    </Stack>
                  </Box>
                  <Chip label="Registered" size="small" sx={{ backgroundColor: 'rgba(18,124,113,0.1)', color: '#127C71', fontWeight: 600 }} />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Profile completion */}
        <Grid item xs={12} md={5}>
          <Paper sx={CARD_SX}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: '-0.02em' }}>
              Profile Completion
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              A complete profile gets more visibility with mentors and event organisers.
            </Typography>
            <Box sx={{ mb: 1.5 }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                <Typography variant="body2" fontWeight={600}>72% complete</Typography>
                <NextLink href="/dashboard/profile" passHref>
                  <Typography component="a" variant="body2" sx={{ color: '#127C71', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    Complete now →
                  </Typography>
                </NextLink>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={72}
                sx={{
                  height: 8,
                  borderRadius: 99,
                  backgroundColor: 'rgba(148,163,184,0.18)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #127C71aa, #127C71)',
                    borderRadius: 99,
                  },
                }}
              />
            </Box>
            {['Add profile photo', 'Upload NIN for verification', 'Complete bio'].map((item) => (
              <Stack key={item} direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(148,163,184,0.5)', flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary">{item}</Typography>
              </Stack>
            ))}
          </Paper>
        </Grid>

        {/* Recent activity */}
        <Grid item xs={12} md={7}>
          <Paper sx={CARD_SX}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, letterSpacing: '-0.02em' }}>
              Recent Activity
            </Typography>
            <Stack spacing={0}>
              {recentActivity.map((a, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    py: 1.5,
                    borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(148,163,184,0.12)' : 'none',
                  }}
                >
                  <Box sx={{ mt: 0.25, flexShrink: 0 }}>{a.icon}</Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.4 }}>{a.label}</Typography>
                    <Typography variant="caption" color="text.disabled">{a.time}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

DashboardOverviewPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default DashboardOverviewPage
