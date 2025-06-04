import mongoose, { Schema, type Document, Types } from "mongoose";

export interface IAdminAction extends Document {
  adminId: Types.ObjectId; // Reference to User (must have role "admin")
  actionType: string; // e.g., "Ban User", "Remove Listing", "Resolve Dispute", "Approve Listing"
  target: {
    type: "user" | "product" | "order" | "dispute" | "complaint" | "review" | "comment";
    id: Types.ObjectId; // Reference to corresponding collection
  };
  reason?: string; // Reason for the action
  description?: string; // Notes on what was done
  details?: Record<string, any>; // e.g. previous status, new status
  createdAt: Date; // from timestamps
  updatedAt: Date; // from timestamps
}

const AdminActionSchema = new Schema<IAdminAction>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    actionType: { type: String, required: true, trim: true },
    target: {
      type: {
        type: String, // Mongoose requires 'type' for sub-document's type field
        required: true,
        enum: ["user", "product", "order", "dispute", "complaint", "review", "comment"],
      },
      id: { type: Schema.Types.ObjectId, required: true, index: true }, // Should refPath based on target.type
    },
    reason: { type: String, trim: true },
    description: { type: String, trim: true },
    details: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.AdminAction || mongoose.model<IAdminAction>("AdminAction", AdminActionSchema);