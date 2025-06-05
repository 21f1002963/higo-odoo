"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const AuctionBidSchema = new mongoose_1.Schema({
    bidderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    bidTime: { type: Date, default: Date.now },
});
const ShippingOptionSchema = new mongoose_1.Schema({
    method: { type: String, required: true },
    cost: { type: Number, required: true, min: 0 },
    estimatedDeliveryDays: Number,
});
const ProductSchema = new mongoose_1.Schema({
    sellerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: [100, "Title cannot be more than 100 characters"] },
    description: { type: String, required: true, maxlength: [1000, "Description cannot be more than 1000 characters"] },
    category: { type: String, required: true, index: true, enum: ["Electronics", "Clothing", "Furniture", "Books", "Home", "Sports", "Toys", "Vehicles", "Other"] },
    subcategory: { type: String, index: true },
    images: {
        type: [String],
        required: [true, "Please provide at least one image"],
        validate: {
            validator: (v) => Array.isArray(v) && v.length > 0,
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
        currentHighestBidder: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Validation to ensure price is set for fixed listings, or auctionDetails for auction listings
ProductSchema.pre("save", function (next) {
    if (this.isAuction) {
        if (!this.auctionDetails || !this.auctionDetails.minimumBid || !this.auctionDetails.startTime || !this.auctionDetails.endTime) {
            next(new Error("Auction details (minimumBid, startTime, endTime) are required for auction listings."));
        }
        else {
            this.price = undefined;
            this.listingType = "auction";
            next();
        }
    }
    else {
        if (typeof this.price !== 'number' || this.price < 0) {
            next(new Error("Price is required for fixed-price listings."));
        }
        else {
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
exports.default = mongoose_1.default.models.Product || mongoose_1.default.model("Product", ProductSchema);
