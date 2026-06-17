import mongoose, { Schema, Model, Document, Types } from 'mongoose'

export type OppType = 'job' | 'internship' | 'grant' | 'scholarship'

export interface IOpportunity extends Document {
  title: string
  organization: string
  type: OppType
  deadline: Date
  location: string
  description: string
  amount: string
  requirements: string
  link: string
  isActive: boolean
  createdBy: Types.ObjectId
}

const opportunitySchema = new Schema<IOpportunity>(
  {
    title: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    type: { type: String, enum: ['job', 'internship', 'grant', 'scholarship'], required: true },
    deadline: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    amount: { type: String, default: '' },
    requirements: { type: String, default: '' },
    link: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

const Opportunity: Model<IOpportunity> = mongoose.model<IOpportunity>('Opportunity', opportunitySchema)
export default Opportunity
