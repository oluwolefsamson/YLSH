import React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import BarChartIcon from '@mui/icons-material/BarChart'
import PeopleIcon from '@mui/icons-material/People'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import SchoolIcon from '@mui/icons-material/School'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { AdminLayout } from '@/components/layout'
import { NextPageWithLayout } from '@/interfaces/layout'

const PAPER_SX = {
  p: { xs: 2.5, md: 3 },
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.82)',
  border: '1px solid rgba(148,163,184,0.18)',
  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
}

const kpis = [
  { label: 'Total users', value: '4,821', change: '+318 this month', icon: <PeopleIcon />, pct: 48 },
  { label: 'Verified users', value: '3,940', change: '81.7% verification rate', icon: <VerifiedUserIcon />, pct: 82 },
  { label: 'Events hosted', value: '28', change: '+4 this quarter', icon: <EventAvailableIcon />, pct: 70 },
  { label: 'Certificates issued', value: '3,104', change: '+87 this month', icon: <WorkspacePremiumIcon />, pct: 62 },
  { label: 'Mentorship sessions', value: '891', change: '+43 this month', icon: <SchoolIcon />, pct: 55 },
  { label: 'Attendance rate', value: '78%', change: 'Across all events', icon: <TrendingUpIcon />, pct: 78 },
]

const topEvents = [
  { title: 'Youth Leadership Summit 2025', attendees: 468, capacity: 500, certificates: 462 },
  { title: 'Digital Skills Bootcamp', attendees: 148, capacity: 150, certificates: 148 },
  { title: 'Entrepreneurship Masterclass', attendees: 289, capacity: 300, certificates: 280 },
  { title: 'Climate Action Workshop', attendees: 175, capacity: 200, certificates: 170 },
]

const userGrowth = [
  { month: 'Jan 2026', count: 3200 },
  { month: 'Feb 2026', count: 3410 },
  { month: 'Mar 2026', count: 3680 },
  { month: 'Apr 2026', count: 3890 },
  { month: 'May 2026', count: 4120 },
  { month: 'Jun 2026', count: 4821 },
]

const AdminAnalyticsPage: NextPageWithLayout = () => {
  const maxCount = Math.max(...userGrowth.map((d) => d.count))

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          <Chip icon={<BarChartIcon />} label="Analytics" sx={{ width: 'fit-content' }} />
          <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 38 } }}>
            Platform Analytics
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
            User growth, verification rate, event attendance, certificate issuance, and engagement
            metrics across the YLSH platform.
          </Typography>
        </Stack>

        {/* KPI grid */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {kpis.map((kpi) => (
            <Grid key={kpi.label} item xs={12} sm={6} lg={4}>
              <Paper sx={PAPER_SX}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
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
                    {kpi.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">{kpi.label}</Typography>
                    <Typography variant="h4" sx={{ fontSize: 26, fontWeight: 700 }}>{kpi.value}</Typography>
                  </Box>
                </Stack>
                <LinearProgress variant="determinate" value={kpi.pct} sx={{ height: 6, borderRadius: 99, mb: 1 }} />
                <Typography variant="caption" color="text.secondary">{kpi.change}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* User growth chart (bar) */}
          <Grid item xs={12} md={6}>
            <Paper sx={PAPER_SX}>
              <Typography variant="h5" sx={{ mb: 3, fontSize: 20 }}>User Growth (2026)</Typography>
              <Stack spacing={1.5}>
                {userGrowth.map((row) => (
                  <Box key={row.month}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">{row.month}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {row.count.toLocaleString()}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={(row.count / maxCount) * 100}
                      sx={{ height: 10, borderRadius: 99 }}
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Top events */}
          <Grid item xs={12} md={6}>
            <Paper sx={PAPER_SX}>
              <Typography variant="h5" sx={{ mb: 3, fontSize: 20 }}>Top Events by Attendance</Typography>
              <Stack spacing={2.5}>
                {topEvents.map((event) => (
                  <Box key={event.title}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 14, flex: 1, pr: 2 }}>
                        {event.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                        {event.attendees}/{event.capacity}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={(event.attendees / event.capacity) * 100}
                      sx={{ height: 8, borderRadius: 99, mb: 0.5 }}
                    />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" color="text.secondary">
                        {Math.round((event.attendees / event.capacity) * 100)}% attendance
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {event.certificates} certificates issued
                      </Typography>
                    </Stack>
                    <Divider sx={{ mt: 1.5 }} />
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

AdminAnalyticsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>

export default AdminAnalyticsPage
