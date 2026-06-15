import React, { FC } from 'react'
import Box from '@mui/material/Box'
import NextLink from 'next/link'
import Link from '@mui/material/Link'
import { StyledButton } from '@/components/styled-button'

const AuthNavigation: FC = () => {
  return (
    <Box sx={{ '& button:first-child': { mr: 2 } }}>
      <Link component={NextLink} href="/signin" underline="none">
        <StyledButton disableHoverEffect={true} variant="outlined">
          Sign In
        </StyledButton>
      </Link>
      <Link component={NextLink} href="/signup" underline="none">
        <StyledButton disableHoverEffect={true}>Sign Up</StyledButton>
      </Link>
    </Box>
  )
}

export default AuthNavigation
