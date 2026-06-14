import React, { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

interface Props {
  eyebrow: string
  title: string
  subtitle?: string
  icon?: ReactNode
  action?: ReactNode
}

const PageHeader: FC<Props> = ({ eyebrow, title, subtitle, icon, action }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        mb: 4,
        p: { xs: 3, md: 4 },
        background: 'linear-gradient(135deg, rgba(8,47,73,0.97) 0%, rgba(18,124,113,0.97) 100%)',
        boxShadow: '0 20px 60px rgba(8,47,73,0.25)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -60,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -40,
          left: '40%',
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Box>
          <Chip
            icon={icon ? <Box sx={{ color: 'rgba(255,255,255,0.9) !important', display: 'flex' }}>{icon}</Box> : undefined}
            label={eyebrow}
            size="small"
            sx={{
              mb: 1.5,
              backgroundColor: 'rgba(255,255,255,0.14)',
              color: 'rgba(255,255,255,0.92)',
              border: '1px solid rgba(255,255,255,0.18)',
              fontWeight: 600,
              letterSpacing: 0.5,
              '& .MuiChip-icon': { color: 'rgba(255,255,255,0.85)' },
            }}
          />
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: { xs: 26, md: 34 },
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              mb: subtitle ? 1 : 0,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body1"
              sx={{ color: 'rgba(255,255,255,0.72)', maxWidth: 560, lineHeight: 1.6 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Stack>
    </Box>
  )
}

export default PageHeader
