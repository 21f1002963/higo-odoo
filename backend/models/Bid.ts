import mongoose, { Schema, type Document, Types } from "mongoose";

export interface IBid extends Document {
  productId: Types.ObjectId; // Reference to Product (auction)
  bidderId: Types.ObjectId; // Reference to User
  amount: number;
  bidTime: Date;
  isWinningBid?: boolean; // Optional: to mark the final winning bid
  createdAt: Date;
  updatedAt: Date;
}

const BidSchema = new Schema<IBid>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    bidderId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: [0, "Bid amount must be positive"] },
    bidTime: { type: Date, default: Date.now },
    isWinningBid: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

BidSchema.index({ productId: 1, amount: -1 }); // For finding highest bid quickly

export default mongoose.models.Bid || mongoose.model<IBid>("Bid", BidSchema);