import React, { FC } from 'react'
import { Box, Typography } from '@mui/material'
import { keyframes } from '@emotion/react'

interface Props {
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

const drift = keyframes`
  0%, 100% {
    transform: translateY(0) scale(1);
    filter: drop-shadow(0 10px 22px rgba(20, 184, 166, 0.24));
  }
  50% {
    transform: translateY(-2px) scale(1.01);
    filter: drop-shadow(0 14px 28px rgba(20, 184, 166, 0.3));
  }
`

const shimmer = keyframes`
  0%, 100% {
    opacity: 0.68;
    transform: translateX(-2%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateX(2%) scale(1.02);
  }
`

const Logo: FC<Props> = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 1,
          py: 0.75,
          borderRadius: '18px',
          background:
            'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
          border: '1px solid rgba(148, 163, 184, 0.24)',
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.18)',
          animation: `${drift} 3.6s ease-in-out infinite`,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 1,
            borderRadius: '17px',
            background:
              'radial-gradient(circle at top left, rgba(56, 189, 248, 0.22), transparent 42%), radial-gradient(circle at bottom right, rgba(244, 63, 94, 0.16), transparent 40%)',
            pointerEvents: 'none',
            animation: `${shimmer} 4.8s ease-in-out infinite`,
          },
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '12px',
            position: 'relative',
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(135deg, #22c55e 0%, #14b8a6 45%, #0f172a 100%)',
            boxShadow: '0 10px 22px rgba(20, 184, 166, 0.24)',
            overflow: 'hidden',
            animation: `${drift} 3.6s ease-in-out infinite`,
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 28% 28%, rgba(255,255,255,0.92) 0 8%, transparent 9%), radial-gradient(circle at 72% 72%, rgba(255,255,255,0.18) 0 12%, transparent 13%)',
              opacity: 0.9,
              animation: `${shimmer} 2.8s ease-in-out infinite`,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 8,
              borderRadius: '9px',
              border: '1.5px solid rgba(255,255,255,0.82)',
              transform: 'rotate(12deg)',
              opacity: 0.95,
            },
          }}
        />

        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1.15,
            py: 0.4,
            borderRadius: '14px',
            border: '1px solid rgba(148, 163, 184, 0.28)',
            backgroundColor: 'rgba(248, 250, 252, 0.08)',
            minWidth: 78,
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            animation: `${shimmer} 4.2s ease-in-out infinite`,
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: '0.92rem',
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '0.14em',
              color: '#f8fafc',
              textTransform: 'uppercase',
            }}
          >
            YLSH
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

Logo.defaultProps = {
  variant: 'primary',
}

export default Logo
