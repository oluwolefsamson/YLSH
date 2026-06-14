import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import WorkIcon from '@mui/icons-material/Work'
import SchoolIcon from '@mui/icons-material/School'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import BusinessIcon from '@mui/icons-material/Business'
import SendIcon from '@mui/icons-material/Send'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { DashboardLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'

const PAPER_SX = {
  p: { xs: 2.5, md: 3 },
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.88)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(148,163,184,0.16)',
  boxShadow: '0 12px 30px rgba(15,23,42,0.06)',
}

type OppType = 'job' | 'internship' | 'grant' | 'scholarship'

interface Opportunity {
  id: number
  title: string
  organization: string
  type: OppType
  deadline: string
  location: string
  description: string
  amount?: string
}

const opportunities: Opportunity[] = [
  {
    id: 1,
    title: 'Junior Product Manager',
    organization: 'TechHub Lagos',
    type: 'job',
    deadline: 'Jul 30, 2026',
    location: 'Lagos, Nigeria',
    description: 'Help build digital products for African youth. 2+ years experience preferred.',
  },
  {
    id: 2,
    title: 'Data Science Internship',
    organization: 'Andela',
    type: 'internship',
    deadline: 'Jul 15, 2026',
    location: 'Remote',
    description: '6-month internship building ML pipelines. Open to university students and recent graduates.',
  },
  {
    id: 3,
    title: 'Youth Innovation Grant',
    organization: 'Tony Elumelu Foundation',
    type: 'grant',
    deadline: 'Aug 1, 2026',
    location: 'Pan-African',
    description: 'Seed funding for youth-led startups addressing African challenges.',
    amount: '$5,000',
  },
  {
    id: 4,
    title: 'STEM Scholarship 2026',
    organization: 'MTN Foundation',
    type: 'scholarship',
    deadline: 'Jun 30, 2026',
    location: 'Nigeria',
    description: 'Full tuition scholarship for undergraduate STEM students with 3.5+ GPA.',
    amount: '₦2.5M/year',
  },
  {
    id: 5,
    title: 'Policy Analyst',
    organization: 'Federal Ministry of Youth',
    type: 'job',
    deadline: 'Jul 20, 2026',
    location: 'Abuja, Nigeria',
    description: 'Analyze youth policy frameworks and prepare briefs for senior officials.',
  },
  {
    id: 6,
    title: 'Climate Tech Fellowship',
    organization: 'GreenAfrica Initiative',
    type: 'internship',
    deadline: 'Aug 15, 2026',
    location: 'Remote',
    description: '3-month fellowship building sustainability solutions for African communities.',
  },
]

const myApplications = [
  {
    id: 2,
    title: 'Data Science Internship',
    org: 'Andela',
    status: 'under_review',
    appliedDate: 'Jun 5, 2026',
  },
  {
    id: 3,
    title: 'Youth Innovation Grant',
    org: 'Tony Elumelu Foundation',
    status: 'shortlisted',
    appliedDate: 'Jun 1, 2026',
  },
]

const typeIcon: Record<OppType, React.ReactNode> = {
  job: <WorkIcon />,
  internship: <AccessTimeIcon />,
  grant: <MonetizationOnIcon />,
  scholarship: <SchoolIcon />,
}

const typeColor: Record<OppType, 'primary' | 'secondary' | 'success' | 'warning'> = {
  job: 'primary',
  internship: 'secondary',
  grant: 'success',
  scholarship: 'warning',
}

const tabTypes: Array<OppType | 'all'> = ['all', 'job', 'internship', 'grant', 'scholarship']
const tabLabels = ['All', 'Jobs', 'Internships', 'Grants', 'Scholarships']

const OpportunitiesPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)

  const filtered =
    tab === 0 ? opportunities : opportunities.filter((o) => o.type === tabTypes[tab])

  const appliedIds = new Set(myApplications.map((a) => a.id))

  return (
    <Box>
      <PageHeader
        eyebrow="Opportunities"
        title="Opportunities"
        subtitle="Discover jobs, internships, grants, and scholarships. Apply directly and track your application status."
        icon={<EmojiEventsIcon />}
      />

      {/* My applications tracker */}
      {myApplications.length > 0 && (
        <Paper sx={{ ...PAPER_SX, mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2.5, fontSize: 20 }}>
              My Applications
            </Typography>
            <Stack spacing={1.5}>
              {myApplications.map((app) => (
                <Box
                  key={app.id}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: '1px solid rgba(148,163,184,0.18)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{app.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {app.org} · Applied {app.appliedDate}
                    </Typography>
                  </Box>
                  <Chip
                    icon={app.status === 'shortlisted' ? <CheckCircleIcon /> : <HourglassEmptyIcon />}
                    label={app.status === 'shortlisted' ? 'Shortlisted' : 'Under review'}
                    color={app.status === 'shortlisted' ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
              ))}
            </Stack>
          </Paper>
        )}

        {/* Opportunity listings */}
        <Paper sx={PAPER_SX}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ mb: 3, borderBottom: '1px solid rgba(148,163,184,0.18)' }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabLabels.map((label) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>

          <Grid container spacing={2.5}>
            {filtered.map((opp) => (
              <Grid key={opp.id} item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: '1px solid rgba(148,163,184,0.18)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mb: 2 }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        display: 'grid',
                        placeItems: 'center',
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                      }}
                    >
                      {typeIcon[opp.type]}
                    </Box>
                    <Chip
                      label={opp.type.charAt(0).toUpperCase() + opp.type.slice(1)}
                      color={typeColor[opp.type]}
                      size="small"
                    />
                  </Stack>

                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {opp.title}
                  </Typography>

                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1.5 }}>
                    <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {opp.organization}
                    </Typography>
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                    {opp.description}
                  </Typography>

                  {opp.amount && (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: 'rgba(18,124,113,0.06)',
                        border: '1px solid rgba(18,124,113,0.18)',
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: 'primary.main', fontWeight: 700 }}
                      >
                        Award: {opp.amount}
                      </Typography>
                    </Box>
                  )}

                  <Stack spacing={0.5} sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarMonthIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        Deadline: {opp.deadline}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationOnIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {opp.location}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Button
                    variant={appliedIds.has(opp.id) ? 'outlined' : 'contained'}
                    endIcon={!appliedIds.has(opp.id) && <SendIcon />}
                    disabled={appliedIds.has(opp.id)}
                    sx={{ borderRadius: 99, textTransform: 'none', fontWeight: 700 }}
                  >
                    {appliedIds.has(opp.id) ? 'Applied' : 'Apply Now'}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
    </Box>
  )
}

OpportunitiesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default OpportunitiesPage
