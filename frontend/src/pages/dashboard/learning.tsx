import React, { useState } from 'react'
import { GraduationCap, PlayCircle, FileText, CheckCircle, X, Download, ExternalLink } from 'lucide-react'
import { DashboardLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import type { LearningResource, ResourceType } from '@/types'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }

const resources: LearningResource[] = [
  { id: 1, title: 'Introduction to Leadership Fundamentals', type: 'video', category: 'Leadership', duration: '45 min', progress: 100, completed: true, videoId: 'dQw4w9WgXcQ', excerpt: '' },
  { id: 2, title: 'Digital Skills for Young Professionals', type: 'video', category: 'Digital Skills', duration: '1 hr 20 min', progress: 68, completed: false, videoId: 'dQw4w9WgXcQ', excerpt: '' },
  { id: 3, title: 'Youth Entrepreneurship Handbook', type: 'pdf', category: 'Entrepreneurship', duration: '80 pages', progress: 45, completed: false, videoId: '', excerpt: '' },
  { id: 4, title: 'Grant Writing Masterclass Notes', type: 'pdf', category: 'Opportunities', duration: '32 pages', progress: 100, completed: true, videoId: '', excerpt: '' },
  {
    id: 5, title: 'Climate Policy and Youth Advocacy', type: 'article', category: 'Policy', duration: '15 min read', progress: 0, completed: false, videoId: '',
    excerpt: `Climate policy is increasingly shaped by youth voices. From the Fridays for Future movement to formal UN youth delegates, young Africans are at the forefront of demanding bold action.\n\nUnderstanding the policy landscape requires knowledge of frameworks like the Paris Agreement, Nationally Determined Contributions (NDCs), and the African Union's Climate Action agenda.\n\nKey advocacy tools include drafting policy briefs, engaging your local representative, and joining youth-led coalitions like YOUNGO. Start by identifying one climate issue in your community and researching the existing policies around it.\n\nThe next decade will define Africa's climate trajectory. Your voice matters.`,
  },
  {
    id: 6, title: 'Building Your Personal Brand Online', type: 'article', category: 'Digital Skills', duration: '10 min read', progress: 30, completed: false, videoId: '',
    excerpt: `Your personal brand is what people say about you when you're not in the room. In a digital-first world, it's also what appears when someone Googles your name.\n\nStart with clarity: define your niche, your values, and the audience you want to reach. Then choose 1–2 platforms where that audience lives — LinkedIn for professional audiences, Twitter/X for thought leadership, or Instagram for creative fields.\n\nConsistency is key. Post regularly, engage genuinely, and let your personality show. Document your journey, share lessons learned, and highlight the problems you solve.\n\nA strong online presence opens doors to opportunities, mentors, and collaborations that would otherwise be out of reach.`,
  },
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
  const [activeResource, setActiveResource] = useState<LearningResource | null>(null)

  const filtered = tab === 0 ? resources
    : tab === 1 ? resources.filter((r) => !r.completed && r.progress > 0)
    : tab === 2 ? resources.filter((r) => r.completed)
    : resources.filter((r) => r.progress === 0)

  const completedCount = resources.filter((r) => r.completed).length
  const inProgressCount = resources.filter((r) => !r.completed && r.progress > 0).length
  const totalProgress = Math.round(resources.reduce((sum, r) => sum + r.progress, 0) / resources.length)

  const handleAction = (resource: LearningResource): void => {
    if (resource.type === 'pdf') {
      const content = `YLSH Learning Resource\n\n${resource.title}\nCategory: ${resource.category}\nLength: ${resource.duration}\n\nThis document is part of the YLSH learning library. Access the full content at ylsh.ng/learning.`
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${resource.title.replace(/\s+/g, '_')}.txt`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      setActiveResource(resource)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Learning"
        title="Learning Resources"
        subtitle="Access courses, PDFs, videos, and articles. Track your progress across all learning materials."
        icon={<GraduationCap size={14} />}
      />

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
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border" style={{ color: typeColor[resource.type], borderColor: typeColor[resource.type] }}>
                    {resource.type === 'pdf' ? 'PDF' : resource.type.toUpperCase()}
                  </span>
                </div>
                <div className="h-[6px] rounded-full overflow-hidden mb-2" style={{ backgroundColor: 'rgba(148,163,184,0.18)' }}>
                  <div className="h-full rounded-full bg-primary" style={{ width: `${resource.progress}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{resource.progress}% complete</span>
                  <button
                    onClick={() => handleAction(resource)}
                    className={cn('flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold transition-colors', resource.completed ? 'border border-border hover:bg-muted' : 'bg-primary text-white hover:bg-[#0d5c54]')}
                  >
                    {resource.type === 'pdf' && <Download size={12} />}
                    {resource.type === 'video' && <PlayCircle size={12} />}
                    {resource.type === 'article' && <ExternalLink size={12} />}
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

      {/* Video / Article Modal */}
      {activeResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setActiveResource(null)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-0.5">{activeResource.category}</p>
                <h3 className="font-bold text-base leading-snug">{activeResource.title}</h3>
              </div>
              <button onClick={() => setActiveResource(null)} className="p-1.5 rounded-lg hover:bg-muted flex-shrink-0">
                <X size={18} />
              </button>
            </div>

            {activeResource.type === 'video' && (
              <div>
                <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${activeResource.videoId}?autoplay=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-muted-foreground">{activeResource.duration}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-xs font-medium text-muted-foreground">{activeResource.progress}% watched</span>
                  </div>
                  <div className="h-[6px] rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(148,163,184,0.18)' }}>
                    <div className="h-full rounded-full bg-primary" style={{ width: `${activeResource.progress}%` }} />
                  </div>
                </div>
              </div>
            )}

            {activeResource.type === 'article' && (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">{activeResource.category}</span>
                  <span className="text-xs text-muted-foreground">{activeResource.duration}</span>
                </div>
                <div className="prose prose-sm max-w-none">
                  {(activeResource.excerpt || '').split('\n\n').map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed text-foreground mb-4">{para}</p>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <button onClick={() => setActiveResource(null)} className="w-full h-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#0d5c54] transition-colors">
                    Mark as read
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

LearningPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default LearningPage
