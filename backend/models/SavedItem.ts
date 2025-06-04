import mongoose, { Schema, type Document, Types } from "mongoose";

export interface ISavedItem extends Document {
  userId: Types.ObjectId; // Reference to User
  productId: Types.ObjectId; // Reference to Product
  savedAt: Date; // from timestamps
  notes?: string; // Optional user notes about the saved item
  createdAt: Date;
  updatedAt: Date;
}

const SavedItemSchema = new Schema<ISavedItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    notes: String,
  },
  {
    timestamps: true, // `savedAt` will be `createdAt`
  },
);

SavedItemSchema.index({ userId: 1, productId: 1 }, { unique: true }); // User can save an item only once

export default mongoose.models.SavedItem || mongoose.model<ISavedItem>("SavedItem", SavedItemSchema);