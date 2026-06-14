import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PeopleIcon from '@mui/icons-material/People'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import SchoolIcon from '@mui/icons-material/School'
import SecurityIcon from '@mui/icons-material/Security'
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

const stats = [
  { label: 'Total users', value: '4,821', progress: 48, icon: <PeopleIcon /> },
  { label: 'Verified', value: '3,940', progress: 82, icon: <VerifiedUserIcon /> },
  { label: 'Events', value: '28', progress: 70, icon: <EventAvailableIcon /> },
  { label: 'Certificates', value: '3,104', progress: 62, icon: <WorkspacePremiumIcon /> },
  { label: 'Mentors', value: '47', progress: 55, icon: <SchoolIcon /> },
  { label: 'Admins', value: '6', progress: 30, icon: <AdminPanelSettingsIcon /> },
]

const adminAccounts = [
  { name: 'Obiora Chukwu', email: 'obiora@ylsh.org', role: 'Admin', lastActive: '1 hr ago', status: 'active' },
  { name: 'Mariam Suleiman', email: 'mariam@ylsh.org', role: 'Admin', lastActive: '3 hrs ago', status: 'active' },
  { name: 'Emeka Nwofor', email: 'emeka.n@ylsh.org', role: 'Admin', lastActive: 'Yesterday', status: 'active' },
  { name: 'Aisha Mohammed', email: 'aisha@ylsh.org', role: 'Super Admin', lastActive: 'Now', status: 'active' },
]

const auditLog = [
  { action: 'Role changed: emeka.n@ylsh.org → Admin', actor: 'aisha@ylsh.org', time: '2 hrs ago' },
  { action: 'User suspended: zahra@example.com', actor: 'mariam@ylsh.org', time: '5 hrs ago' },
  { action: 'New event created: Youth Leadership Summit 2026', actor: 'obiora@ylsh.org', time: 'Yesterday' },
  { action: 'Certificate batch issued: 87 records', actor: 'System (BullMQ)', time: 'Yesterday' },
  { action: 'NIN verification cleared: batch 412', actor: 'System', time: '2 days ago' },
]

const SuperAdminOverviewPage: NextPageWithLayout = () => {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          <Chip icon={<SecurityIcon />} label="Super Admin portal" sx={{ width: 'fit-content' }} />
          <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 40 } }}>
            Super Admin Overview
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
            Full system access — manage all users, admins, roles, events, and view platform-wide
            audit logs.
          </Typography>
        </Stack>

        {/* Stats */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {stats.map((card) => (
            <Grid key={card.label} item xs={12} sm={6} lg={4}>
              <Paper sx={PAPER_SX}>
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
                    <Typography variant="subtitle2" color="text.secondary">{card.label}</Typography>
                    <Typography variant="h4" sx={{ fontSize: 26, fontWeight: 700 }}>{card.value}</Typography>
                  </Box>
                </Stack>
                <LinearProgress variant="determinate" value={card.progress} sx={{ height: 7, borderRadius: 99 }} />
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Admin accounts */}
          <Grid item xs={12} lg={6}>
            <Paper sx={PAPER_SX}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                <Typography variant="h5" sx={{ fontSize: 22 }}>Admin Accounts</Typography>
                <Button variant="contained" size="small" sx={{ borderRadius: 99, textTransform: 'none', fontWeight: 700 }}>
                  + Add admin
                </Button>
              </Stack>
              <Stack spacing={1.5}>
                {adminAccounts.map((admin) => (
                  <Box
                    key={admin.email}
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
                      <Typography sx={{ fontWeight: 700 }}>{admin.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{admin.email}</Typography>
                      <Typography variant="caption" color="text.secondary">Last active: {admin.lastActive}</Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={admin.role}
                        color={admin.role === 'Super Admin' ? 'primary' : 'default'}
                        size="small"
                      />
                      <Button size="small" variant="outlined" sx={{ borderRadius: 99, textTransform: 'none' }}>
                        Edit
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Audit log */}
          <Grid item xs={12} lg={6}>
            <Paper
              sx={{
                ...PAPER_SX,
                background: 'linear-gradient(135deg, rgba(8,47,73,0.98) 0%, rgba(18,124,113,0.98) 100%)',
                color: 'common.white',
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                <SecurityIcon />
                <Typography variant="h5" sx={{ fontSize: 22 }}>Audit Log</Typography>
              </Stack>
              <Stack spacing={1.5}>
                {auditLog.map((entry, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {entry.action}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        by {entry.actor}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {entry.time}
                      </Typography>
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

SuperAdminOverviewPage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>

export default SuperAdminOverviewPage
