import mongoose, { Schema, type Document, Types } from "mongoose";

interface ISavedSearch extends Document {
  criteria: {
    keyword?: string;
    category?: string;
    filters?: {
      priceMin?: number;
      priceMax?: number;
      condition?: string;
      sellerRatingMin?: number;
      distanceMaxKm?: number;
      otherCriteria?: Record<string, any>;
    };
  };
  notifications: {
    email: boolean;
    push: boolean;
  };
  createdAt: Date;
}

export interface IUser extends Document {
  clerkId: string; // Kept from existing schema, essential for Clerk integration
  username: string; // New from specification
  email: string;
  emailVerified?: boolean; // New
  phoneNumber?: string; // Renamed from 'phone' for clarity
  phoneVerified?: boolean; // New
  passwordHash?: string; // New (if not solely relying on Clerk for auth)
  profile: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    avatarUrl?: string; // Maps to existing 'image'
    bio?: string; // Maps to existing 'Bio'
    location?: { // Enhanced location
      city?: string;
      state?: string;
      country?: string;
      coordinates?: [number, number]; // [longitude, latitude]
      addressText?: string; // Kept simple text location if needed
    };
    preferredLanguage: string; // Existing
  };
  roles: string[];
  savedSearches?: ISavedSearch[];
  watchlist?: Types.ObjectId[]; // Array of Product ObjectIds
  purchaseHistory?: Types.ObjectId[]; // Array of Order ObjectIds
  disputes?: Types.ObjectId[]; // Array of Dispute ObjectIds
  notifications?: {
    unreadCount?: number;
    preferences?: {
      emailOnMessage?: boolean;
      emailOnAuctionOutbid?: boolean;
      pushOnMessage?: boolean;
      pushOnAuctionOutbid?: boolean;
    };
  };
  communicationPreference?: string; // Existing, could be part of notifications.preferences
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SavedSearchSchema = new Schema<ISavedSearch>({
  criteria: {
    keyword: String,
    category: String,
    filters: {
      priceMin: Number,
      priceMax: Number,
      condition: String,
      sellerRatingMin: Number,
      distanceMaxKm: Number,
      otherCriteria: Schema.Types.Mixed,
    },
  },
  notifications: {
    email: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
  },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: [true, "Clerk ID is required"],
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
      index: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
      // unique: true, // Consider implications if multiple users might share a device temporarily
      // index: true, // Add if frequently searched by phone
      trim: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    passwordHash: {
      type: String,
      // select: false, // Typically not selected by default
    },
    profile: {
      firstName: String,
      lastName: String,
      displayName: String,
      avatarUrl: String, // Existing 'image' field can map here
      bio: String, // Existing 'Bio' field
      location: {
        city: String,
        state: String,
        country: String,
        coordinates: { // For geo-queries
          type: [Number], // [longitude, latitude]
          index: "2dsphere", // Optional: if you need geospatial queries
        },
        addressText: String, // Existing 'location' field
      },
      preferredLanguage: {
        type: String,
        required: [true, "Please provide a preferred language"],
        enum: ["English", "Hindi", "Gujarati", "en", "hi", "gu"], // Added short codes
        default: "en",
      },
    },
    roles: {
      type: [String],
      default: ["user"],
    },
    savedSearches: [SavedSearchSchema],
    watchlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    purchaseHistory: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    disputes: [{ type: Schema.Types.ObjectId, ref: "Dispute" }],
    notifications: {
      unreadCount: { type: Number, default: 0 },
      preferences: {
        emailOnMessage: { type: Boolean, default: true },
        emailOnAuctionOutbid: { type: Boolean, default: true },
        pushOnMessage: { type: Boolean, default: true },
        pushOnAuctionOutbid: { type: Boolean, default: true },
      },
    },
    communicationPreference: String, // Can be mapped to notification preferences or kept separate
    lastLoginAt: Date,
  },
  {
    timestamps: true,
  },
);

// Compatibility with existing name field if needed, or derive from profile.firstName + profile.lastName
UserSchema.virtual("name").get(function (this: IUser) {
  if (this.profile?.firstName && this.profile?.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  if (this.profile?.firstName) return this.profile.firstName;
  if (this.profile?.displayName) return this.profile.displayName;
  return this.username;
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);