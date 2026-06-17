import mongoose, { Schema, Model, Document, Types } from 'mongoose'

export type ApplicationStatus = 'pending' | 'under_review' | 'shortlisted' | 'rejected' | 'accepted'

export interface IApplication extends Document {
  opportunity: Types.ObjectId
  applicant: Types.ObjectId
  coverLetter: string
  status: ApplicationStatus
}

const applicationSchema = new Schema<IApplication>(
  {
    opportunity: { type: Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    coverLetter: { type: String, required: true },
    status: { type: String, enum: ['pending', 'under_review', 'shortlisted', 'rejected', 'accepted'], default: 'pending' },
  },
  { timestamps: true }
)

// one application per user per opportunity
applicationSchema.index({ opportunity: 1, applicant: 1 }, { unique: true })

const Application: Model<IApplication> = mongoose.model<IApplication>('Application', applicationSchema)
export default Application
