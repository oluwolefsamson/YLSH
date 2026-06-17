import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

// ---------------------------------------------------------------------------
// Certificate types
// ---------------------------------------------------------------------------

export type CertStatus = 'issued' | 'pending'

export interface Certificate {
  id: number
  title: string
  issuedDate: string
  type: string
  status: CertStatus
  verifyCode: string | null
}

// ---------------------------------------------------------------------------
// Event types
// ---------------------------------------------------------------------------

export type EventStatus = 'upcoming' | 'past'

export interface DashboardEvent {
  id: number
  title: string
  date: string
  time: string
  venue: string
  category: string
  capacity: number
  registered: number
  description: string
  status: EventStatus
}

export interface EventRegistration {
  id: number
  eventTitle: string
  date: string
  qrToken: string
}

// ---------------------------------------------------------------------------
// Opportunity types
// ---------------------------------------------------------------------------

export type OppType = 'job' | 'internship' | 'grant' | 'scholarship'

export interface Opportunity {
  id: number
  title: string
  organization: string
  type: OppType
  deadline: string
  location: string
  description: string
  amount?: string
}

export interface OpportunityApplication {
  id: number
  title: string
  org: string
  status: string
  appliedDate: string
}

export type TabType = OppType | 'all'

// ---------------------------------------------------------------------------
// Mentorship types
// ---------------------------------------------------------------------------

export interface Mentor {
  id: number
  name: string
  role: string
  company: string
  category: string
  rating: number
  sessions: number
  bio: string
  availability: string
  initials: string
  color: string
}

export type SessionStatus = 'upcoming' | 'completed'

export interface MentorSession {
  id: number
  mentorName: string
  topic: string
  date: string
  time: string
  status: SessionStatus
  mode: string
  meetLink: string
}

// ---------------------------------------------------------------------------
// Learning types
// ---------------------------------------------------------------------------

export type ResourceType = 'video' | 'pdf' | 'article'

export interface LearningResource {
  id: number
  title: string
  type: ResourceType
  category: string
  duration: string
  progress: number
  completed: boolean
  videoId: string
  excerpt: string
}

// ---------------------------------------------------------------------------
// Profile types
// ---------------------------------------------------------------------------

export type ModalType = 'password' | '2fa' | 'sessions' | 'delete' | null

export type TfaStep = 'phone' | 'code' | 'done'

export interface ProfileForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  state: string
  bio: string
  occupation: string
  institution: string
}

export interface ProfileCompletionItem {
  label: string
  done: boolean
}

// ---------------------------------------------------------------------------
// Signup / auth types
// ---------------------------------------------------------------------------

export type SignupRole = 'Participant' | 'Mentor' | 'Admin'

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
// Admin / Super-admin types
// ---------------------------------------------------------------------------

export type UserStatus = 'verified' | 'pending' | 'suspended'
export type UserRole = 'Participant' | 'Mentor' | 'Admin' | 'Super Admin'

export interface AdminUser {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  joined: string
  state: string
}

export interface AdminEvent {
  id: number
  title: string
  date: string
  venue: string
  category: string
  capacity: number
  registered: number
  status: EventStatus
}

export interface AdminKpi {
  label: string
  value: string
  change: string
  icon: ReactNode
  pct: number
}

export interface AdminTopEvent {
  title: string
  attendees: number
  capacity: number
  certificates: number
}

export interface AdminUserGrowthPoint {
  month: string
  count: number
}

// ---------------------------------------------------------------------------
// Mentor portal types
// ---------------------------------------------------------------------------

export type MentorSessionStatus = 'upcoming' | 'completed' | 'cancelled'

export interface MentorPortalSession {
  id: number
  mentee: string
  topic: string
  date: string
  time: string
  duration: string
  status: MentorSessionStatus
  outcome: string | null
}

export interface Mentee {
  id: number
  name: string
  role: string
  sessions: number
  lastSession: string
  rating: number | null
  status: 'active' | 'completed'
  initials: string
  color: string
}

export interface MentorStat {
  label: string
  value: string
  progress: number
  icon: ReactNode
}

export interface MentorUpcomingSession {
  name: string
  topic: string
  date: string
  time: string
}

export interface MentorRecentActivity {
  text: string
  meta: string
  done: boolean
}

export interface MentorImpactRow {
  icon: ReactNode
  label: string
  value: string
}

export interface AvailabilitySlots {
  from: string
  to: string
}

// ---------------------------------------------------------------------------
// Verification types
// ---------------------------------------------------------------------------

export type VerificationStatus = 'verified' | 'pending' | 'rejected'

export interface VerificationRecord {
  id: number
  name: string
  email: string
  ninRef: string
  submittedDate: string
  status: VerificationStatus
}

// ---------------------------------------------------------------------------
// Role management types
// ---------------------------------------------------------------------------

export interface RbacRole {
  name: string
  count: number
  color: string
  permissions: string[]
}

export interface RoleUser {
  id: number
  name: string
  email: string
  role: UserRole
}

// ---------------------------------------------------------------------------
// Super-admin event type (extends AdminEvent with optional certificates field)
// ---------------------------------------------------------------------------

export interface SuperAdminEvent extends AdminEvent {
  certificates: number
}

// ---------------------------------------------------------------------------
// Super-admin analytics types
// ---------------------------------------------------------------------------

export interface RoleDistributionRow {
  role: string
  count: number
  pct: number
}

export interface TopStateRow {
  state: string
  users: number
}

// ---------------------------------------------------------------------------
// Admin overview types
// ---------------------------------------------------------------------------

export interface AdminOverviewStat {
  label: string
  value: string
  progress: number
  icon: ReactNode
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
// Super-admin overview types
// ---------------------------------------------------------------------------

export interface SuperAdminAccount {
  name: string
  email: string
  role: string
  lastActive: string
  status: string
}

export interface AuditLogEntry {
  action: string
  actor: string
  time: string
}
