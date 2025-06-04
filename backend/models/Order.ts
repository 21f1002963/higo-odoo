import mongoose, { Schema, type Document, Types } from "mongoose";

interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  purchasePrice: number;
  titleSnapshot: string;
  imageSnapshot?: string;
}

export interface IOrder extends Document {
  buyerId: Types.ObjectId;
  sellerId: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  shippingMethod?: string;
  shippingCost?: number;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned" | "payment_failed";
  purchasedAt: Date;
  deliveredAt?: Date;
  trackingNumber?: string;
  paymentDetails: {
    method?: string;
    transactionId?: string;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
  };
  buyerRatingGiven?: boolean;
  sellerRatingGiven?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  purchasePrice: { type: Number, required: true, min: 0 },
  titleSnapshot: { type: String, required: true },
  imageSnapshot: String,
}, {_id: false});

const OrderSchema = new Schema<IOrder>({
  buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  items: {
    type: [OrderItemSchema],
    required: true,
    validate: {
      validator: (v: IOrderItem[]) => Array.isArray(v) && v.length > 0,
      message: "Order must contain at least one item."
    }
  },
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: String,
  },
  shippingMethod: String,
  shippingCost: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    required: true,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled", "returned", "payment_failed"],
    default: "pending",
    index: true,
  },
  purchasedAt: { type: Date, default: Date.now },
  deliveredAt: Date,
  trackingNumber: String,
  paymentDetails: {
    method: String,
    transactionId: { type: String, index: true },
    paymentStatus: { type: String, required: true, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  },
  buyerRatingGiven: { type: Boolean, default: false },
  sellerRatingGiven: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
