import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import SchoolIcon from '@mui/icons-material/School'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import ArticleIcon from '@mui/icons-material/Article'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
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

type ResourceType = 'video' | 'pdf' | 'article'

interface Resource {
  id: number
  title: string
  type: ResourceType
  category: string
  duration: string
  progress: number
  completed: boolean
}

const resources: Resource[] = [
  {
    id: 1,
    title: 'Introduction to Leadership Fundamentals',
    type: 'video',
    category: 'Leadership',
    duration: '45 min',
    progress: 100,
    completed: true,
  },
  {
    id: 2,
    title: 'Digital Skills for Young Professionals',
    type: 'video',
    category: 'Digital Skills',
    duration: '1 hr 20 min',
    progress: 68,
    completed: false,
  },
  {
    id: 3,
    title: 'Youth Entrepreneurship Handbook',
    type: 'pdf',
    category: 'Entrepreneurship',
    duration: '80 pages',
    progress: 45,
    completed: false,
  },
  {
    id: 4,
    title: 'Grant Writing Masterclass Notes',
    type: 'pdf',
    category: 'Opportunities',
    duration: '32 pages',
    progress: 100,
    completed: true,
  },
  {
    id: 5,
    title: 'Climate Policy and Youth Advocacy',
    type: 'article',
    category: 'Policy',
    duration: '15 min read',
    progress: 0,
    completed: false,
  },
  {
    id: 6,
    title: 'Building Your Personal Brand Online',
    type: 'article',
    category: 'Digital Skills',
    duration: '10 min read',
    progress: 30,
    completed: false,
  },
]

const typeIcon: Record<ResourceType, React.ReactNode> = {
  video: <PlayCircleIcon />,
  pdf: <PictureAsPdfIcon />,
  article: <ArticleIcon />,
}

const typeColor: Record<ResourceType, string> = {
  video: '#EF4444',
  pdf: '#F59E0B',
  article: '#3B82F6',
}

const LearningPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)

  const filtered =
    tab === 0 ? resources :
    tab === 1 ? resources.filter((r) => !r.completed && r.progress > 0) :
    tab === 2 ? resources.filter((r) => r.completed) :
    resources.filter((r) => r.progress === 0)

  const completedCount = resources.filter((r) => r.completed).length
  const inProgressCount = resources.filter((r) => !r.completed && r.progress > 0).length
  const totalProgress = Math.round(
    resources.reduce((sum, r) => sum + r.progress, 0) / resources.length,
  )

  return (
    <Box>
      <PageHeader
        eyebrow="Learning"
        title="Learning Resources"
        subtitle="Access courses, PDFs, videos, and articles. Track your progress across all learning materials."
        icon={<SchoolIcon />}
      />

      {/* Stats */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard label="Completed" value={String(completedCount)} icon={<CheckCircleIcon />} progress={completedCount / resources.length * 100} accent="#22c55e" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="In Progress" value={String(inProgressCount)} icon={<SchoolIcon />} progress={inProgressCount / resources.length * 100} accent="#f59e0b" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="Overall Progress" value={`${totalProgress}%`} icon={<SchoolIcon />} progress={totalProgress} />
        </Grid>
      </Grid>

      <Paper sx={PAPER_SX}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ mb: 3, borderBottom: '1px solid rgba(148,163,184,0.18)' }}
          >
            <Tab label="All" />
            <Tab label="In Progress" />
            <Tab label="Completed" />
            <Tab label="Not Started" />
          </Tabs>

          <Stack spacing={2}>
            {filtered.map((resource) => (
              <Box
                key={resource.id}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid rgba(148,163,184,0.18)',
                  display: 'flex',
                  gap: 2,
                  alignItems: 'flex-start',
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '14px',
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: `${typeColor[resource.type]}18`,
                    color: typeColor[resource.type],
                    flexShrink: 0,
                  }}
                >
                  {typeIcon[resource.type]}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                    sx={{ mb: 0.5 }}
                  >
                    <Typography sx={{ fontWeight: 700 }}>{resource.title}</Typography>
                    {resource.completed && (
                      <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20, flexShrink: 0 }} />
                    )}
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.75 }}>
                    <Chip label={resource.category} size="small" />
                    <Chip label={resource.duration} size="small" variant="outlined" />
                    <Chip
                      label={resource.type.toUpperCase()}
                      size="small"
                      variant="outlined"
                      sx={{ color: typeColor[resource.type], borderColor: typeColor[resource.type] }}
                    />
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={resource.progress}
                    sx={{ height: 6, borderRadius: 99, mb: 1 }}
                  />

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      {resource.progress}% complete
                    </Typography>
                    <Button
                      size="small"
                      variant={resource.completed ? 'outlined' : 'contained'}
                      sx={{ borderRadius: 99, textTransform: 'none', fontWeight: 700 }}
                    >
                      {resource.completed ? 'Review' : resource.progress > 0 ? 'Continue' : 'Start'}
                    </Button>
                  </Stack>
                </Box>
              </Box>
            ))}

            {filtered.length === 0 && (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">No resources in this category.</Typography>
              </Box>
            )}
          </Stack>
      </Paper>
    </Box>
  )
}

LearningPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default LearningPage
