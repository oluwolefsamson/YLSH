import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import PeopleIcon from '@mui/icons-material/People'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import VideocamIcon from '@mui/icons-material/Videocam'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import StarIcon from '@mui/icons-material/Star'
import WorkIcon from '@mui/icons-material/Work'
import { DashboardLayout } from '@/components/layout'
import { NextPageWithLayout } from '@/interfaces/layout'

const PAPER_SX = {
  p: { xs: 2.5, md: 3 },
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.82)',
  border: '1px solid rgba(148,163,184,0.18)',
  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
}

interface Mentor {
  id: number
  name: string
  role: string
  company: string
  category: string
  rating: number
  sessions: number
  bio: string
  availability: string
  initials: string
  color: string
}

const mentors: Mentor[] = [
  {
    id: 1,
    name: 'Dr. Ngozi Adeyemi',
    role: 'Chief Technology Officer',
    company: 'Flutterwave',
    category: 'Tech & Engineering',
    rating: 4.9,
    sessions: 142,
    bio: 'Former Google engineer turned fintech CTO. Passionate about growing the next generation of African tech leaders.',
    availability: 'Weekends',
    initials: 'NA',
    color: '#127C71',
  },
  {
    id: 2,
    name: 'Emeka Okafor',
    role: 'Venture Partner',
    company: 'Ventures Platform',
    category: 'Entrepreneurship',
    rating: 4.8,
    sessions: 98,
    bio: 'Early-stage investor who has backed 30+ African startups. Expert in business model design and fundraising.',
    availability: 'Weekdays (PM)',
    initials: 'EO',
    color: '#082F49',
  },
  {
    id: 3,
    name: 'Fatima Al-Hassan',
    role: 'Senior Policy Advisor',
    company: 'African Union Commission',
    category: 'Policy & Governance',
    rating: 4.7,
    sessions: 65,
    bio: 'Policy expert specializing in youth development, climate action, and continental governance frameworks.',
    availability: 'Flexible',
    initials: 'FA',
    color: '#7C3AED',
  },
  {
    id: 4,
    name: 'Chidi Nwosu',
    role: 'Head of Growth',
    company: 'Paystack',
    category: 'Marketing & Growth',
    rating: 4.6,
    sessions: 77,
    bio: 'Growth practitioner who scaled Paystack from 0 to 200k merchants. Expert in product-led growth and GTM strategy.',
    availability: 'Thursdays',
    initials: 'CN',
    color: '#D97706',
  },
]

const mySessions = [
  {
    id: 1,
    mentorName: 'Dr. Ngozi Adeyemi',
    topic: 'Career roadmap in software engineering',
    date: 'Jun 20, 2026',
    time: '3:00 PM',
    status: 'upcoming',
    mode: 'Video call',
  },
  {
    id: 2,
    mentorName: 'Emeka Okafor',
    topic: 'Pitching to investors for the first time',
    date: 'May 28, 2026',
    time: '11:00 AM',
    status: 'completed',
    mode: 'Video call',
  },
  {
    id: 3,
    mentorName: 'Fatima Al-Hassan',
    topic: 'Writing policy briefs that get noticed',
    date: 'May 10, 2026',
    time: '2:00 PM',
    status: 'completed',
    mode: 'Video call',
  },
]

const MentorshipPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)

  const upcomingCount = mySessions.filter((s) => s.status === 'upcoming').length
  const completedCount = mySessions.filter((s) => s.status === 'completed').length

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          <Chip icon={<PeopleIcon />} label="Mentorship" sx={{ width: 'fit-content' }} />
          <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 38 } }}>
            Mentorship
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
            Discover mentors, book one-on-one sessions, and track your mentorship journey across
            career, entrepreneurship, policy, and more.
          </Typography>
        </Stack>

        {/* Stats */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {[
            { label: 'Total Sessions', value: String(mySessions.length), icon: <PeopleIcon /> },
            { label: 'Upcoming', value: String(upcomingCount), icon: <CalendarMonthIcon /> },
            { label: 'Completed', value: String(completedCount), icon: <CheckCircleIcon /> },
          ].map((s) => (
            <Grid key={s.label} item xs={12} sm={4}>
              <Paper sx={{ ...PAPER_SX, p: 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '12px',
                      display: 'grid',
                      placeItems: 'center',
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                    }}
                  >
                    {s.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">{s.label}</Typography>
                    <Typography variant="h4" sx={{ fontSize: 26, fontWeight: 700 }}>{s.value}</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* My Sessions */}
        <Paper sx={{ ...PAPER_SX, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2.5, fontSize: 22 }}>
            My Sessions
          </Typography>
          <Stack spacing={2}>
            {mySessions.map((session) => (
              <Box
                key={session.id}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid rgba(148,163,184,0.18)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700 }}>{session.topic}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    with {session.mentorName}
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <CalendarMonthIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {session.date} · {session.time}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <VideocamIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {session.mode}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Chip
                    icon={session.status === 'upcoming' ? <HourglassEmptyIcon /> : <CheckCircleIcon />}
                    label={session.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                    color={session.status === 'upcoming' ? 'warning' : 'success'}
                    size="small"
                  />
                  {session.status === 'upcoming' && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VideocamIcon />}
                      sx={{ borderRadius: 99, textTransform: 'none' }}
                    >
                      Join
                    </Button>
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>

        {/* Mentor discovery */}
        <Paper sx={PAPER_SX}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontSize: 22 }}>
              Discover Mentors
            </Typography>
          </Stack>

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ mb: 3, borderBottom: '1px solid rgba(148,163,184,0.18)' }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {['All', 'Tech & Engineering', 'Entrepreneurship', 'Policy & Governance', 'Marketing & Growth'].map(
              (label) => (
                <Tab key={label} label={label} />
              ),
            )}
          </Tabs>

          <Grid container spacing={2.5}>
            {mentors
              .filter(
                (m) =>
                  tab === 0 ||
                  m.category ===
                    ['All', 'Tech & Engineering', 'Entrepreneurship', 'Policy & Governance', 'Marketing & Growth'][
                      tab
                    ],
              )
              .map((mentor) => (
                <Grid key={mentor.id} item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      border: '1px solid rgba(148,163,184,0.18)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 52,
                          height: 52,
                          backgroundColor: mentor.color,
                          fontWeight: 700,
                          fontSize: 18,
                          flexShrink: 0,
                        }}
                      >
                        {mentor.initials}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700 }}>{mentor.name}</Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <WorkIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {mentor.role} · {mentor.company}
                          </Typography>
                        </Stack>
                        <Chip
                          label={mentor.category}
                          size="small"
                          sx={{ mt: 0.75 }}
                        />
                      </Box>
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                      {mentor.bio}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Rating
                          value={mentor.rating}
                          precision={0.1}
                          size="small"
                          readOnly
                          icon={<StarIcon fontSize="inherit" />}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {mentor.rating} ({mentor.sessions} sessions)
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Available: {mentor.availability}
                      </Typography>
                    </Stack>

                    <Button
                      variant="contained"
                      sx={{ borderRadius: 99, textTransform: 'none', fontWeight: 700 }}
                    >
                      Book Session
                    </Button>
                  </Paper>
                </Grid>
              ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  )
}

MentorshipPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default MentorshipPage
