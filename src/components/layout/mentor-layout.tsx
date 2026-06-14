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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PeopleIcon from '@mui/icons-material/People'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import StarIcon from '@mui/icons-material/Star'
import { StyledButton } from '@/components/styled-button'
import { Logo } from '@/components/logo'

interface Props { children: ReactNode }

const drawerWidth = 288

const navItems = [
  { label: 'Overview', href: '/mentor', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Sessions', href: '/mentor/sessions', icon: <CalendarMonthIcon fontSize="small" /> },
  { label: 'Mentees', href: '/mentor/mentees', icon: <PeopleIcon fontSize="small" /> },
  { label: 'Availability', href: '/mentor/availability', icon: <AccessTimeIcon fontSize="small" /> },
  { label: 'Profile', href: '/mentor/profile', icon: <AccountCircleIcon fontSize="small" /> },
]

const MentorLayout: FC<Props> = ({ children }) => {
  const router = useRouter()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)

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
          background: 'linear-gradient(135deg, rgba(8,47,73,0.98) 0%, rgba(18,124,113,0.97) 100%)',
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
            NA
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>
              Ngozi Adeyemi
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <StarIcon sx={{ fontSize: 11, color: 'rgba(255,210,100,0.9)' }} />
              <Typography sx={{ color: 'rgba(255,210,100,0.9)', fontSize: 11, fontWeight: 600 }}>
                4.9 · Senior Mentor
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ px: 1.5, pt: 2, pb: 1, flex: 1, overflowY: 'auto' }}>
        <Typography variant="overline" sx={{ px: 1.5, color: 'text.disabled', fontSize: 10, letterSpacing: 1, fontWeight: 700 }}>
          Mentor Portal
        </Typography>
        <List sx={{ mt: 0.5 }}>
          {navItems.map((item) => {
            const active = router.pathname === item.href
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
                      background: 'linear-gradient(90deg, rgba(18,124,113,0.13) 0%, rgba(18,124,113,0.04) 100%)',
                      borderLeft: '3px solid #127C71',
                      pl: '9px',
                      '& .MuiListItemIcon-root': { color: '#127C71' },
                      '& .MuiListItemText-primary': { color: '#127C71', fontWeight: 700 },
                    } : {
                      '&:hover': {
                        background: 'rgba(18,124,113,0.06)',
                        '& .MuiListItemIcon-root': { color: '#127C71' },
                      },
                    }),
                    '& .MuiListItemIcon-root': { minWidth: 36, color: active ? '#127C71' : 'text.secondary' },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 700 : 500 }} />
                  {active && <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#127C71', flexShrink: 0 }} />}
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
              <Chip label="Mentor" size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }} />
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

export default MentorLayout
