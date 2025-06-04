import mongoose, { Schema, type Document, Types } from "mongoose";

export interface IBid extends Document {
  productId: Types.ObjectId;
  bidderId: Types.ObjectId;
  amount: number;
  bidTime: Date;
  isWinningBid: boolean;
}

const BidSchema = new Schema<IBid>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  bidderId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  amount: { type: Number, required: true, min: [0, "Bid amount must be positive"] },
  bidTime: { type: Date, default: Date.now },
  isWinningBid: { type: Boolean, default: false },
}, {
  timestamps: true,
});

BidSchema.index({ productId: 1, amount: -1 });

export default mongoose.models.Bid || mongoose.model<IBid>("Bid", BidSchema);
