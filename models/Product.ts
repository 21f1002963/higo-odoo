import mongoose, { Schema, type Document } from "mongoose"

export interface IProduct extends Document {
  title: string
  description: string
  price: number
  category: string
  condition: string
  images: string[]
  seller: mongoose.Types.ObjectId
  quantity: number
  brand?: string
  model?: string
  year?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  weight?: number
  material?: string
  color?: string
  originalPackaging: boolean
  manualIncluded: boolean
  workingCondition?: string
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: [0, "Price must be at least 0"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: ["Electronics", "Clothing", "Furniture", "Books", "Home", "Sports", "Toys", "Other"],
    },
    condition: {
      type: String,
      required: [true, "Please provide the condition"],
      enum: ["New", "Like New", "Good", "Fair", "Poor"],
    },
    images: {
      type: [String],
      required: [true, "Please provide at least one image"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "Please provide at least one image",
      },
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a seller"],
    },
    quantity: {
      type: Number,
      required: [true, "Please provide quantity"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
    brand: {
      type: String,
    },
    model: {
      type: String,
    },
    year: {
      type: Number,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    weight: {
      type: Number,
    },
    material: {
      type: String,
    },
    color: {
      type: String,
    },
    originalPackaging: {
      type: Boolean,
      default: false,
    },
    manualIncluded: {
      type: Boolean,
      default: false,
    },
    workingCondition: {
      type: String,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
