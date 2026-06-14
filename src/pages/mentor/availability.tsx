import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import SaveIcon from '@mui/icons-material/Save'
import { MentorLayout } from '@/components/layout'
import { NextPageWithLayout } from '@/interfaces/layout'

const PAPER_SX = {
  p: { xs: 2.5, md: 3 },
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.82)',
  border: '1px solid rgba(148,163,184,0.18)',
  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const AvailabilityPage: NextPageWithLayout = () => {
  const [availability, setAvailability] = useState<Record<string, boolean>>({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: true,
    Friday: false,
    Saturday: true,
    Sunday: true,
  })

  const [slots, setSlots] = useState({ from: '09:00', to: '17:00' })
  const [sessionDuration, setSessionDuration] = useState('60')
  const [maxPerWeek, setMaxPerWeek] = useState('5')
  const [accepting, setAccepting] = useState(true)

  const toggle = (day: string) =>
    setAvailability((prev) => ({ ...prev, [day]: !prev[day] }))

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          <Chip icon={<EventAvailableIcon />} label="Availability" sx={{ width: 'fit-content' }} />
          <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 38 } }}>
            Availability Settings
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
            Set the days and hours you are available for mentorship sessions. Mentees will only be
            able to book slots within your configured availability.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={PAPER_SX}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Available Days</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={accepting}
                      onChange={(e) => setAccepting(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" color={accepting ? 'primary.main' : 'text.secondary'}>
                      {accepting ? 'Accepting bookings' : 'Paused'}
                    </Typography>
                  }
                  labelPlacement="start"
                />
              </Stack>

              <Stack spacing={1.5}>
                {days.map((day) => (
                  <Stack key={day} direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontWeight: availability[day] ? 600 : 400, color: availability[day] ? 'text.primary' : 'text.secondary' }}>
                      {day}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {availability[day] && (
                        <Chip label="Available" color="success" size="small" />
                      )}
                      <Switch
                        checked={availability[day]}
                        onChange={() => toggle(day)}
                        size="small"
                        color="primary"
                      />
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Paper sx={PAPER_SX}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Session Hours</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="From"
                      type="time"
                      value={slots.from}
                      onChange={(e) => setSlots((p) => ({ ...p, from: e.target.value }))}
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="To"
                      type="time"
                      value={slots.to}
                      onChange={(e) => setSlots((p) => ({ ...p, to: e.target.value }))}
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Session duration (min)"
                      type="number"
                      value={sessionDuration}
                      onChange={(e) => setSessionDuration(e.target.value)}
                      fullWidth
                      size="small"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Max sessions / week"
                      type="number"
                      value={maxPerWeek}
                      onChange={(e) => setMaxPerWeek(e.target.value)}
                      fullWidth
                      size="small"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Paper
                sx={{
                  ...PAPER_SX,
                  background: 'linear-gradient(135deg, rgba(8,47,73,0.97) 0%, rgba(18,124,113,0.97) 100%)',
                  color: 'common.white',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Summary</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                  You are available on{' '}
                  <strong>
                    {Object.entries(availability)
                      .filter(([, v]) => v)
                      .map(([k]) => k)
                      .join(', ') || 'no days'}
                  </strong>{' '}
                  between <strong>{slots.from}</strong> and <strong>{slots.to}</strong>, with{' '}
                  <strong>{sessionDuration}-minute</strong> sessions, up to{' '}
                  <strong>{maxPerWeek} per week</strong>.
                </Typography>
                <Chip
                  label={accepting ? 'Accepting new bookings' : 'Bookings paused'}
                  color={accepting ? 'success' : 'warning'}
                  size="small"
                  sx={{ mb: 3 }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<SaveIcon />}
                  sx={{
                    borderRadius: 99,
                    textTransform: 'none',
                    fontWeight: 700,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)' },
                  }}
                >
                  Save availability
                </Button>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

AvailabilityPage.getLayout = (page) => <MentorLayout>{page}</MentorLayout>

export default AvailabilityPage
