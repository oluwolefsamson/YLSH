import React, { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

interface Props {
  title: string
  subtitle: string
  children: ReactNode
}

const AuthFormCard: FC<Props> = ({ title, subtitle, children }) => {
  return (
    <Box>
      <Stack spacing={1} sx={{ mb: 3.2 }}>
        <Typography variant="h4" sx={{ fontSize: { xs: 26, md: 31 }, fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.75, maxWidth: 520 }}>
          {subtitle}
        </Typography>
      </Stack>
      {children}
    </Box>
  )
}

export default AuthFormCard
