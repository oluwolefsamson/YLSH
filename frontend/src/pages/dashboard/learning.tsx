import React, { useState } from 'react'
import { GraduationCap, PlayCircle, FileText, CheckCircle } from 'lucide-react'
import { DashboardLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

type ResourceType = 'video' | 'pdf' | 'article'

const resources = [
  { id: 1, title: 'Introduction to Leadership Fundamentals', type: 'video' as ResourceType, category: 'Leadership', duration: '45 min', progress: 100, completed: true },
  { id: 2, title: 'Digital Skills for Young Professionals', type: 'video' as ResourceType, category: 'Digital Skills', duration: '1 hr 20 min', progress: 68, completed: false },
  { id: 3, title: 'Youth Entrepreneurship Handbook', type: 'pdf' as ResourceType, category: 'Entrepreneurship', duration: '80 pages', progress: 45, completed: false },
  { id: 4, title: 'Grant Writing Masterclass Notes', type: 'pdf' as ResourceType, category: 'Opportunities', duration: '32 pages', progress: 100, completed: true },
  { id: 5, title: 'Climate Policy and Youth Advocacy', type: 'article' as ResourceType, category: 'Policy', duration: '15 min read', progress: 0, completed: false },
  { id: 6, title: 'Building Your Personal Brand Online', type: 'article' as ResourceType, category: 'Digital Skills', duration: '10 min read', progress: 30, completed: false },
]

const typeIcon: Record<ResourceType, React.ReactNode> = {
  video: <PlayCircle size={22} />,
  pdf: <FileText size={22} />,
  article: <FileText size={22} />,
}

const typeColor: Record<ResourceType, string> = { video: '#EF4444', pdf: '#F59E0B', article: '#3B82F6' }

const TABS = ['All', 'In Progress', 'Completed', 'Not Started']

const LearningPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const filtered = tab === 0 ? resources : tab === 1 ? resources.filter((r) => !r.completed && r.progress > 0) : tab === 2 ? resources.filter((r) => r.completed) : resources.filter((r) => r.progress === 0)
  const completedCount = resources.filter((r) => r.completed).length
  const inProgressCount = resources.filter((r) => !r.completed && r.progress > 0).length
  const totalProgress = Math.round(resources.reduce((sum, r) => sum + r.progress, 0) / resources.length)

  return (
    <div>
      <PageHeader eyebrow="Learning" title="Learning Resources" subtitle="Access courses, PDFs, videos, and articles. Track your progress across all learning materials." icon={<GraduationCap size={14} />} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Completed" value={String(completedCount)} icon={<CheckCircle size={20} />} progress={completedCount / resources.length * 100} accent="#22c55e" />
        <StatCard label="In Progress" value={String(inProgressCount)} icon={<GraduationCap size={20} />} progress={inProgressCount / resources.length * 100} accent="#f59e0b" />
        <StatCard label="Overall Progress" value={`${totalProgress}%`} icon={<GraduationCap size={20} />} progress={totalProgress} />
      </div>

      <div className={CARD} style={CARD_STYLE}>
        <div className="flex gap-1 border-b border-slate-200/18 mb-5 overflow-x-auto">
          {TABS.map((label, i) => (
            <button key={label} onClick={() => setTab(i)} className={cn('px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors whitespace-nowrap', tab === i ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((resource) => (
            <div key={resource.id} className="flex gap-4 items-start p-4 rounded-xl border border-slate-200/18">
              <div className="w-12 h-12 rounded-[14px] grid place-items-center flex-shrink-0" style={{ backgroundColor: `${typeColor[resource.type]}18`, color: typeColor[resource.type] }}>
                {typeIcon[resource.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-bold">{resource.title}</p>
                  {resource.completed && <CheckCircle size={18} className="text-green-600 flex-shrink-0" />}
                </div>
                <div className="flex gap-2 flex-wrap mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">{resource.category}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-border text-muted-foreground">{resource.duration}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border" style={{ color: typeColor[resource.type], borderColor: typeColor[resource.type] }}>{resource.type.toUpperCase()}</span>
                </div>
                <div className="h-[6px] rounded-full overflow-hidden mb-2" style={{ backgroundColor: 'rgba(148,163,184,0.18)' }}>
                  <div className="h-full rounded-full bg-primary" style={{ width: `${resource.progress}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{resource.progress}% complete</span>
                  <button className={cn('px-4 py-1 rounded-full text-xs font-bold transition-colors', resource.completed ? 'border border-border hover:bg-muted' : 'bg-primary text-white hover:bg-[#0d5c54]')}>
                    {resource.completed ? 'Review' : resource.progress > 0 ? 'Continue' : 'Start'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">No resources in this category.</div>
          )}
        </div>
      </div>
    </div>
  )
}

LearningPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default LearningPage
