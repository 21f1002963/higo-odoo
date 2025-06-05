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
const DisputeEvidenceSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    type: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
}, { _id: false });
const DisputeMessageSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
}, { _id: false });
const DisputeSchema = new mongoose_1.Schema({
    orderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Order", index: true },
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", index: true },
    raisedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    againstUser: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", index: true },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    status: {
        type: String,
        enum: ["open", "under_review", "awaiting_response", "resolved", "closed", "escalated"],
        default: "open",
        index: true,
    },
    evidence: [DisputeEvidenceSchema],
    messages: [DisputeMessageSchema],
    resolution: {
        resolvedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
        actionTaken: String,
        notes: String,
        resolvedAt: Date,
    },
    assignedTo: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", index: true },
}, {
    timestamps: true,
});
DisputeSchema.pre("save", function (next) {
    if (!this.orderId && !this.productId) {
        return next(new Error("Dispute must be associated with an order or a product."));
    }
    next();
});
exports.default = mongoose_1.default.models.Dispute || mongoose_1.default.model("Dispute", DisputeSchema);
