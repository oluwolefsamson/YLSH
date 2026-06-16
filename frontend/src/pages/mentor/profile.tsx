import React, { useState } from 'react'
import { UserCircle, Pencil, Save, Star, Users, Calendar, Briefcase } from 'lucide-react'
import { MentorLayout } from '@/components/layout'
import { PageHeader } from '@/components/dashboard'
import { NextPageWithLayout } from '@/interfaces/layout'
import { cn } from '@/utils'

const CARD = 'p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16'
const CARD_STYLE = { backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }
const INPUT = 'w-full h-10 px-3 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:bg-muted transition-colors'

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={14} className={i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
    ))}
  </div>
)

const MentorProfilePage: NextPageWithLayout = () => {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    firstName: 'Ngozi', lastName: 'Adeyemi', email: 'ngozi.adeyemi@example.com',
    phone: '+234 801 234 5678', role: 'Chief Technology Officer', company: 'Flutterwave',
    category: 'Tech & Engineering', bio: 'Former Google engineer turned fintech CTO. Passionate about growing the next generation of African tech leaders.',
    linkedin: 'linkedin.com/in/ngozi-adeyemi', expertise: 'Software Engineering, System Design, Career Mentorship',
  })

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <div>
      <PageHeader eyebrow="Mentor Profile" title="My Profile" subtitle="Manage your public mentor profile. This is what participants see when discovering mentors." icon={<UserCircle size={14} />} />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5">
        <div className="flex flex-col gap-5">
          <div className={CARD} style={CARD_STYLE}>
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full flex items-center justify-center text-white font-bold text-3xl" style={{ width: 88, height: 88, backgroundColor: '#127C71' }}>NA</div>
              <div className="text-center">
                <p className="font-bold text-lg">{form.firstName} {form.lastName}</p>
                <p className="text-sm text-muted-foreground">{form.role} · {form.company}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground mt-1">{form.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={4.9} />
                <span className="text-sm text-muted-foreground">4.9 · 142 sessions</span>
              </div>
              <button className="w-full h-9 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors">Upload photo</button>
            </div>
          </div>

          <div className="p-5 md:p-6 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, rgba(8,47,73,0.98) 0%, rgba(18,124,113,0.98) 100%)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }}>
            <p className="font-bold mb-3">Mentor Impact</p>
            {[
              { icon: <Users size={16} />, label: 'Total mentees', value: '24' },
              { icon: <Calendar size={16} />, label: 'Sessions completed', value: '142' },
              { icon: <Star size={16} />, label: 'Average rating', value: '4.9 / 5' },
              { icon: <Briefcase size={16} />, label: 'Years experience', value: '12+' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{row.icon}</span>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{row.label}</span>
                </div>
                <span className="text-sm font-bold">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={CARD} style={CARD_STYLE}>
          <div className="flex items-center justify-between mb-5">
            <p className="font-bold text-lg">Profile Information</p>
            <button onClick={() => setEditing((v) => !v)} className={cn('flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors', editing ? 'bg-primary text-white hover:bg-[#0d5c54]' : 'border border-border hover:bg-muted')}>
              {editing ? <><Save size={14} /> Save changes</> : <><Pencil size={14} /> Edit</>}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { label: 'First name', field: 'firstName' as const },
              { label: 'Last name', field: 'lastName' as const },
              { label: 'Email address', field: 'email' as const },
              { label: 'Phone number', field: 'phone' as const },
              { label: 'Role / Title', field: 'role' as const },
              { label: 'Company / Organisation', field: 'company' as const },
              { label: 'Mentorship category', field: 'category' as const },
              { label: 'LinkedIn profile', field: 'linkedin' as const },
              { label: 'Areas of expertise', field: 'expertise' as const },
            ]).map(({ label, field }) => (
              <div key={field}>
                <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
                <input value={form[field]} onChange={handleChange(field)} disabled={!editing} className={INPUT} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Bio</label>
              <textarea value={form.bio} onChange={handleChange('bio')} disabled={!editing} rows={4} className={cn(INPUT, 'h-auto py-2 resize-none')} />
            </div>
          </div>
          <hr className="border-border my-4" />
          <p className="text-sm text-muted-foreground">Your profile is visible to all YLSH participants when they browse mentors. Keep your bio and expertise up to date to attract the right mentees.</p>
        </div>
      </div>
    </div>
  )
}

MentorProfilePage.getLayout = (page) => <MentorLayout>{page}</MentorLayout>
export default MentorProfilePage
