import mongoose, { Schema, Model, Document, Types } from 'mongoose'

export interface IUserProgress extends Document {
  user: Types.ObjectId
  resource: Types.ObjectId
  progress: number // 0–100
  completed: boolean
  lastAccessedAt: Date
}

const userProgressSchema = new Schema<IUserProgress>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resource: { type: Schema.Types.ObjectId, ref: 'LearningResource', required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completed: { type: Boolean, default: false },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

userProgressSchema.index({ user: 1, resource: 1 }, { unique: true })

const UserProgress: Model<IUserProgress> = mongoose.model<IUserProgress>('UserProgress', userProgressSchema)
export default UserProgress
