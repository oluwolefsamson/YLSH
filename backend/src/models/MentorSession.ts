import mongoose, { Schema, Model, Document, Types } from 'mongoose'

export type SessionStatus = 'scheduled' | 'completed' | 'cancelled'

export interface IMentorSession extends Document {
  mentor: Types.ObjectId
  mentee: Types.ObjectId
  topic: string
  scheduledAt: Date
  duration: number // minutes
  status: SessionStatus
  meetLink: string
  outcome: string
  rating: number | null
}

const mentorSessionSchema = new Schema<IMentorSession>(
  {
    mentor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mentee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true, trim: true },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, default: 60 },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
    meetLink: { type: String, default: '' },
    outcome: { type: String, default: '' },
    rating: { type: Number, default: null },
  },
  { timestamps: true }
)

const MentorSession: Model<IMentorSession> = mongoose.model<IMentorSession>('MentorSession', mentorSessionSchema)
export default MentorSession
