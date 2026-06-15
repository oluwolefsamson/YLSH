import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import SearchIcon from '@mui/icons-material/Search'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import CancelIcon from '@mui/icons-material/Cancel'
import BadgeIcon from '@mui/icons-material/Badge'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
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

const verifications = [
  { id: 1, name: 'Amina Bello', email: 'amina.bello@example.com', ninRef: 'NIN-REF-****8821', submittedDate: 'Jun 14, 2026', status: 'verified' },
  { id: 2, name: 'Emeka Obi', email: 'emeka.obi@example.com', ninRef: 'NIN-REF-****4412', submittedDate: 'Jun 13, 2026', status: 'pending' },
  { id: 3, name: 'Zahra Musa', email: 'zahra@example.com', ninRef: 'NIN-REF-****7734', submittedDate: 'Jun 12, 2026', status: 'pending' },
  { id: 4, name: 'Kelechi Obi', email: 'kelechi@example.com', ninRef: 'NIN-REF-****2290', submittedDate: 'Jun 11, 2026', status: 'verified' },
  { id: 5, name: 'Sule Ibrahim', email: 'sule@example.com', ninRef: 'NIN-REF-****5561', submittedDate: 'Jun 10, 2026', status: 'rejected' },
  { id: 6, name: 'Ngozi Eze', email: 'ngozi@example.com', ninRef: 'NIN-REF-****3317', submittedDate: 'Jun 9, 2026', status: 'verified' },
  { id: 7, name: 'Tunde Adeyemi', email: 'tunde@example.com', ninRef: 'NIN-REF-****9945', submittedDate: 'Jun 8, 2026', status: 'pending' },
]

const statusColor: Record<string, 'success' | 'warning' | 'error'> = {
  verified: 'success', pending: 'warning', rejected: 'error',
}

const statusIcon: Record<string, React.ReactNode> = {
  verified: <CheckCircleIcon />,
  pending: <HourglassEmptyIcon />,
  rejected: <CancelIcon />,
}

const AdminVerificationsPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')

  const filtered = verifications
    .filter((v) => tab === 0 ? true : tab === 1 ? v.status === 'pending' : tab === 2 ? v.status === 'verified' : v.status === 'rejected')
    .filter((v) => search === '' || v.name.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <Box>
      <PageHeader
        eyebrow="Verifications"
        title="NIN Verifications"
        subtitle="Review and action NIN identity verification submissions. Raw NIN values are never stored — only encrypted references."
        icon={<VerifiedUserIcon />}
      />

      {/* Stats */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard label="Total submissions" value={String(verifications.length)} icon={<BadgeIcon />} progress={100} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="Pending review" value={String(verifications.filter((v) => v.status === 'pending').length)} icon={<HourglassEmptyIcon />} progress={33} accent="#f59e0b" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="Verified" value={String(verifications.filter((v) => v.status === 'verified').length)} icon={<CheckCircleIcon />} progress={55} accent="#22c55e" />
        </Grid>
      </Grid>
      <Paper sx={PAPER_SX}>
          <TextField
            placeholder="Search by name or email…"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3, maxWidth: 360, '& .MuiOutlinedInput-root': { borderRadius: 99 } }}
          />

          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: '1px solid rgba(148,163,184,0.18)' }}>
            <Tab label={`All (${verifications.length})`} />
            <Tab label={`Pending (${verifications.filter((v) => v.status === 'pending').length})`} />
            <Tab label={`Verified (${verifications.filter((v) => v.status === 'verified').length})`} />
            <Tab label={`Rejected (${verifications.filter((v) => v.status === 'rejected').length})`} />
          </Tabs>

          <Stack spacing={1.5}>
            {filtered.map((v) => (
              <Box key={v.id} sx={{ p: 2.5, borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700 }}>{v.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{v.email}</Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 0.75 }}>
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <BadgeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>{v.ninRef}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <CalendarMonthIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">{v.submittedDate}</Typography>
                    </Stack>
                  </Stack>
                </Box>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Chip
                    icon={statusIcon[v.status] as React.ReactElement}
                    label={v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                    color={statusColor[v.status]}
                    size="small"
                  />
                  {v.status === 'pending' && (
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="contained" sx={{ borderRadius: 99, textTransform: 'none', fontWeight: 700 }}>Approve</Button>
                      <Button size="small" variant="outlined" color="error" sx={{ borderRadius: 99, textTransform: 'none' }}>Reject</Button>
                    </Stack>
                  )}
                </Stack>
              </Box>
            ))}
            {filtered.length === 0 && (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">No records match your search.</Typography>
              </Box>
            )}
          </Stack>
        </Paper>

    </Box>
  )
}

AdminVerificationsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>

export default AdminVerificationsPage
