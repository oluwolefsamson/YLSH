import React, { FC, ReactNode, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import Box from '@mui/material/Box'
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
import { StyledButton } from '@/components/styled-button'
import { Logo } from '@/components/logo'

interface Props {
  children: ReactNode
  superAdmin?: boolean
}

const drawerWidth = 280

const adminNavItems = [
  { label: 'Overview', href: '/admin', icon: <DashboardIcon /> },
  { label: 'Users', href: '/admin/users', icon: <PeopleIcon /> },
  { label: 'Events', href: '/admin/events', icon: <EventAvailableIcon /> },
  { label: 'Verifications', href: '/admin/verifications', icon: <VerifiedUserIcon /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChartIcon /> },
]

const superAdminNavItems = [
  { label: 'Overview', href: '/super-admin', icon: <DashboardIcon /> },
  { label: 'Users', href: '/super-admin/users', icon: <PeopleIcon /> },
  { label: 'Events', href: '/super-admin/events', icon: <EventAvailableIcon /> },
  { label: 'Role Management', href: '/super-admin/roles', icon: <AdminPanelSettingsIcon /> },
  { label: 'Analytics', href: '/super-admin/analytics', icon: <BarChartIcon /> },
]

const AdminLayout: FC<Props> = ({ children, superAdmin = false }) => {
  const router = useRouter()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)

  const navItems = superAdmin ? superAdminNavItems : adminNavItems
  const portalLabel = superAdmin ? 'Super Admin' : 'Admin'

  const handleConfirmSignOut = (): void => {
    setSignOutOpen(false)
    setMobileOpen(false)
    void router.push('/signin')
  }

  const sidebar = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 3 }}>
      <Box sx={{ px: 3, mb: 3 }}>
        <Logo />
      </Box>
      <Box sx={{ px: 3, mb: 2 }}>
        <Typography variant="overline" color="text.secondary">
          {portalLabel} portal
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          YLSH {portalLabel}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {navItems.map((item) => (
          <NextLink key={item.label} href={item.href} passHref>
            <ListItemButton
              component="a"
              selected={router.pathname === item.href}
              sx={{
                mb: 0.5,
                borderRadius: 3,
                mx: 1,
                '& .MuiListItemIcon-root': { minWidth: 40 },
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                  '&:hover': { backgroundColor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </NextLink>
        ))}
      </List>
      <Box sx={{ px: 2 }}>
        <ListItemButton
          onClick={() => setSignOutOpen(true)}
          sx={{
            borderRadius: 3,
            mx: 1,
            color: 'text.secondary',
            '& .MuiListItemIcon-root': { minWidth: 40, color: 'inherit' },
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sign out" />
        </ListItemButton>
      </Box>

      <Dialog open={signOutOpen} onClose={() => setSignOutOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Sign out of YLSH?</DialogTitle>
        <DialogContent>
          <DialogContentText>You will be taken back to the login page.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <StyledButton type="button" variant="outlined" color="dark" disableHoverEffect onClick={() => setSignOutOpen(false)}>
            Cancel
          </StyledButton>
          <StyledButton type="button" color="primary" disableHoverEffect onClick={handleConfirmSignOut}>
            Confirm
          </StyledButton>
        </DialogActions>
      </Dialog>
    </Box>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {!isDesktop && (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: drawerWidth } }}>
          {sidebar}
        </Drawer>
      )}
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {isDesktop && (
          <Box
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              borderRight: '1px solid rgba(148,163,184,0.18)',
              backgroundColor: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(18px)',
            }}
          >
            {sidebar}
          </Box>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {!isDesktop && (
            <Box
              sx={{
                px: 2,
                py: 2,
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid rgba(148,163,184,0.18)',
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(18px)',
                position: 'sticky',
                top: 0,
                zIndex: theme.zIndex.appBar,
              }}
            >
              <IconButton onClick={() => setMobileOpen(true)} sx={{ mr: 1.5 }}>
                <MenuIcon />
              </IconButton>
              <Logo />
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
