import React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import SchoolIcon from '@mui/icons-material/School'
import { DashboardLayout } from '@/components/layout'
import { NextPageWithLayout } from '@/interfaces/layout'

const LearningPage: NextPageWithLayout = () => {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
        <Stack spacing={1.5}>
          <Chip icon={<SchoolIcon />} label="Learning" sx={{ width: 'fit-content' }} />
          <Typography variant="h4">Learning</Typography>
          <Typography color="text.secondary">
            Access courses, PDFs, videos, mentorship resources, and study progress.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  )
}

LearningPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default LearningPage
