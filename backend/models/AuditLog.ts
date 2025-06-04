import mongoose, { Schema, type Document, Types } from "mongoose";

export interface IAuditLog extends Document {
  entityType: string;
  entityId?: Types.ObjectId;
  action: string;
  changedBy?: Types.ObjectId;
  changedByType?: string;
  details?: {
    previousValues?: Record<string, any>;
    newValues?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  entityType: {
    type: String,
    required: true,
    enum: ["user", "product", "order", "dispute", "cart", "bid", "rating", "complaint", "admin_action", "system"],
    index: true,
  },
  entityId: { type: Schema.Types.ObjectId, index: true },
  action: { type: String, required: true, index: true },
  changedBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
  changedByType: { type: String, enum: ["user", "admin", "system"] },
  details: {
    previousValues: Schema.Types.Mixed,
    newValues: Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
    notes: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
