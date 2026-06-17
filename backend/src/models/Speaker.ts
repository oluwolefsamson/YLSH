import mongoose, { Schema, Model } from 'mongoose'
import { ISpeaker } from '../types'

const speakerSchema = new Schema<ISpeaker>(
  {
    name: { type: String, required: true, trim: true },
    bio: { type: String },
    photo: { type: String },
    topic: { type: String },
    organization: { type: String },
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    socialLinks: {
      twitter: String,
      linkedin: String,
    },
  },
  { timestamps: true }
)

const Speaker: Model<ISpeaker> = mongoose.model<ISpeaker>('Speaker', speakerSchema)
export default Speaker
