import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import PeopleIcon from '@mui/icons-material/People'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import BlockIcon from '@mui/icons-material/Block'
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

const allUsers = [
  { id: 1, name: 'Amina Bello', email: 'amina@example.com', role: 'Participant', status: 'verified', joined: 'Jun 14, 2026', state: 'Kaduna' },
  { id: 2, name: 'Emeka Obi', email: 'emeka@example.com', role: 'Participant', status: 'pending', joined: 'Jun 13, 2026', state: 'Lagos' },
  { id: 3, name: 'Fatima Al-Hassan', email: 'fatima@example.com', role: 'Mentor', status: 'verified', joined: 'Jun 12, 2026', state: 'Abuja' },
  { id: 4, name: 'Obiora Chukwu', email: 'obiora@ylsh.org', role: 'Admin', status: 'verified', joined: 'Jan 1, 2026', state: 'Enugu' },
  { id: 5, name: 'Aisha Mohammed', email: 'aisha@ylsh.org', role: 'Super Admin', status: 'verified', joined: 'Jan 1, 2026', state: 'Abuja' },
  { id: 6, name: 'Zahra Musa', email: 'zahra@example.com', role: 'Participant', status: 'suspended', joined: 'Jun 10, 2026', state: 'Kano' },
  { id: 7, name: 'Tunde Adeyemi', email: 'tunde@example.com', role: 'Mentor', status: 'verified', joined: 'Jun 9, 2026', state: 'Lagos' },
  { id: 8, name: 'Sule Ibrahim', email: 'sule@example.com', role: 'Participant', status: 'pending', joined: 'Jun 7, 2026', state: 'Katsina' },
]

const statusColor: Record<string, 'success' | 'warning' | 'error'> = {
  verified: 'success', pending: 'warning', suspended: 'error',
}

const statusIcon: Record<string, React.ReactNode> = {
  verified: <CheckCircleIcon />, pending: <HourglassEmptyIcon />, suspended: <BlockIcon />,
}

const roleColor: Record<string, 'primary' | 'error' | 'success' | 'default'> = {
  'Super Admin': 'error', Admin: 'primary', Mentor: 'success', Participant: 'default',
}

const SuperAdminUsersPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  const filtered = allUsers
    .filter((u) => tab === 0 ? true : tab === 1 ? u.status === 'verified' : tab === 2 ? u.status === 'pending' : u.status === 'suspended')
    .filter((u) => search === '' || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <Box>
      <PageHeader
        eyebrow="All Users"
        title="Users"
        subtitle="Full system access to all user accounts across every role — Participant, Mentor, Admin, and Super Admin."
        icon={<PeopleIcon />}
      />

      <Paper sx={PAPER_SX}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
            <TextField
              placeholder="Search by name or email…"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment> }}
              sx={{ flex: 1, maxWidth: 360, '& .MuiOutlinedInput-root': { borderRadius: 99 } }}
            />
            <Button variant="contained" size="small" sx={{ borderRadius: 99, textTransform: 'none', fontWeight: 700 }}>
              + Invite user
            </Button>
          </Stack>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: '1px solid rgba(148,163,184,0.18)' }}>
            <Tab label={`All (${allUsers.length})`} />
            <Tab label={`Verified (${allUsers.filter((u) => u.status === 'verified').length})`} />
            <Tab label={`Pending (${allUsers.filter((u) => u.status === 'pending').length})`} />
            <Tab label={`Suspended (${allUsers.filter((u) => u.status === 'suspended').length})`} />
          </Tabs>

          <Stack spacing={1.5}>
            {filtered.map((user) => (
              <Box key={user.id} sx={{ p: 2, borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{user.email} · {user.state}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                    <Chip label={user.role} color={roleColor[user.role]} size="small" />
                    <Typography variant="caption" color="text.secondary">Joined {user.joined}</Typography>
                  </Stack>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    icon={statusIcon[user.status] as React.ReactElement}
                    label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    color={statusColor[user.status]}
                    size="small"
                  />
                  <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            ))}
            {filtered.length === 0 && (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">No users match your search.</Typography>
              </Box>
            )}
          </Stack>
        </Paper>

        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
          <MenuItem onClick={() => setMenuAnchor(null)}>View profile</MenuItem>
          <MenuItem onClick={() => setMenuAnchor(null)}>Change role</MenuItem>
          <MenuItem onClick={() => setMenuAnchor(null)}>Suspend account</MenuItem>
          <MenuItem onClick={() => setMenuAnchor(null)} sx={{ color: 'error.main' }}>Delete account</MenuItem>
        </Menu>

    </Box>
  )
}

SuperAdminUsersPage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>

export default SuperAdminUsersPage
