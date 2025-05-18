import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  clerkId: string
  name: string
  email: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: [true, "Clerk ID is required"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    image: {
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
  },
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
