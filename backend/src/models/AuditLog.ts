import mongoose, { Schema, Model } from 'mongoose'
import { IAuditLog } from '../types'

const auditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true },
    actor: { type: Schema.Types.ObjectId, ref: 'User' },
    actorName: { type: String },
    actorEmail: { type: String },
    targetUser: { type: Schema.Types.ObjectId, ref: 'User' },
    metadata: { type: Object },
  },
  { timestamps: true }
)

const AuditLog: Model<IAuditLog> = mongoose.model<IAuditLog>('AuditLog', auditLogSchema)
export default AuditLog
