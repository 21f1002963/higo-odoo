import mongoose, { Schema, type Document, Types } from "mongoose";

export interface IChatMessage extends Document {
  messageThreadId: Types.ObjectId; // Reference to MessageThread
  senderId: Types.ObjectId; // Reference to User
  text: string;
  sentAt: Date; // Provided by timestamps: true
  isReadBy?: Types.ObjectId[]; // Track individual read receipts if needed
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    messageThreadId: { type: Schema.Types.ObjectId, ref: "MessageThread", required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    isReadBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true, // sentAt will be createdAt
  },
);

export default mongoose.models.ChatMessage || mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);