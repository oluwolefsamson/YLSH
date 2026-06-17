import mongoose, { Schema, Model, CallbackWithoutResultAndOptionalError } from 'mongoose'
import crypto from 'crypto'
import { IRegistration, RegistrationStatus } from '../types'

const registrationSchema = new Schema<IRegistration>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    qrToken: { type: String, unique: true },
    status: {
      type: String,
      enum: ['registered', 'waitlisted', 'attended', 'cancelled'] as RegistrationStatus[],
      default: 'registered',
    },
    checkedInAt: { type: Date },
    checkedInBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

registrationSchema.index({ user: 1, event: 1 }, { unique: true })

registrationSchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
  if (!this.qrToken) {
    const raw = crypto.randomBytes(6).toString('hex').toUpperCase()
    this.qrToken = `YLS-${raw.slice(0, 4)}-${raw.slice(4)}`
  }
  next()
})

const Registration: Model<IRegistration> = mongoose.model<IRegistration>('Registration', registrationSchema)
export default Registration
