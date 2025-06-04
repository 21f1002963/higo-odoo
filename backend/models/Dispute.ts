import mongoose, { Schema, type Document, Types } from "mongoose";

interface IDisputeEvidence {
  url: string;
  type: string;
  uploadedAt: Date;
}

interface IDisputeMessage {
  sender: Types.ObjectId;
  message: string;
  sentAt: Date;
}

export interface IDispute extends Document {
  orderId?: Types.ObjectId;
  productId?: Types.ObjectId;
  raisedBy: Types.ObjectId;
  againstUser?: Types.ObjectId;
  subject: string;
  description: string;
  status: "open" | "under_review" | "awaiting_response" | "resolved" | "closed" | "escalated";
  evidence: IDisputeEvidence[];
  messages: IDisputeMessage[];
  resolution?: {
    resolvedBy?: Types.ObjectId;
    actionTaken?: string;
    notes?: string;
    resolvedAt?: Date;
  };
  assignedTo?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DisputeEvidenceSchema = new Schema<IDisputeEvidence>({
  url: { type: String, required: true },
  type: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
}, { _id: false });

const DisputeMessageSchema = new Schema<IDisputeMessage>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
}, { _id: false });

const DisputeSchema = new Schema<IDispute>({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", index: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", index: true },
  raisedBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  againstUser: { type: Schema.Types.ObjectId, ref: "User", index: true },
  subject: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  status: {
    type: String,
    enum: ["open", "under_review", "awaiting_response", "resolved", "closed", "escalated"],
    default: "open",
    index: true,
  },
  evidence: [DisputeEvidenceSchema],
  messages: [DisputeMessageSchema],
  resolution: {
    resolvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    actionTaken: String,
    notes: String,
    resolvedAt: Date,
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", index: true },
}, {
  timestamps: true,
});

DisputeSchema.pre<IDispute>("save", function(next) {
  if (!this.orderId && !this.productId) {
    return next(new Error("Dispute must be associated with an order or a product."));
  }
  next();
});

export default mongoose.models.Dispute || mongoose.model<IDispute>("Dispute", DisputeSchema);
