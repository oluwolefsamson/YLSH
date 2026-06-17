import mongoose, { Schema, Model } from 'mongoose'
import { IEvent, EventCategory, EventStatus } from '../types'

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    date: { type: Date, required: true },
    time: { type: String },
    venue: { type: String, required: true },
    category: {
      type: String,
      enum: ['Summit', 'Workshop', 'Masterclass', 'Bootcamp', 'Conference'] as EventCategory[],
      default: 'Summit',
    },
    capacity: { type: Number, required: true, default: 100 },
    registeredCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'past'] as EventStatus[],
      default: 'upcoming',
    },
    speakers: [{ type: Schema.Types.ObjectId, ref: 'Speaker' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    tags: [String],
  },
  { timestamps: true }
)

const Event: Model<IEvent> = mongoose.model<IEvent>('Event', eventSchema)
export default Event
