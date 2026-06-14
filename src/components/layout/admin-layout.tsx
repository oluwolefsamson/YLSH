import React, { FC, ReactNode, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import BarChartIcon from '@mui/icons-material/BarChart'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import LogoutIcon from '@mui/icons-material/Logout'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ShieldIcon from '@mui/icons-material/Shield'
import { StyledButton } from '@/components/styled-button'
import { Logo } from '@/components/logo'

interface Props {
  children: ReactNode
  superAdmin?: boolean
}

const drawerWidth = 288

const adminNavItems = [
  { label: 'Overview', href: '/admin', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Users', href: '/admin/users', icon: <PeopleIcon fontSize="small" /> },
  { label: 'Events', href: '/admin/events', icon: <EventAvailableIcon fontSize="small" /> },
  { label: 'Verifications', href: '/admin/verifications', icon: <VerifiedUserIcon fontSize="small" /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChartIcon fontSize="small" /> },
]

const superAdminNavItems = [
  { label: 'Overview', href: '/super-admin', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Users', href: '/super-admin/users', icon: <PeopleIcon fontSize="small" /> },
  { label: 'Events', href: '/super-admin/events', icon: <EventAvailableIcon fontSize="small" /> },
  { label: 'Role Management', href: '/super-admin/roles', icon: <AdminPanelSettingsIcon fontSize="small" /> },
  { label: 'Analytics', href: '/super-admin/analytics', icon: <BarChartIcon fontSize="small" /> },
]

const AdminLayout: FC<Props> = ({ children, superAdmin = false }) => {
  const router = useRouter()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)

  const navItems = superAdmin ? superAdminNavItems : adminNavItems
  const portalLabel = superAdmin ? 'Super Admin' : 'Admin'
  const initials = superAdmin ? 'SA' : 'AD'
  const roleName = superAdmin ? 'System Administrator' : 'Platform Admin'

  const handleConfirmSignOut = (): void => {
    setSignOutOpen(false)
    setMobileOpen(false)
    void router.push('/signin')
  }

  const sidebar = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 3,
          background: superAdmin
            ? 'linear-gradient(135deg, rgba(30,10,60,0.98) 0%, rgba(90,40,140,0.97) 100%)'
            : 'linear-gradient(135deg, rgba(8,47,73,0.98) 0%, rgba(18,124,113,0.97) 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -30,
            right: -30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          },
        }}
      >
        <Box sx={{ mb: 2.5, position: 'relative', zIndex: 1 }}>
          <Logo />
        </Box>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Avatar sx={{ width: 40, height: 40, background: 'rgba(255,255,255,0.18)', color: 'white', fontWeight: 700, fontSize: 15, border: '2px solid rgba(255,255,255,0.25)' }}>
            {initials}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>
              {portalLabel}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <ShieldIcon sx={{ fontSize: 11, color: 'rgba(196,181,253,0.9)' }} />
              <Typography sx={{ color: 'rgba(196,181,253,0.9)', fontSize: 11, fontWeight: 600 }}>
                {roleName}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ px: 1.5, pt: 2, pb: 1, flex: 1, overflowY: 'auto' }}>
        <Typography variant="overline" sx={{ px: 1.5, color: 'text.disabled', fontSize: 10, letterSpacing: 1, fontWeight: 700 }}>
          {portalLabel} Portal
        </Typography>
        <List sx={{ mt: 0.5 }}>
          {navItems.map((item) => {
            const active = router.pathname === item.href
            const activeColor = superAdmin ? '#7c3aed' : '#127C71'
            const activeBg = superAdmin
              ? 'linear-gradient(90deg, rgba(124,58,237,0.13) 0%, rgba(124,58,237,0.04) 100%)'
              : 'linear-gradient(90deg, rgba(18,124,113,0.13) 0%, rgba(18,124,113,0.04) 100%)'
            const hoverBg = superAdmin ? 'rgba(124,58,237,0.06)' : 'rgba(18,124,113,0.06)'
            return (
              <NextLink key={item.label} href={item.href} passHref>
                <ListItemButton
                  component="a"
                  sx={{
                    mb: 0.5,
                    borderRadius: 3,
                    px: 1.5,
                    py: 1,
                    transition: 'all 0.15s ease',
                    ...(active ? {
                      background: activeBg,
                      borderLeft: `3px solid ${activeColor}`,
                      pl: '9px',
                      '& .MuiListItemIcon-root': { color: activeColor },
                      '& .MuiListItemText-primary': { color: activeColor, fontWeight: 700 },
                    } : {
                      '&:hover': {
                        background: hoverBg,
                        '& .MuiListItemIcon-root': { color: activeColor },
                      },
                    }),
                    '& .MuiListItemIcon-root': { minWidth: 36, color: active ? activeColor : 'text.secondary' },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 700 : 500 }} />
                  {active && <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: activeColor, flexShrink: 0 }} />}
                </ListItemButton>
              </NextLink>
            )
          })}
        </List>
      </Box>

      <Box sx={{ p: 1.5 }}>
        <Divider sx={{ mb: 1.5 }} />
        <ListItemButton
          onClick={() => setSignOutOpen(true)}
          sx={{
            borderRadius: 3,
            px: 1.5,
            color: 'text.secondary',
            '&:hover': { color: 'error.main', backgroundColor: 'rgba(239,68,68,0.06)' },
            '& .MuiListItemIcon-root': { minWidth: 36, color: 'inherit' },
          }}
        >
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Sign out" primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
        </ListItemButton>
      </Box>

      <Dialog open={signOutOpen} onClose={() => setSignOutOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Sign out of YLSH?</DialogTitle>
        <DialogContent>
          <DialogContentText>You will be taken back to the sign-in page.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <StyledButton type="button" variant="outlined" color="dark" disableHoverEffect onClick={() => setSignOutOpen(false)}>Cancel</StyledButton>
          <StyledButton type="button" color="primary" disableHoverEffect onClick={handleConfirmSignOut}>Sign out</StyledButton>
        </DialogActions>
      </Dialog>
    </Box>
  )

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f7f6 0%, #f3f6fb 100%)' }}>
      {!isDesktop && (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: drawerWidth, border: 'none', boxShadow: '4px 0 24px rgba(15,23,42,0.1)' } }}>
          {sidebar}
        </Drawer>
      )}
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {isDesktop && (
          <Box sx={{ width: drawerWidth, flexShrink: 0, borderRight: '1px solid rgba(148,163,184,0.14)', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
            {sidebar}
          </Box>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {!isDesktop && (
            <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(8,47,73,0.97) 0%, rgba(18,124,113,0.97) 100%)', position: 'sticky', top: 0, zIndex: theme.zIndex.appBar }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'white' }}>
                  <MenuIcon />
                </IconButton>
                <Logo />
              </Stack>
              <Chip label={portalLabel} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }} />
            </Box>
          )}
          <Container maxWidth={false} sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 4 } }}>
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

export default AdminLayout
