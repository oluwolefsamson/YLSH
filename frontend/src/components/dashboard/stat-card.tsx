import React, { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

interface Props {
  label: string
  value: string
  icon: ReactNode
  progress?: number
  change?: string
  accent?: string
}

const StatCard: FC<Props> = ({ label, value, icon, progress, change, accent = '#127C71' }) => {
  return (
    <Paper
      sx={{
        p: 2.5,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(148,163,184,0.16)',
        boxShadow: '0 12px 30px rgba(15,23,42,0.06)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 18px 40px rgba(15,23,42,0.1)',
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: progress !== undefined ? 2 : 0 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            display: 'grid',
            placeItems: 'center',
            background: `linear-gradient(135deg, ${accent}dd 0%, ${accent} 100%)`,
            color: 'white',
            boxShadow: `0 6px 18px ${accent}33`,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ fontWeight: 500, mb: 0.25, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            {label}
          </Typography>
          <Typography
            sx={{ fontWeight: 700, fontSize: 28, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'text.primary' }}
          >
            {value}
          </Typography>
          {change && (
            <Typography variant="caption" sx={{ color: '#127C71', fontWeight: 600 }}>
              {change}
            </Typography>
          )}
        </Box>
      </Stack>
      {progress !== undefined && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 5,
            borderRadius: 99,
            backgroundColor: 'rgba(148,163,184,0.18)',
            '& .MuiLinearProgress-bar': {
              background: `linear-gradient(90deg, ${accent}aa, ${accent})`,
              borderRadius: 99,
            },
          }}
        />
      )}
    </Paper>
  )
}

export default StatCard
