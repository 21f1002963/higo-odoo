import mongoose, { Schema, type Document, Types } from "mongoose";

export interface IMessageThread extends Document {
  participants: Types.ObjectId[]; // Array of User ObjectIds (typically 2)
  productId?: Types.ObjectId; // Optional: Reference to Product (context of chat)
  latestMessage?: {
    text: string;
    sentBy: Types.ObjectId; // User ObjectId
    sentAt: Date;
  };
  unreadBy: Types.ObjectId[]; // Array of User ObjectIds who haven't read the latest message
  createdAt: Date;
  updatedAt: Date; // Updated on each new message
}

const MessageThreadSchema = new Schema<IMessageThread>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    productId: { type: Schema.Types.ObjectId, ref: "Product", index: true },
    latestMessage: {
      text: String,
      sentBy: { type: Schema.Types.ObjectId, ref: "User" },
      sentAt: Date,
    },
    unreadBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
);

MessageThreadSchema.index({ participants: 1 });
MessageThreadSchema.index({ productId: 1, participants: 1 });


export default mongoose.models.MessageThread || mongoose.model<IMessageThread>("MessageThread", MessageThreadSchema);