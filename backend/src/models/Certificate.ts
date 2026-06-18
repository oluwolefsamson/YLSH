import mongoose, { Schema, Model } from 'mongoose'
import crypto from 'crypto'
import { ICertificate, CertificateType, CertificateStatus } from '../types'

const certificateSchema = new Schema<ICertificate>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    registration: { type: Schema.Types.ObjectId, ref: 'Registration' },
    type: {
      type: String,
      enum: ['Attendance', 'Completion', 'Participation'] as CertificateType[],
      default: 'Attendance',
    },
    verifyCode: { type: String, unique: true },
    status: {
      type: String,
      enum: ['issued', 'pending', 'revoked'] as CertificateStatus[],
      default: 'pending',
    },
    issuedDate: { type: Date },
    pdfUrl: { type: String },
    issuedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

certificateSchema.pre('save', async function () {
  if (!this.verifyCode) {
    const raw = crypto.randomBytes(9).toString('hex').toUpperCase()
    this.verifyCode = `YLSH-CERT-${raw.slice(0, 6)}`
  }
})

const Certificate: Model<ICertificate> = mongoose.model<ICertificate>('Certificate', certificateSchema)
export default Certificate
