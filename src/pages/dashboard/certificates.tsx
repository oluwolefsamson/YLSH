import React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import { DashboardLayout } from '@/components/layout'
import { NextPageWithLayout } from '@/interfaces/layout'

const CertificatesPage: NextPageWithLayout = () => {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
        <Stack spacing={1.5}>
          <Chip icon={<WorkspacePremiumIcon />} label="Certificates" sx={{ width: 'fit-content' }} />
          <Typography variant="h4">Certificates</Typography>
          <Typography color="text.secondary">
            View issued certificates, download records, and check verification status.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  )
}

CertificatesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default CertificatesPage
