import mongoose, { Schema, type Document, Types } from "mongoose";

export interface INotification extends Document {
  userId: Types.ObjectId; // User to receive this notification
  type: string; // e.g., "new_message", "outbid", "price_drop", "listing_approved", "order_shipped"
  title: string; // Short title for the notification
  text: string; // Notification content/message
  relatedEntity?: {
    type: "product" | "order" | "user" | "message_thread" | "dispute" | "bid";
    id?: Types.ObjectId;
  };
  isRead: boolean;
  readAt?: Date;
  link?: string; // Optional deep link into the app
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true, index: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    relatedEntity: {
      type: { type: String, enum: ["product", "order", "user", "message_thread", "dispute", "bid"] },
      id: { type: Schema.Types.ObjectId }, // Should refPath based on relatedEntity.type
    },
    isRead: { type: Boolean, default: false, index: true },
    readAt: Date,
    link: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);