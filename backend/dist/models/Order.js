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
const OrderItemSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    purchasePrice: { type: Number, required: true, min: 0 },
    titleSnapshot: { type: String, required: true },
    imageSnapshot: String,
}, { _id: false });
const OrderSchema = new mongoose_1.Schema({
    buyerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sellerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: {
        type: [OrderItemSchema],
        required: true,
        validate: {
            validator: (v) => Array.isArray(v) && v.length > 0,
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
exports.default = mongoose_1.default.models.Order || mongoose_1.default.model("Order", OrderSchema);
