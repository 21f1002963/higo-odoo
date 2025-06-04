import mongoose, { Schema, type Document, Types } from "mongoose";

interface ICartItem {
  productId: Types.ObjectId; // Reference to Product
  quantity: number;
  addedAt: Date;
  // Optional: priceAtAdd, titleAtAdd for cart consistency if prices change
  priceSnapshot?: number;
  titleSnapshot?: string;
  imageSnapshot?: string;
}

export interface ICart extends Document {
  userId: Types.ObjectId; // Reference to User, can be unique if one cart per user
  items: ICartItem[];
  // Optional: guestCartId if supporting guest carts
  // guestCartId?: string;
  lastActivityAt: Date; // from timestamps.updatedAt
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    addedAt: { type: Date, default: Date.now },
    priceSnapshot: Number,
    titleSnapshot: String,
    imageSnapshot: String,
  },
  { _id: false },
); // No _id for subdocuments unless needed

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true }, // Assuming one active cart per user
    // guestCartId: { type: String, unique: true, sparse: true, index: true }, // For guest carts
    items: [CartItemSchema],
  },
  {
    timestamps: true, // `lastActivityAt` will be `updatedAt`
  },
);

// Ensure either userId or guestCartId is present
// CartSchema.pre<ICart>("save", function (next) {
//   if (!this.userId && !this.guestCartId) {
//     next(new Error("Cart must have either a userId or a guestCartId."));
//   } else {
//     next();
//   }
// });

export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);