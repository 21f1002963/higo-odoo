import mongoose, { Schema, type Document, Types } from "mongoose";

export interface IAuditLog extends Document {
  entityType: "user" | "product" | "order" | "dispute" | "cart" | "bid" | "rating" | "complaint" | "admin_action" | "system";
  entityId?: Types.ObjectId; // Can be null for system-wide actions
  action: string; // e.g., "created", "updated", "deleted", "status_changed", "login_success", "login_fail"
  changedBy?: Types.ObjectId; // User or Admin who performed the action, or null for system
  changedByType?: "user" | "admin" | "system";
  timestamp: Date; // from timestamps.createdAt
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

const AuditLogSchema = new Schema<IAuditLog>(
  {
    entityType: {
      type: String,
      required: true,
      enum: ["user", "product", "order", "dispute", "cart", "bid", "rating", "complaint", "admin_action", "system"],
      index: true,
    },
    entityId: { type: Schema.Types.ObjectId, index: true }, // Not always required (e.g. system action)
    action: { type: String, required: true, index: true },
    changedBy: { type: Schema.Types.ObjectId, ref: "User", index: true }, // Could be a User or Admin
    changedByType: { type: String, enum: ["user", "admin", "system"] },
    details: {
      previousValues: Schema.Types.Mixed,
      newValues: Schema.Types.Mixed,
      ipAddress: String,
      userAgent: String,
      notes: String,
    },
  },
  {
    timestamps: true, // `timestamp` will be `createdAt`
  },
);

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);