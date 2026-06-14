import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PeopleIcon from '@mui/icons-material/People'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { DashboardLayout } from '@/components/layout'
import { NextPageWithLayout } from '@/interfaces/layout'

const PAPER_SX = {
  p: { xs: 2.5, md: 3 },
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.82)',
  border: '1px solid rgba(148,163,184,0.18)',
  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
}

const events = [
  {
    id: 1,
    title: 'Youth Leadership Summit 2026',
    date: 'Jul 15, 2026',
    time: '9:00 AM – 5:00 PM',
    venue: 'Transcorp Hilton, Abuja',
    category: 'Summit',
    capacity: 500,
    registered: 412,
    description: 'Annual flagship event for young Nigerian leaders covering tech, entrepreneurship, and governance.',
    status: 'upcoming',
  },
  {
    id: 2,
    title: 'Digital Skills Bootcamp',
    date: 'Jun 28, 2026',
    time: '10:00 AM – 3:00 PM',
    venue: 'Co-Creation Hub, Lagos',
    category: 'Workshop',
    capacity: 150,
    registered: 148,
    description: 'Hands-on bootcamp covering data analysis, frontend development, and AI fundamentals.',
    status: 'upcoming',
  },
  {
    id: 3,
    title: 'Entrepreneurship Masterclass',
    date: 'Jun 20, 2026',
    time: '2:00 PM – 6:00 PM',
    venue: 'Virtual (Zoom)',
    category: 'Masterclass',
    capacity: 300,
    registered: 300,
    description: 'Deep dive into building sustainable startups with seasoned founders and investors.',
    status: 'upcoming',
  },
  {
    id: 4,
    title: 'Climate Action Workshop',
    date: 'May 10, 2026',
    time: '9:00 AM – 1:00 PM',
    venue: 'University of Lagos Auditorium',
    category: 'Workshop',
    capacity: 200,
    registered: 185,
    description: 'Exploring youth-led climate solutions and policy advocacy for West Africa.',
    status: 'past',
  },
]

const myRegistrations = [
  { id: 1, eventTitle: 'Youth Leadership Summit 2026', date: 'Jul 15, 2026', qrToken: 'YLS-2026-A7X9' },
  { id: 4, eventTitle: 'Climate Action Workshop', date: 'May 10, 2026', qrToken: 'CAW-2026-B3K1' },
]

const categoryColor: Record<string, 'primary' | 'success' | 'warning' | 'default'> = {
  Summit: 'primary',
  Workshop: 'success',
  Masterclass: 'warning',
}

const EventsPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)

  const filtered =
    tab === 0 ? events :
    tab === 1 ? events.filter((e) => e.status === 'upcoming') :
    events.filter((e) => e.status === 'past')

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          <Chip icon={<EventAvailableIcon />} label="Events" sx={{ width: 'fit-content' }} />
          <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 38 } }}>
            Events & Sessions
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
            Browse upcoming events, register, and track attendance. Your QR codes appear in My Registrations below.
          </Typography>
        </Stack>

        {/* Stats */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {[
            { label: 'Registered', value: '2', icon: <EventAvailableIcon /> },
            { label: 'Upcoming', value: '1', icon: <CalendarMonthIcon /> },
            { label: 'Attended', value: '1', icon: <PeopleIcon /> },
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

        {/* Event listing */}
        <Paper sx={{ ...PAPER_SX, mb: 4 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ mb: 3, borderBottom: '1px solid rgba(148,163,184,0.18)' }}
          >
            <Tab label="All Events" />
            <Tab label="Upcoming" />
            <Tab label="Past" />
          </Tabs>

          <Grid container spacing={2.5}>
            {filtered.map((event) => (
              <Grid key={event.id} item xs={12} md={6}>
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
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                    <Chip
                      label={event.category}
                      color={categoryColor[event.category] ?? 'default'}
                      size="small"
                    />
                    <Chip
                      label={event.registered >= event.capacity ? 'Full' : 'Open'}
                      color={event.registered >= event.capacity ? 'error' : 'success'}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>

                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                    {event.description}
                  </Typography>

                  <Stack spacing={0.75} sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarMonthIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.date}
                      </Typography>
                      <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.time}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">{event.venue}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.registered}/{event.capacity} registered
                      </Typography>
                    </Stack>
                  </Stack>

                  <Button
                    variant="contained"
                    disabled={event.status === 'past'}
                    sx={{ borderRadius: 99, textTransform: 'none', fontWeight: 700 }}
                  >
                    {event.status === 'past'
                      ? 'Event ended'
                      : event.registered >= event.capacity
                      ? 'Join waitlist'
                      : 'Register'}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* My Registrations + QR codes */}
        <Paper sx={PAPER_SX}>
          <Typography variant="h5" sx={{ mb: 2.5, fontSize: 22 }}>
            My Registrations & QR Codes
          </Typography>
          <Stack spacing={2}>
            {myRegistrations.map((reg) => (
              <Box
                key={reg.id}
                sx={{
                  p: 2.5,
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
                  <Typography sx={{ fontWeight: 700 }}>{reg.eventTitle}</Typography>
                  <Typography variant="body2" color="text.secondary">{reg.date}</Typography>
                </Box>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Chip icon={<QrCode2Icon />} label={reg.qrToken} variant="outlined" />
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 99, textTransform: 'none' }}
                  >
                    View QR
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

EventsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default EventsPage
