import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  rating: number;
  reviews: Array<{
    reviewer: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    timestamp: Date;
  }>;
  savedProducts: mongoose.Types.ObjectId[];
  otp?: string;
  otpExpires?: Date;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  bio: { type: String },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  rating: { type: Number, default: 0 },
  reviews: [{
    reviewer: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
    comment: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  savedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  otp: { type: String },
  otpExpires: { type: Date },
  phoneVerified: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

// Index for geospatial queries
UserSchema.index({ location: '2dsphere' });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
