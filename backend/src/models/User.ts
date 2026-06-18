import mongoose, { Schema, Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import { IUser, UserRole, VerificationStatus, ApprovalStatus } from '../types'

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['participant', 'mentor', 'admin', 'super-admin'] as UserRole[],
      default: 'participant',
    },
    username: { type: String, sparse: true, trim: true },
    nin: { type: String, trim: true },
    ninVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    organization: { type: String, trim: true },
    state: { type: String, trim: true },
    bio: { type: String },
    profilePhoto: { type: String },
    verificationStatus: {
      type: String,
      enum: ['verified', 'pending', 'suspended'] as VerificationStatus[],
      default: 'pending',
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'declined'] as ApprovalStatus[],
      default: 'approved',
    },
    approvalNote: { type: String },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

userSchema.virtual('fullName').get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`
})

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password as string, 10)
})

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password)
}

userSchema.methods.toPublicJSON = function (): Record<string, unknown> {
  const obj = this.toObject({ virtuals: true })
  delete obj.password
  return obj
}

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema)
export default User
