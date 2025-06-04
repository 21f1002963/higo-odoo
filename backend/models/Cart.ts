import mongoose, { Schema, type Document, Types } from "mongoose";

interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
  addedAt: Date;
  priceSnapshot?: number;
  titleSnapshot?: string;
  imageSnapshot?: string;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: ICartItem[];
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  addedAt: { type: Date, default: Date.now },
  priceSnapshot: Number,
  titleSnapshot: String,
  imageSnapshot: String,
}, { _id: false });

const CartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
  items: [CartItemSchema],
}, {
  timestamps: true,
});

export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
