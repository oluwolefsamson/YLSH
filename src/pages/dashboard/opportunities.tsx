import React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { DashboardLayout } from '@/components/layout'
import { NextPageWithLayout } from '@/interfaces/layout'

const OpportunitiesPage: NextPageWithLayout = () => {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
        <Stack spacing={1.5}>
          <Chip icon={<EmojiEventsIcon />} label="Opportunities" sx={{ width: 'fit-content' }} />
          <Typography variant="h4">Opportunities</Typography>
          <Typography color="text.secondary">
            Find internships, grants, scholarships, and job opportunities in one place.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  )
}

OpportunitiesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default OpportunitiesPage
