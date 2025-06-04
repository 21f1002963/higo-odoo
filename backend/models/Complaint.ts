import mongoose, { Schema, type Document, Types } from "mongoose";

export interface IComplaint extends Document {
  complainantId: Types.ObjectId; // User who filed the complaint
  targetType: "user" | "listing" | "system" | "comment" | "review";
  targetId: Types.ObjectId; // Reference to User, Product, etc.
  reason: string; // e.g., "Inappropriate content", "Spam", "Harassment"
  description?: string;
  status: "pending_review" | "in_progress" | "resolved_action_taken" | "resolved_no_action" | "dismissed";
  adminNotes?: string;
  assignedTo?: Types.ObjectId; // Admin User handling it
  resolutionDetails?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    complainantId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    targetType: {
      type: String,
      required: true,
      enum: ["user", "listing", "system", "comment", "review"], // 'listing' for product
    },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true }, // Should refPath based on targetType if possible, or handle in app logic
    reason: { type: String, required: true, trim: true, maxlength: 255 },
    description: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["pending_review", "in_progress", "resolved_action_taken", "resolved_no_action", "dismissed"],
      default: "pending_review",
      index: true,
    },
    adminNotes: String,
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", index: true }, // Admin
    resolutionDetails: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Complaint || mongoose.model<IComplaint>("Complaint", ComplaintSchema);