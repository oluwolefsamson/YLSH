import React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import { DashboardLayout } from '@/components/layout'
import { NextPageWithLayout } from '@/interfaces/layout'

const EventsPage: NextPageWithLayout = () => {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
        <Stack spacing={1.5}>
          <Chip icon={<EventAvailableIcon />} label="Events" sx={{ width: 'fit-content' }} />
          <Typography variant="h4">Events</Typography>
          <Typography color="text.secondary">
            Browse upcoming sessions, registrations, attendance, and venue details from here.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  )
}

EventsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default EventsPage
