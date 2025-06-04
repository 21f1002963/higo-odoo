import mongoose, { Schema, type Document, Types } from "mongoose";

interface IMessage {
  sender: Types.ObjectId;
  text: string;
  sentAt: Date;
  isRead: boolean;
}

export interface IMessageThread extends Document {
  participants: Types.ObjectId[];
  productId?: Types.ObjectId;
  messages: IMessage[];
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
}, { _id: false });

const MessageThreadSchema = new Schema<IMessageThread>({
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  messages: [MessageSchema],
  lastMessageAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

export default mongoose.models.MessageThread || mongoose.model<IMessageThread>("MessageThread", MessageThreadSchema);
