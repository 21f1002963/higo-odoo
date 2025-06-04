import mongoose, { Schema, type Document, Types } from "mongoose";

interface IAuctionBid {
  bidderId: Types.ObjectId;
  amount: number;
  bidTime: Date;
}

interface IShippingOption {
  method: string;
  cost: number;
  estimatedDeliveryDays?: number;
}

export interface IProduct extends Document {
  sellerId: Types.ObjectId;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  images: string[];
  price?: number;
  isAuction: boolean;
  auctionDetails?: {
    minimumBid: number;
    reservePrice?: number;
    startTime: Date;
    endTime: Date;
    currentHighestBid?: number;
    currentHighestBidder?: Types.ObjectId;
    bidCount?: number;
    bids?: IAuctionBid[];
  };
  condition: "New" | "Like New" | "Good" | "Fair" | "Poor" | "Used – Acceptable";
  brand?: string;
  productModel?: string;
  material?: string;
  color?: string;
  year?: number;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    coordinates?: [number, number];
    addressText?: string;
  };
  shippingOptions?: IShippingOption[];
  listingType: "fixed" | "auction";
  status: "active" | "sold" | "closed" | "deleted" | "pending_approval";
  viewCount?: number;
  tags?: string[];
  likes?: number;
  watchCount?: number;
  sellerRatingAvg?: number;
  sellerRatingCount?: number;
  originalPackaging?: boolean;
  manualIncluded?: boolean;
  workingCondition?: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const AuctionBidSchema = new Schema<IAuctionBid>({
  bidderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  bidTime: { type: Date, default: Date.now },
});

const ShippingOptionSchema = new Schema<IShippingOption>({
  method: { type: String, required: true },
  cost: { type: Number, required: true, min: 0 },
  estimatedDeliveryDays: Number,
});

const ProductSchema = new Schema<IProduct>(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: [100, "Title cannot be more than 100 characters"] },
    description: { type: String, required: true, maxlength: [1000, "Description cannot be more than 1000 characters"] },
    category: { type: String, required: true, index: true, enum: ["Electronics", "Clothing", "Furniture", "Books", "Home", "Sports", "Toys", "Vehicles", "Other"] },
    subcategory: { type: String, index: true },
    images: {
      type: [String],
      required: [true, "Please provide at least one image"],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "Please provide at least one image",
      },
    },
    price: { type: Number, min: [0, "Price must be at least 0"] },
    isAuction: { type: Boolean, default: false },
    auctionDetails: {
      minimumBid: { type: Number, min: [0, "Minimum bid must be at least 0"] },
      reservePrice: { type: Number, min: [0, "Reserve price must be at least 0"] },
      startTime: Date,
      endTime: Date,
      currentHighestBid: Number,
      currentHighestBidder: { type: Schema.Types.ObjectId, ref: "User" },
      bidCount: { type: Number, default: 0 },
      bids: [AuctionBidSchema],
    },
    condition: {
      type: String,
      required: true,
      enum: ["New", "Like New", "Good", "Fair", "Poor", "Used – Acceptable"],
    },
    brand: String,
    productModel: String,
    material: String,
    color: String,
    year: Number,
    location: {
      city: String,
      state: String,
      country: String,
      coordinates: { type: [Number], index: "2dsphere" },
      addressText: String,
    },
    shippingOptions: [ShippingOptionSchema],
    listingType: { type: String, required: true, enum: ["fixed", "auction"], default: "fixed" },
    status: { type: String, required: true, enum: ["active", "sold", "closed", "deleted", "pending_approval"], default: "active", index: true },
    viewCount: { type: Number, default: 0 },
    tags: [String],
    likes: { type: Number, default: 0 },
    watchCount: { type: Number, default: 0 },
    sellerRatingAvg: Number,
    sellerRatingCount: Number,
    originalPackaging: { type: Boolean, default: false },
    manualIncluded: { type: Boolean, default: false },
    workingCondition: String,
    quantity: { type: Number, required: true, min: [1, "Quantity must be at least 1"], default: 1 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Validation to ensure price is set for fixed listings, or auctionDetails for auction listings
ProductSchema.pre<IProduct>("save", function (next) {
  if (this.isAuction) {
    if (!this.auctionDetails || !this.auctionDetails.minimumBid || !this.auctionDetails.startTime || !this.auctionDetails.endTime) {
      next(new Error("Auction details (minimumBid, startTime, endTime) are required for auction listings."));
    } else {
      this.price = undefined;
      this.listingType = "auction";
      next();
    }
  } else {
    if (typeof this.price !== 'number' || this.price < 0) {
      next(new Error("Price is required for fixed-price listings."));
    } else {
      this.auctionDetails = undefined;
      this.listingType = "fixed";
      next();
    }
  }
});

// Index for geospatial queries
ProductSchema.index({ location: '2dsphere' });
// Index for text search
ProductSchema.index({ title: 'text', description: 'text' });

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
