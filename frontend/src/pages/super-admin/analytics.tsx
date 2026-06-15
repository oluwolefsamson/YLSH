import React from 'react'
import Box from '@mui/material/Box'
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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { AdminLayout } from '@/components/layout'
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

const kpis = [
  { label: 'Total users', value: '4,821', change: '+318 this month', icon: <PeopleIcon />, pct: 48 },
  { label: 'Verified users', value: '3,940', change: '81.7% verification rate', icon: <VerifiedUserIcon />, pct: 82 },
  { label: 'Events hosted', value: '28', change: '+4 this quarter', icon: <EventAvailableIcon />, pct: 70 },
  { label: 'Certificates issued', value: '3,104', change: '+87 this month', icon: <WorkspacePremiumIcon />, pct: 62 },
  { label: 'Mentorship sessions', value: '891', change: '+43 this month', icon: <SchoolIcon />, pct: 55 },
  { label: 'Admin accounts', value: '6', change: '1 Super Admin · 5 Admins', icon: <AdminPanelSettingsIcon />, pct: 30 },
]

const roleDistribution = [
  { role: 'Participant', count: 4727, pct: 98 },
  { role: 'Mentor', count: 47, pct: 1 },
  { role: 'Admin', count: 5, pct: 0.1 },
  { role: 'Super Admin', count: 1, pct: 0.02 },
]

const userGrowth = [
  { month: 'Jan 2026', count: 3200 },
  { month: 'Feb 2026', count: 3410 },
  { month: 'Mar 2026', count: 3680 },
  { month: 'Apr 2026', count: 3890 },
  { month: 'May 2026', count: 4120 },
  { month: 'Jun 2026', count: 4821 },
]

const topStates = [
  { state: 'Lagos', users: 1241 },
  { state: 'Abuja (FCT)', users: 892 },
  { state: 'Kano', users: 634 },
  { state: 'Rivers', users: 521 },
  { state: 'Kaduna', users: 488 },
]

const SuperAdminAnalyticsPage: NextPageWithLayout = () => {
  const maxCount = Math.max(...userGrowth.map((d) => d.count))
  const maxState = Math.max(...topStates.map((s) => s.users))

  return (
    <Box>
      <PageHeader
        eyebrow="System Analytics"
        title="Platform Analytics"
        subtitle="Full system-wide metrics — user growth, role distribution, verification rates, event performance, and geographic reach."
        icon={<BarChartIcon />}
      />

      {/* KPIs */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {kpis.map((kpi) => (
            <Grid key={kpi.label} item xs={12} sm={6} lg={4}>
              <Paper sx={PAPER_SX}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Box sx={{ width: 42, height: 42, borderRadius: '12px', display: 'grid', placeItems: 'center', backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
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
          {/* User growth */}
          <Grid item xs={12} md={4}>
            <Paper sx={PAPER_SX}>
              <Typography variant="h5" sx={{ mb: 3, fontSize: 20 }}>User Growth (2026)</Typography>
              <Stack spacing={1.5}>
                {userGrowth.map((row) => (
                  <Box key={row.month}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">{row.month}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.count.toLocaleString()}</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={(row.count / maxCount) * 100} sx={{ height: 8, borderRadius: 99 }} />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Role distribution */}
          <Grid item xs={12} md={4}>
            <Paper sx={PAPER_SX}>
              <Typography variant="h5" sx={{ mb: 3, fontSize: 20 }}>Role Distribution</Typography>
              <Stack spacing={2.5}>
                {roleDistribution.map((r) => (
                  <Box key={r.role}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.role}</Typography>
                      <Typography variant="body2" color="text.secondary">{r.count.toLocaleString()}</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={Math.max(r.pct, 2)} sx={{ height: 8, borderRadius: 99 }} />
                    <Divider sx={{ mt: 1.5 }} />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Geographic reach */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ ...PAPER_SX, background: 'linear-gradient(135deg, rgba(8,47,73,0.98) 0%, rgba(18,124,113,0.98) 100%)', color: 'common.white' }}>
              <Typography variant="h5" sx={{ mb: 3, fontSize: 20 }}>Top States</Typography>
              <Stack spacing={2}>
                {topStates.map((s, i) => (
                  <Box key={s.state}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', minWidth: 20 }}>#{i + 1}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{s.state}</Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>{s.users.toLocaleString()}</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={(s.users / maxState) * 100}
                      sx={{ height: 5, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.15)', '& .MuiLinearProgress-bar': { backgroundColor: 'rgba(134,239,172,0.8)' } }}
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

    </Box>
  )
}

SuperAdminAnalyticsPage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>

export default SuperAdminAnalyticsPage
