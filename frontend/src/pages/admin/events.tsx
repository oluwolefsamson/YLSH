import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PeopleIcon from '@mui/icons-material/People'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import IconButton from '@mui/material/IconButton'
import { AdminLayout } from '@/components/layout'
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

const events = [
  { id: 1, title: 'Youth Leadership Summit 2026', date: 'Jul 15, 2026', venue: 'Transcorp Hilton, Abuja', category: 'Summit', capacity: 500, registered: 412, status: 'upcoming' },
  { id: 2, title: 'Digital Skills Bootcamp', date: 'Jun 28, 2026', venue: 'Co-Creation Hub, Lagos', category: 'Workshop', capacity: 150, registered: 148, status: 'upcoming' },
  { id: 3, title: 'Entrepreneurship Masterclass', date: 'Jun 20, 2026', venue: 'Virtual (Zoom)', category: 'Masterclass', capacity: 300, registered: 300, status: 'upcoming' },
  { id: 4, title: 'Climate Action Workshop', date: 'May 10, 2026', venue: 'University of Lagos', category: 'Workshop', capacity: 200, registered: 185, status: 'past' },
  { id: 5, title: 'Youth Innovation Forum', date: 'Apr 5, 2026', venue: 'Eko Hotel, Lagos', category: 'Forum', capacity: 400, registered: 380, status: 'past' },
]

const categoryColor: Record<string, 'primary' | 'success' | 'warning' | 'default'> = {
  Summit: 'primary', Workshop: 'success', Masterclass: 'warning', Forum: 'default',
}

const AdminEventsPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  const filtered =
    tab === 0 ? events :
    tab === 1 ? events.filter((e) => e.status === 'upcoming') :
    events.filter((e) => e.status === 'past')

  return (
    <Box>
      <PageHeader
        eyebrow="Event Management"
        title="Events"
        subtitle="Create, edit, and manage all YLSH events and sessions."
        icon={<EventAvailableIcon />}
        action={
          <Button variant="outlined" startIcon={<AddIcon />} sx={{ borderRadius: 99, textTransform: 'none', fontWeight: 700, color: 'white', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' } }}>
            Create event
          </Button>
        }
      />

      {/* Stats */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard label="Total events" value={String(events.length)} icon={<EventAvailableIcon />} progress={100} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="Upcoming" value={String(events.filter((e) => e.status === 'upcoming').length)} icon={<CalendarMonthIcon />} progress={60} accent="#3b82f6" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="Total registered" value={events.reduce((s, e) => s + e.registered, 0).toLocaleString()} icon={<PeopleIcon />} progress={75} accent="#f59e0b" />
        </Grid>
      </Grid>
      <Paper sx={PAPER_SX}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: '1px solid rgba(148,163,184,0.18)' }}>
            <Tab label={`All (${events.length})`} />
            <Tab label={`Upcoming (${events.filter((e) => e.status === 'upcoming').length})`} />
            <Tab label={`Past (${events.filter((e) => e.status === 'past').length})`} />
          </Tabs>

          <Stack spacing={2}>
            {filtered.map((event) => (
              <Box key={event.id} sx={{ p: 2.5, borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Typography sx={{ fontWeight: 700 }}>{event.title}</Typography>
                      <Chip label={event.category} color={categoryColor[event.category]} size="small" />
                      <Chip label={event.status} color={event.status === 'upcoming' ? 'success' : 'default'} size="small" variant="outlined" />
                    </Stack>
                    <Stack direction="row" spacing={3} flexWrap="wrap">
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <CalendarMonthIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">{event.date}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <LocationOnIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">{event.venue}</Typography>
                      </Stack>
                    </Stack>
                    <Box sx={{ mt: 1.5 }}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Registration</Typography>
                        <Typography variant="caption" color="text.secondary">{event.registered}/{event.capacity}</Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={(event.registered / event.capacity) * 100} sx={{ height: 6, borderRadius: 99 }} />
                    </Box>
                  </Box>
                  <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
          <MenuItem onClick={() => setMenuAnchor(null)}>View details</MenuItem>
          <MenuItem onClick={() => setMenuAnchor(null)}>Edit event</MenuItem>
          <MenuItem onClick={() => setMenuAnchor(null)}>Export attendees</MenuItem>
          <MenuItem onClick={() => setMenuAnchor(null)} sx={{ color: 'error.main' }}>Delete event</MenuItem>
      </Menu>
    </Box>
  )
}

AdminEventsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>

export default AdminEventsPage
