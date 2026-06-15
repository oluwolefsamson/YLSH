import React, { FC } from 'react'
import Box from '@mui/material/Box'
import InputBase from '@mui/material/InputBase'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { StyledButton } from '../styled-button'

const HomeNewsLetter: FC = () => {
  return (
    <Box sx={{ backgroundColor: 'background.paper', py: { xs: 8, md: 10 } }}>
      <Container>
        <Box
          sx={{
            background:
              'linear-gradient(135deg, rgba(18,124,113,1) 0%, rgba(13,106,105,1) 100%)',
            borderRadius: 6,
            py: { xs: 4, md: 8 },
            px: { xs: 4, md: 8 },
            textAlign: 'center',
            boxShadow: '0 24px 60px rgba(15, 23, 42, 0.14)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <Typography
            variant="h1"
            component="h2"
            sx={{ mb: 1, fontSize: { xs: 32, md: 42 }, color: 'common.white' }}
          >
            Free Access. No Paywall.
          </Typography>
          <Typography sx={{ mb: 6, color: 'rgba(255,255,255,0.9)' }}>
            Every module in the YLSH platform is free to access, use, and share with the community.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-around',
              width: { xs: '100%', md: 560 },
              mx: 'auto',
            }}
          >
            <InputBase
              sx={{
                backgroundColor: 'background.paper',
                borderRadius: 3,
                width: '100%',
                height: 48,
                px: 2,
                mr: { xs: 0, md: 3 },
                mb: { xs: 2, md: 0 },
              }}
              placeholder="Enter your email address"
            />
            <Box>
              <StyledButton disableHoverEffect size="large">
                Join Free
              </StyledButton>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default HomeNewsLetter
