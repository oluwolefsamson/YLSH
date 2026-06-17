import mongoose, { Schema, Model } from 'mongoose'
import { Document, Types } from 'mongoose'

export interface IMentorProfile extends Document {
  user: Types.ObjectId
  headline: string
  category: string
  yearsExperience: number
  rating: number
  totalSessions: number
  bio: string
  skills: string[]
  availability: string // e.g. "Weekdays (PM)"
  availableDays: string[]
  startTime: string
  endTime: string
  sessionDuration: number // minutes
  maxPerWeek: number
  isPublic: boolean
  meetLink: string
}

const mentorProfileSchema = new Schema<IMentorProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    headline: { type: String, default: '' },
    category: { type: String, default: 'General' },
    yearsExperience: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    availability: { type: String, default: 'Flexible' },
    availableDays: [{ type: String }],
    startTime: { type: String, default: '09:00' },
    endTime: { type: String, default: '17:00' },
    sessionDuration: { type: Number, default: 60 },
    maxPerWeek: { type: Number, default: 5 },
    isPublic: { type: Boolean, default: true },
    meetLink: { type: String, default: '' },
  },
  { timestamps: true }
)

const MentorProfile: Model<IMentorProfile> = mongoose.model<IMentorProfile>('MentorProfile', mentorProfileSchema)
export default MentorProfile
