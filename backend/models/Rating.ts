import mongoose, { Schema, type Document, Types } from "mongoose";

export interface IRating extends Document {
  orderId: Types.ObjectId;
  reviewerId: Types.ObjectId;
  revieweeId: Types.ObjectId;
  revieweeType: "user" | "product";
  productId?: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
  reviewerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  revieweeId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  revieweeType: { type: String, enum: ["user", "product"], required: true, default: "user"},
  productId: { type: Schema.Types.ObjectId, ref: "Product", index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 1000 },
}, {
  timestamps: true,
});

RatingSchema.index({ orderId: 1, reviewerId: 1 }, { unique: true });
RatingSchema.index({ revieweeId: 1, rating: 1 });

export default mongoose.models.Rating || mongoose.model<IRating>("Rating", RatingSchema);
