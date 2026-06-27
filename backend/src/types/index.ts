import { Document, Types } from 'mongoose'

// ─── Enums ───────────────────────────────────────────────────────────────────
export type UserRole = 'participant' | 'mentor' | 'admin' | 'super-admin'
export type VerificationStatus = 'verified' | 'pending' | 'suspended'
export type ApprovalStatus = 'pending' | 'approved' | 'declined'
export type EventStatus = 'upcoming' | 'ongoing' | 'past'
export type EventCategory = 'Summit' | 'Workshop' | 'Masterclass' | 'Bootcamp' | 'Conference'
export type RegistrationStatus = 'registered' | 'waitlisted' | 'attended' | 'cancelled'
export type CertificateType = 'Attendance' | 'Completion' | 'Participation'
export type CertificateStatus = 'issued' | 'pending' | 'revoked'
export type VolunteerStatus = 'pending' | 'approved' | 'rejected'

// ─── Model Interfaces ─────────────────────────────────────────────────────────
export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  role: UserRole
  username?: string
  nin?: string
  ninVerified: boolean
  emailVerified: boolean
  organization?: string
  state?: string
  bio?: string
  profilePhoto?: string
  verificationStatus: VerificationStatus
  approvalStatus: ApprovalStatus
  approvalNote?: string
  approvedBy?: Types.ObjectId
  approvedAt?: Date
  lastActive: Date
  fullName: string // virtual
  comparePassword(candidate: string): Promise<boolean>
  toPublicJSON(): Record<string, unknown>
}

export interface IEvent extends Document {
  title: string
  description?: string
  date: Date
  endDate?: Date
  time?: string
  venue: string
  category: EventCategory
  capacity?: number | null
  registeredCount: number
  status: EventStatus
  speakers: Types.ObjectId[]
  createdBy?: Types.ObjectId
  tags: string[]
}

export interface IRegistration extends Document {
  user: Types.ObjectId
  event: Types.ObjectId
  qrToken: string
  status: RegistrationStatus
  checkedInAt?: Date
  checkedInBy?: Types.ObjectId
}

export interface ICertificate extends Document {
  user: Types.ObjectId
  event: Types.ObjectId
  registration?: Types.ObjectId
  type: CertificateType
  verifyCode: string
  status: CertificateStatus
  issuedDate?: Date
  pdfUrl?: string
  issuedBy?: Types.ObjectId
}

export interface ISpeaker extends Document {
  name: string
  bio?: string
  photo?: string
  topic?: string
  organization?: string
  events: Types.ObjectId[]
  socialLinks?: { twitter?: string; linkedin?: string }
}

export interface IVolunteer extends Document {
  user: Types.ObjectId
  event: Types.ObjectId
  role: string
  status: VolunteerStatus
}

export interface IAuditLog extends Document {
  action: string
  actor?: Types.ObjectId
  actorName?: string
  actorEmail?: string
  targetUser?: Types.ObjectId
  metadata?: Record<string, unknown>
}

// ─── Request / Response payloads ─────────────────────────────────────────────
export interface RegisterBody {
  firstName: string
  lastName: string
  email: string
  phone?: string
  organization?: string
  nin: string
  role?: string
  username?: string
  password: string
}

export interface LoginBody {
  email: string
  password: string
}

export interface CreateAdminBody {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

export interface PaginationQuery {
  page?: string
  limit?: string
}

export interface UserListQuery extends PaginationQuery {
  search?: string
  status?: string
  role?: string
}

// ─── JWT Payload ──────────────────────────────────────────────────────────────
export interface JwtPayload {
  id: string
}
