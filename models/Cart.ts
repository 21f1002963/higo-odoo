import mongoose, { Schema, type Document } from "mongoose"

interface CartItem {
  product: mongoose.Types.ObjectId
  quantity: number
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId
  items: CartItem[]
  createdAt: Date
  updatedAt: Date
}

const CartSchema = new Schema<ICart>(
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
          default: 1,
        },
      },
    ],
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

export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema)
