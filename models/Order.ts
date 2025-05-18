import mongoose, { Schema, type Document } from "mongoose"

interface OrderItem {
  product: mongoose.Types.ObjectId
  quantity: number
  price: number
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId
  items: OrderItem[]
  totalAmount: number
  status: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Please provide a product"],
        },
        quantity: {
          type: Number,
          required: [true, "Please provide a quantity"],
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "Please provide a price"],
          min: [0, "Price must be at least 0"],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Please provide a total amount"],
      min: [0, "Total amount must be at least 0"],
    },
    status: {
      type: String,
      required: [true, "Please provide a status"],
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
