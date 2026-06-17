import mongoose, { Schema, Model } from 'mongoose'
import { IVolunteer, VolunteerStatus } from '../types'

const volunteerSchema = new Schema<IVolunteer>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    role: { type: String, trim: true, default: 'General Volunteer' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'] as VolunteerStatus[],
      default: 'pending',
    },
  },
  { timestamps: true }
)

volunteerSchema.index({ user: 1, event: 1 }, { unique: true })

const Volunteer: Model<IVolunteer> = mongoose.model<IVolunteer>('Volunteer', volunteerSchema)
export default Volunteer
