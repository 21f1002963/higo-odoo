import mongoose, { Schema, type Document, Types } from "mongoose";

export interface IAdminAction extends Document {
  adminId: Types.ObjectId;
  actionType: string;
  target: {
    type: "user" | "product" | "order" | "dispute" | "complaint" | "review" | "comment";
    id: Types.ObjectId;
  };
  reason?: string;
  description?: string;
  details?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const AdminActionSchema = new Schema<IAdminAction>({
  adminId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  actionType: { type: String, required: true, trim: true },
  target: {
    type: {
      type: String,
      required: true,
      enum: ["user", "product", "order", "dispute", "complaint", "review", "comment"],
    },
    id: { type: Schema.Types.ObjectId, required: true, index: true },
  },
  reason: { type: String, trim: true },
  description: { type: String, trim: true },
  details: Schema.Types.Mixed,
}, {
  timestamps: true,
});

export default mongoose.models.AdminAction || mongoose.model<IAdminAction>("AdminAction", AdminActionSchema);
