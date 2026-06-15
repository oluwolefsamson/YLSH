import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import EditIcon from '@mui/icons-material/Edit'
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

const roles = [
  {
    name: 'Participant',
    count: 4,
    color: 'default' as const,
    permissions: ['Register for events', 'View and download certificates', 'Access learning resources', 'Apply to opportunities', 'Book mentorship sessions'],
  },
  {
    name: 'Mentor',
    count: 47,
    color: 'success' as const,
    permissions: ['All Participant permissions', 'Manage mentorship sessions', 'Set availability', 'View assigned mentees'],
  },
  {
    name: 'Admin',
    count: 5,
    color: 'primary' as const,
    permissions: ['All Mentor permissions', 'Manage users and events', 'Issue certificates', 'View analytics', 'Handle identity verifications'],
  },
  {
    name: 'Super Admin',
    count: 1,
    color: 'error' as const,
    permissions: ['Full system access', 'Manage admin accounts', 'Assign/revoke roles', 'View audit logs', 'System configuration'],
  },
]

const users = [
  { id: 1, name: 'Amina Bello', email: 'amina@example.com', role: 'Participant' },
  { id: 2, name: 'Emeka Obi', email: 'emeka@example.com', role: 'Participant' },
  { id: 3, name: 'Fatima Al-Hassan', email: 'fatima@example.com', role: 'Mentor' },
  { id: 4, name: 'Obiora Chukwu', email: 'obiora@ylsh.org', role: 'Admin' },
  { id: 5, name: 'Aisha Mohammed', email: 'aisha@ylsh.org', role: 'Super Admin' },
]

const RoleManagementPage: NextPageWithLayout = () => {
  const [editUser, setEditUser] = useState<typeof users[0] | null>(null)
  const [newRole, setNewRole] = useState('')

  return (
    <Box>
      <PageHeader
        eyebrow="Role Management"
        title="Role Management"
        subtitle="View the RBAC matrix and assign or revoke roles for any user account."
        icon={<AdminPanelSettingsIcon />}
      />

      {/* RBAC matrix */}
      <Paper sx={{ ...PAPER_SX, mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontSize: 22 }}>RBAC Matrix</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
            {roles.map((role) => (
              <Box
                key={role.name}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid rgba(148,163,184,0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Chip label={role.name} color={role.color} size="small" />
                  <Typography variant="caption" color="text.secondary">{role.count} users</Typography>
                </Stack>
                <Stack spacing={0.75}>
                  {role.permissions.map((perm) => (
                    <Typography key={perm} variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      · {perm}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* User role assignments */}
        <Paper sx={PAPER_SX}>
          <Typography variant="h5" sx={{ mb: 3, fontSize: 22 }}>User Role Assignments</Typography>
          <Stack spacing={1.5}>
            {users.map((user) => (
              <Box
                key={user.id}
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
                  <Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                </Box>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Chip
                    label={user.role}
                    color={
                      user.role === 'Super Admin' ? 'error' :
                      user.role === 'Admin' ? 'primary' :
                      user.role === 'Mentor' ? 'success' :
                      'default'
                    }
                    size="small"
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    sx={{ borderRadius: 99, textTransform: 'none' }}
                    onClick={() => { setEditUser(user); setNewRole(user.role) }}
                  >
                    Change role
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>


      {/* Edit role dialog */}
      <Dialog open={Boolean(editUser)} onClose={() => setEditUser(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Change role for {editUser?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              label="User"
              value={editUser?.email ?? ''}
              disabled
              fullWidth
              size="small"
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>New role</InputLabel>
              <Select
                value={newRole}
                label="New role"
                onChange={(e) => setNewRole(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {['Participant', 'Mentor', 'Admin', 'Super Admin'].map((r) => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => setEditUser(null)} sx={{ borderRadius: 99, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => setEditUser(null)}
            sx={{ borderRadius: 99, textTransform: 'none', fontWeight: 700 }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

RoleManagementPage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>

export default RoleManagementPage
