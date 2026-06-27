import React, { useState } from 'react'
import { GraduationCap, Plus, X, Trash2, PlayCircle, FileText, Loader2, ExternalLink } from 'lucide-react'
import { AdminLayout } from '@/components/layout'
import { PageHeader, StatCard } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'
import { useResources, useCreateResource, useDeleteResource } from '@/services/hooks/learning/learning'
import type { ResourceType } from '@/services/endpoints/learning/learning'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CARD, CARD_STYLE } from '@/utils/card-styles'

const typeIcon: Record<ResourceType, React.ReactNode> = {
  video: <PlayCircle size={16} />, pdf: <FileText size={16} />, article: <FileText size={16} />,
}
const typeColor: Record<ResourceType, string> = { video: '#EF4444', pdf: '#F59E0B', article: '#3B82F6' }
const INPUT = 'w-full h-10 px-3 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'

type Form = { title: string; type: ResourceType; category: string; duration: string; url: string; videoId: string; excerpt: string }
const EMPTY: Form = { title: '', type: 'video', category: '', duration: '', url: '', videoId: '', excerpt: '' }

function extractYouTubeId(input: string): string | null {
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input
  const m = input.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|avi|mkv)(\?|#|$)/i.test(url)
}

export function LearningContent() {
  const [showCreate, setShowCreate] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)

  const { data: resourceData, isLoading } = useResources({ limit: 200 })
  const createResource = useCreateResource()
  const deleteResource = useDeleteResource()

  const resources = resourceData?.data ?? []
  const videos = resources.filter((r) => r.type === 'video').length
  const pdfs = resources.filter((r) => r.type === 'pdf').length
  const articles = resources.filter((r) => r.type === 'article').length

  const handleCreate = () => {
    if (!form.title || !form.category) return toast.error('Title and category are required')
    if (form.type === 'video' && !form.videoId && !form.url) return toast.error('A YouTube link or direct video URL is required')
    createResource.mutate(
      {
        title: form.title, type: form.type, category: form.category,
        ...(form.duration && { duration: form.duration }),
        ...(form.url && { url: form.url }),
        ...(form.videoId && { videoId: form.videoId }),
        ...(form.excerpt && { excerpt: form.excerpt }),
      },
      {
        onSuccess: () => { toast.success('Resource added'); setShowCreate(false); setForm(EMPTY) },
        onError: () => toast.error('Failed to add resource'),
      }
    )
  }

  const handleDelete = () => {
    if (!confirmDelete) return
    deleteResource.mutate(confirmDelete.id, {
      onSuccess: () => { toast.success('Resource deleted'); setConfirmDelete(null) },
      onError: () => toast.error('Failed to delete resource'),
    })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Learning"
        title="Learning Resources"
        subtitle="Add videos, PDFs, and articles that participants can access and track their progress."
        icon={<GraduationCap size={14} />}
        action={
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-bold shadow-md hover:bg-[#061e35] transition-colors">
            <Plus size={16} /> Add Resource
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Resources" value={String(resources.length)} icon={<GraduationCap size={20} />} progress={100} />
        <StatCard label="Videos" value={String(videos)} icon={<PlayCircle size={20} />} progress={resources.length ? (videos / resources.length) * 100 : 0} accent="#EF4444" />
        <StatCard label="PDFs & Articles" value={String(pdfs + articles)} icon={<FileText size={20} />} progress={resources.length ? ((pdfs + articles) / resources.length) * 100 : 0} accent="#F59E0B" />
      </div>

      <div className={CARD} style={CARD_STYLE}>
        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-primary" /></div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Duration</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Link</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resources.length === 0 ? (
                  <tr><td colSpan={6} className="py-16 text-center text-muted-foreground">No learning resources yet. Click "Add Resource" above.</td></tr>
                ) : resources.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-semibold">{r.title}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold" style={{ color: typeColor[r.type], backgroundColor: `${typeColor[r.type]}18` }}>
                        {typeIcon[r.type]} {r.type === 'pdf' ? 'PDF' : r.type.charAt(0).toUpperCase() + r.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">{r.category}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{r.duration || '—'}</td>
                    <td className="px-4 py-3.5">
                      {r.url || r.videoId ? (
                        <a href={r.url || `https://youtu.be/${r.videoId}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          <ExternalLink size={12} /> View
                        </a>
                      ) : <span className="text-muted-foreground text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button onClick={() => setConfirmDelete({ id: r._id, title: r.title })} className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(8,47,73,0.55)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Add Learning Resource</h2>
              <button onClick={() => { setShowCreate(false); setForm(EMPTY) }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Title <span className="text-red-500">*</span></label>
                <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Introduction to Leadership" className={INPUT} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Type <span className="text-red-500">*</span></label>
                  <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as ResourceType, url: '', videoId: '', excerpt: '' }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Category <span className="text-red-500">*</span></label>
                  <input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="e.g. Leadership" className={INPUT} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Duration <span className="text-slate-400 font-normal">(optional)</span></label>
                <input value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} placeholder="e.g. 45 min" className={INPUT} />
              </div>
              {form.type === 'video' && (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">YouTube URL or Video ID</label>
                    <input
                      value={form.videoId}
                      onChange={(e) => {
                        const raw = e.target.value
                        const ytId = extractYouTubeId(raw)
                        setForm((p) => ({ ...p, videoId: ytId ?? raw, url: ytId ? '' : p.url }))
                      }}
                      placeholder="Paste YouTube link or enter Video ID"
                      className={INPUT}
                    />
                    <p className="text-xs text-muted-foreground mt-1">e.g. https://youtube.com/watch?v=dQw4w9WgXcQ or just dQw4w9WgXcQ</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      Or direct video URL <span className="text-slate-400 font-normal">(mp4, webm — for non-YouTube videos)</span>
                    </label>
                    <input
                      value={form.url}
                      onChange={(e) => setForm((p) => ({ ...p, url: e.target.value, videoId: e.target.value ? '' : p.videoId }))}
                      placeholder="https://example.com/video.mp4"
                      className={INPUT}
                      disabled={!!form.videoId}
                    />
                    {!form.videoId && !form.url && (
                      <p className="text-xs text-red-500 mt-1">At least one video source is required.</p>
                    )}
                  </div>
                </div>
              )}
              {(form.type === 'pdf' || form.type === 'article') && (
                <div>
                  <label className="block text-sm font-semibold mb-1.5">URL {form.type === 'pdf' && <span className="text-red-500">*</span>}<span className="text-slate-400 font-normal">{form.type === 'article' ? ' (optional)' : ''}</span></label>
                  <input value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} placeholder="https://..." className={INPUT} />
                </div>
              )}
              {form.type === 'article' && (
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Article content <span className="text-slate-400 font-normal">(optional)</span></label>
                  <textarea value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} placeholder="Paste or write the article content here..." rows={4} className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none" />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowCreate(false); setForm(EMPTY) }} className="flex-1 h-11 rounded-full border border-border font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleCreate} disabled={createResource.isPending} className="flex-1 h-11 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#061e35] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {createResource.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Add Resource'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 grid place-items-center mx-auto mb-4"><Trash2 size={22} className="text-red-600" /></div>
            <h2 className="text-lg font-bold text-center mb-1">Delete Resource?</h2>
            <p className="text-sm text-muted-foreground text-center mb-6"><span className="font-semibold text-foreground">{confirmDelete.title}</span> will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-11 rounded-full border border-border font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={deleteResource.isPending} className="flex-1 h-11 rounded-full bg-red-600 text-white font-bold text-sm hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {deleteResource.isPending ? <Loader2 size={15} className="animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const AdminLearningPage: NextPageWithLayout = () => <LearningContent />
AdminLearningPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>
export default AdminLearningPage
