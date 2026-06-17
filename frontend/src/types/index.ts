import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

// ---------------------------------------------------------------------------
// Re-export API types so pages can import from one place
// ---------------------------------------------------------------------------
export type { User, UpdateProfilePayload } from '@/services/endpoints/users/users'
export type { MentorProfile, MenteeEntry, MentorStats } from '@/services/endpoints/mentors/mentors'
export type { MentorSession, SessionStatus } from '@/services/endpoints/sessions/sessions'
export type { Opportunity, Application, OppType, ApplicationStatus } from '@/services/endpoints/opportunities/opportunities'
export type { LearningResource, UserProgress, ResourceType } from '@/services/endpoints/learning/learning'
export type {
  DashboardStats, GrowthPoint, EventStat, AuditEntry,
  RoleDistributionRow, TopStateRow, SuperDashboardStats, AdminAccount,
} from '@/services/endpoints/analytics/analytics'

// ---------------------------------------------------------------------------
// Sidebar nav item types (used by all layout components)
// ---------------------------------------------------------------------------
export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

// ---------------------------------------------------------------------------
// Dashboard overview data types
// ---------------------------------------------------------------------------
export interface RecentActivityItem {
  icon: ReactNode
  label: string
  time: string
}

export interface QuickAction {
  label: string
  href: string
  icon: ReactNode
  color: string
}

export interface UpcomingEventSummary {
  title: string
  date: string
  venue: string
}

// ---------------------------------------------------------------------------
// Signin portal type
// ---------------------------------------------------------------------------
export interface Portal {
  label: string
  description: string
  href: string
  icon: ReactNode
  color: string
}

// ---------------------------------------------------------------------------
// Profile types
// ---------------------------------------------------------------------------
export type ModalType = 'password' | '2fa' | 'sessions' | 'delete' | null
export type TfaStep = 'phone' | 'code' | 'done'

export interface ProfileCompletionItem {
  label: string
  done: boolean
}

// ---------------------------------------------------------------------------
// Signup / auth types
// ---------------------------------------------------------------------------
export type SignupRole = 'Participant' | 'Mentor' | 'Admin'

// ---------------------------------------------------------------------------
// Admin KPI / overview types
// ---------------------------------------------------------------------------
export interface AdminKpi {
  label: string
  value: string
  change: string
  icon: ReactNode
  pct: number
}

export interface AdminRecentUser {
  name: string
  email: string
  role: string
  status: string
  joined: string
}

export interface AdminRecentEvent {
  title: string
  date: string
  registered: number
  capacity: number
  status: string
}

// ---------------------------------------------------------------------------
// Mentor portal types (local UI only — data comes from hooks)
// ---------------------------------------------------------------------------
export interface MentorStat {
  label: string
  value: string
  progress: number
  icon: ReactNode
}

export interface AvailabilitySlots {
  from: string
  to: string
}

// ---------------------------------------------------------------------------
// Tab / filter types
// ---------------------------------------------------------------------------
export type OppTabType = OppType | 'all'
import type { OppType } from '@/services/endpoints/opportunities/opportunities'

// ---------------------------------------------------------------------------
// Verification types (admin UI)
// ---------------------------------------------------------------------------
export type VerificationStatus = 'verified' | 'pending' | 'rejected'
