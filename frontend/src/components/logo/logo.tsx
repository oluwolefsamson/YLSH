import React, { FC } from 'react'
import { Box, Typography } from '@mui/material'
import { keyframes } from '@emotion/react'

interface Props {
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const Logo: FC<Props> = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.25,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: '14px',
          display: 'grid',
          placeItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background:
            'linear-gradient(135deg, #0f172a 0%, #0f766e 54%, #14b8a6 100%)',
          boxShadow: '0 12px 28px rgba(15, 23, 42, 0.16)',
          border: '1px solid rgba(255,255,255,0.14)',
          flexShrink: 0,
          animation: `${fadeIn} 220ms ease-out`,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 30% 28%, rgba(255,255,255,0.22), transparent 28%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1), transparent 30%)',
          },
        }}
      >
        <Typography
          component="span"
          sx={{
            position: 'relative',
            zIndex: 1,
            fontSize: 18,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.06em',
            color: 'common.white',
          }}
        >
          Y
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <Typography
          component="span"
          sx={{
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: '0.02em',
            color: 'text.primary',
          }}
        >
          YLSH
        </Typography>
        <Typography
          component="span"
          sx={{
            mt: 0.35,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.16em',
            color: 'text.secondary',
            textTransform: 'uppercase',
          }}
        >
          Youth platform
        </Typography>
      </Box>
    </Box>
  )
}

Logo.defaultProps = {
  variant: 'primary',
}

export default Logo
