import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import VideocamIcon from '@mui/icons-material/Videocam'
import CancelIcon from '@mui/icons-material/Cancel'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { MentorLayout } from '@/components/layout'
import { NextPageWithLayout } from '@/interfaces/layout'

const PAPER_SX = {
  p: { xs: 2.5, md: 3 },
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.82)',
  border: '1px solid rgba(148,163,184,0.18)',
  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
}

const sessions = [
  { id: 1, mentee: 'Amina Bello', topic: 'Career roadmap in software engineering', date: 'Jun 20, 2026', time: '3:00 PM', duration: '60 min', status: 'upcoming', outcome: null },
  { id: 2, mentee: 'Kelechi Obi', topic: 'Preparing for a product management role', date: 'Jun 22, 2026', time: '11:00 AM', duration: '45 min', status: 'upcoming', outcome: null },
  { id: 3, mentee: 'Zahra Musa', topic: 'Transitioning from academia to industry', date: 'Jun 25, 2026', time: '5:00 PM', duration: '60 min', status: 'upcoming', outcome: null },
  { id: 4, mentee: 'Tunde Adeyemi', topic: 'Pitching to investors for the first time', date: 'May 28, 2026', time: '2:00 PM', duration: '90 min', status: 'completed', outcome: 'Mentee refined their pitch deck. Follow-up in 2 weeks.' },
  { id: 5, mentee: 'Ngozi Eze', topic: 'Building a portfolio from scratch', date: 'May 20, 2026', time: '10:00 AM', duration: '60 min', status: 'completed', outcome: 'Created action plan for GitHub portfolio projects.' },
  { id: 6, mentee: 'Sule Ibrahim', topic: 'Negotiating first tech job offer', date: 'May 5, 2026', time: '4:00 PM', duration: '30 min', status: 'cancelled', outcome: null },
]

const MentorSessionsPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)

  const filtered =
    tab === 0 ? sessions :
    tab === 1 ? sessions.filter((s) => s.status === 'upcoming') :
    tab === 2 ? sessions.filter((s) => s.status === 'completed') :
    sessions.filter((s) => s.status === 'cancelled')

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          <Chip icon={<CalendarMonthIcon />} label="Sessions" sx={{ width: 'fit-content' }} />
          <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 38 } }}>
            My Sessions
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
            View, join, and record outcomes for all your mentorship sessions.
          </Typography>
        </Stack>

        <Paper sx={PAPER_SX}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ mb: 3, borderBottom: '1px solid rgba(148,163,184,0.18)' }}
          >
            <Tab label={`All (${sessions.length})`} />
            <Tab label={`Upcoming (${sessions.filter((s) => s.status === 'upcoming').length})`} />
            <Tab label={`Completed (${sessions.filter((s) => s.status === 'completed').length})`} />
            <Tab label="Cancelled" />
          </Tabs>

          <Stack spacing={2}>
            {filtered.map((session) => (
              <Box
                key={session.id}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid rgba(148,163,184,0.18)',
                  opacity: session.status === 'cancelled' ? 0.6 : 1,
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  gap={2}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 700 }}>{session.mentee}</Typography>
                      <Chip
                        icon={
                          session.status === 'upcoming' ? <HourglassEmptyIcon /> :
                          session.status === 'completed' ? <CheckCircleIcon /> :
                          <CancelIcon />
                        }
                        label={session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        color={
                          session.status === 'upcoming' ? 'warning' :
                          session.status === 'completed' ? 'success' :
                          'error'
                        }
                        size="small"
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {session.topic}
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <CalendarMonthIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {session.date} · {session.time}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <AccessTimeIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {session.duration}
                        </Typography>
                      </Stack>
                    </Stack>
                    {session.outcome && (
                      <Box
                        sx={{
                          mt: 1.5,
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: 'rgba(18,124,113,0.06)',
                          border: '1px solid rgba(18,124,113,0.15)',
                        }}
                      >
                        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                          Outcome:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {session.outcome}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  {session.status === 'upcoming' && (
                    <Stack direction="row" spacing={1} flexShrink={0}>
                      <Button
                        variant="contained"
                        startIcon={<VideocamIcon />}
                        size="small"
                        sx={{ borderRadius: 99, textTransform: 'none', fontWeight: 700 }}
                      >
                        Join
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ borderRadius: 99, textTransform: 'none' }}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  )}
                  {session.status === 'completed' && !session.outcome && (
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: 99, textTransform: 'none', flexShrink: 0 }}
                    >
                      Add outcome
                    </Button>
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

MentorSessionsPage.getLayout = (page) => <MentorLayout>{page}</MentorLayout>

export default MentorSessionsPage
