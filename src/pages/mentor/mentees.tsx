import React from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import PeopleIcon from '@mui/icons-material/People'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import MessageIcon from '@mui/icons-material/Message'
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

const mentees = [
  { id: 1, name: 'Amina Bello', role: 'Student · ABU Zaria', sessions: 3, lastSession: 'Jun 14, 2026', rating: 5, status: 'active', initials: 'AB', color: '#127C71' },
  { id: 2, name: 'Kelechi Obi', role: 'Graduate · University of Lagos', sessions: 2, lastSession: 'Jun 10, 2026', rating: 4.5, status: 'active', initials: 'KO', color: '#082F49' },
  { id: 3, name: 'Zahra Musa', role: 'Research Assistant · BUK', sessions: 1, lastSession: 'Jun 5, 2026', rating: null, status: 'active', initials: 'ZM', color: '#7C3AED' },
  { id: 4, name: 'Tunde Adeyemi', role: 'Entrepreneur · Lagos', sessions: 4, lastSession: 'May 28, 2026', rating: 5, status: 'completed', initials: 'TA', color: '#D97706' },
  { id: 5, name: 'Ngozi Eze', role: 'Developer · Remote', sessions: 2, lastSession: 'May 20, 2026', rating: 4, status: 'completed', initials: 'NE', color: '#059669' },
]

const MenteesPage: NextPageWithLayout = () => {
  return (
    <Box>
      <PageHeader
        eyebrow="Mentees"
        title="My Mentees"
        subtitle="View all participants you have mentored and track their progress."
        icon={<PeopleIcon />}
      />

      <Grid container spacing={2.5}>
          {mentees.map((mentee) => (
            <Grid key={mentee.id} item xs={12} md={6}>
              <Paper sx={{ ...PAPER_SX, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                  <Avatar sx={{ width: 52, height: 52, backgroundColor: mentee.color, fontWeight: 700, fontSize: 18 }}>
                    {mentee.initials}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{mentee.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{mentee.role}</Typography>
                      </Box>
                      <Chip
                        label={mentee.status === 'active' ? 'Active' : 'Completed'}
                        color={mentee.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Stack>
                  </Box>
                </Stack>

                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarMonthIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {mentee.sessions} session{mentee.sessions !== 1 ? 's' : ''} · Last: {mentee.lastSession}
                    </Typography>
                  </Stack>
                  {mentee.rating && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Rating value={mentee.rating} precision={0.5} size="small" readOnly />
                      <Typography variant="caption" color="text.secondary">{mentee.rating}/5</Typography>
                    </Stack>
                  )}
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ mt: 'auto' }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ flex: 1, borderRadius: 99, textTransform: 'none', fontWeight: 700 }}
                  >
                    Book session
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<MessageIcon />}
                    sx={{ borderRadius: 99, textTransform: 'none' }}
                  >
                    Message
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
      </Grid>
    </Box>
  )
}

MenteesPage.getLayout = (page) => <MentorLayout>{page}</MentorLayout>

export default MenteesPage
