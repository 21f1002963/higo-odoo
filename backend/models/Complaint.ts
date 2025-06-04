import mongoose, { Schema, type Document, Types } from "mongoose";

export interface IComplaint extends Document {
  complainantId: Types.ObjectId;
  targetType: "user" | "listing" | "system" | "comment" | "review";
  targetId: Types.ObjectId;
  reason: string;
  description?: string;
  status: "pending_review" | "in_progress" | "resolved_action_taken" | "resolved_no_action" | "dismissed";
  adminNotes?: string;
  assignedTo?: Types.ObjectId;
  resolutionDetails?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>({
  complainantId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  targetType: {
    type: String,
    required: true,
    enum: ["user", "listing", "system", "comment", "review"],
  },
  targetId: { type: Schema.Types.ObjectId, required: true, index: true },
  reason: { type: String, required: true, trim: true, maxlength: 255 },
  description: { type: String, trim: true, maxlength: 2000 },
  status: {
    type: String,
    enum: ["pending_review", "in_progress", "resolved_action_taken", "resolved_no_action", "dismissed"],
    default: "pending_review",
    index: true,
  },
  adminNotes: String,
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", index: true },
  resolutionDetails: String,
}, {
  timestamps: true,
});

export default mongoose.models.Complaint || mongoose.model<IComplaint>("Complaint", ComplaintSchema);
