import mongoose, { Schema, type Document, Types } from "mongoose";

interface IDisputeEvidence {
  type: "image" | "text" | "document" | "video";
  urlOrText: string; // URL for files, or text directly
  description?: string;
  uploadedBy: Types.ObjectId; // User who uploaded
  uploadedAt: Date;
}

interface IDisputeMessage {
  senderId: Types.ObjectId; // User or Admin
  message: string;
  sentAt: Date;
}

export interface IDispute extends Document {
  orderId?: Types.ObjectId; // Reference to Order (if dispute over a transaction)
  productId?: Types.ObjectId; // Optional: Reference to Product (if dispute about item details not tied to an order)
  raisedBy: Types.ObjectId; // User who opened the dispute
  againstUser?: Types.ObjectId; // Counterparty in the dispute
  subject: string;
  description: string;
  status: "open" | "under_review" | "awaiting_response" | "resolved" | "closed" | "escalated";
  evidence?: IDisputeEvidence[];
  messages?: IDisputeMessage[]; // Platform-mediated communication
  resolution?: {
    resolvedBy?: Types.ObjectId; // Admin User
    actionTaken?: string; // e.g., "Refund issued", "Partial refund", "No fault found"
    notes?: string;
    resolvedAt?: Date;
  };
  assignedTo?: Types.ObjectId; // Admin User handling the dispute
  createdAt: Date;
  updatedAt: Date;
}

const DisputeEvidenceSchema = new Schema<IDisputeEvidence>({
  type: { type: String, enum: ["image", "text", "document", "video"], required: true },
  urlOrText: { type: String, required: true },
  description: String,
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  uploadedAt: { type: Date, default: Date.now }
}, {_id: false});

const DisputeMessageSchema = new Schema<IDisputeMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Can be admin or user
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now }
}, {_id: false});

const DisputeSchema = new Schema<IDispute>(
  {
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
      resolvedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin
      actionTaken: String,
      notes: String,
      resolvedAt: Date,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", index: true }, // Admin
  },
  {
    timestamps: true,
  },
);

DisputeSchema.pre<IDispute>("save", function(next) {
    if (!this.orderId && !this.productId) {
        return next(new Error("Dispute must be associated with an order or a product."));
    }
    next();
});

export default mongoose.models.Dispute || mongoose.model<IDispute>("Dispute", DisputeSchema);