import mongoose, { Schema, type Document, Types } from "mongoose";

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: string;
  title: string;
  text: string;
  relatedEntity?: {
    type: string;
    id: Types.ObjectId;
  };
  isRead: boolean;
  readAt?: Date;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, required: true, index: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  relatedEntity: {
    type: { type: String, enum: ["product", "order", "user", "message_thread", "dispute", "bid"] },
    id: { type: Schema.Types.ObjectId },
  },
  isRead: { type: Boolean, default: false, index: true },
  readAt: Date,
  link: String,
}, {
  timestamps: true,
});

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
