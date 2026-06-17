import mongoose, { Schema, Model, Document, Types } from 'mongoose'

export type ResourceType = 'video' | 'pdf' | 'article'

export interface ILearningResource extends Document {
  title: string
  type: ResourceType
  category: string
  duration: string
  url: string
  videoId: string
  excerpt: string
  isPublic: boolean
  createdBy: Types.ObjectId
}

const learningResourceSchema = new Schema<ILearningResource>(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['video', 'pdf', 'article'], required: true },
    category: { type: String, required: true, trim: true },
    duration: { type: String, default: '' },
    url: { type: String, default: '' },
    videoId: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

const LearningResource: Model<ILearningResource> = mongoose.model<ILearningResource>('LearningResource', learningResourceSchema)
export default LearningResource
