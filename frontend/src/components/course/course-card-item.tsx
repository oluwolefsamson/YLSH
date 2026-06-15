import React, { FC } from 'react'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Rating from '@mui/material/Rating'
import Typography from '@mui/material/Typography'
import IconButton, { iconButtonClasses } from '@mui/material/IconButton'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { Course } from '@/interfaces/course'

interface Props {
  item: Course
}

const CourseCardItem: FC<Props> = ({ item }) => {
  return (
    <Box
      sx={{
        px: 1,
        py: 3,
      }}
    >
      <Box
        sx={{
          p: 2.2,
          backgroundColor: 'rgba(255,255,255,0.88)',
          borderRadius: 4,
          border: '1px solid rgba(148, 163, 184, 0.16)',
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)',
          backdropFilter: 'blur(12px)',
          transition: (theme) => theme.transitions.create(['box-shadow', 'transform']),
          '&:hover': {
            boxShadow: '0 24px 48px rgba(15, 23, 42, 0.12)',
            transform: 'translateY(-2px)',
            [`& .${iconButtonClasses.root}`]: {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              boxShadow: 2,
            },
          },
        }}
      >
        <Box
          sx={{
            lineHeight: 0,
            overflow: 'hidden',
            borderRadius: 3,
            mb: 2.2,
          }}
        >
          <Image src={item.cover} width={760} height={760} alt={'Course ' + item.id} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 1.2,
              py: 0.5,
              borderRadius: 999,
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              color: 'primary.main',
              fontSize: '0.78rem',
              fontWeight: 700,
              mb: 1.4,
            }}
          >
            {item.category}
          </Box>
          <Typography component="h2" variant="h5" sx={{ mb: 1.5, minHeight: 56, overflow: 'hidden', fontSize: '1.15rem' }}>
            {item.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating name="rating-course" value={item.rating} max={5} sx={{ color: '#ffce31', mr: 1 }} readOnly />
            <Typography component="span" variant="h5">
              ({item.ratingCount})
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" color="primary.main">
              Free
            </Typography>
            <Typography variant="h6" sx={{ ml: 0.5 }}>
              access
            </Typography>
          </Box>
          <IconButton
            color="primary"
            sx={{ '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText' } }}
          >
            <ArrowForward />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default CourseCardItem
