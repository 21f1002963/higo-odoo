import mongoose, { Schema, type Document, Types } from "mongoose";

export interface IRating extends Document {
  orderId: Types.ObjectId; // Reference to Order
  reviewerId: Types.ObjectId; // User giving the rating
  revieweeId: Types.ObjectId; // User being rated (seller or buyer)
  revieweeType: "user" | "product"; // To distinguish if rating a user or product directly
  productId?: Types.ObjectId; // Optional: Reference to Product (if rating product specifically)
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    revieweeId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }, // Could also ref Product if rating products
    revieweeType: { type: String, enum: ["user", "product"], required: true, default: "user"},
    productId: { type: Schema.Types.ObjectId, ref: "Product", index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000 },
  },
  {
    timestamps: true,
  },
);

RatingSchema.index({ orderId: 1, reviewerId: 1 }, { unique: true }); // Ensure one rating per reviewer per order
RatingSchema.index({ revieweeId: 1, rating: 1 }); // For calculating average ratings

export default mongoose.models.Rating || mongoose.model<IRating>("Rating", RatingSchema);