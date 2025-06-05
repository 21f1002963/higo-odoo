"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Import all models to ensure their schemas are registered
require("./models/User");
require("./models/Product");
require("./models/Order");
require("./models/Cart");
require("./models/Bid");
require("./models/Rating");
require("./models/Complaint");
require("./models/Dispute");
require("./models/Language");
require("./models/Notification");
require("./models/AdminAction");
require("./models/AuditLog");
require("./models/MessageThread");
require("./models/Recommendation");
require("./models/SavedSearch");
const db_1 = require("./lib/db");
async function initAllCollections() {
    await (0, db_1.connectDB)();
    // Create a dummy document for each model to trigger collection creation
    const User = mongoose_1.default.model("User");
    const Product = mongoose_1.default.model("Product");
    const Order = mongoose_1.default.model("Order");
    const Cart = mongoose_1.default.model("Cart");
    const Bid = mongoose_1.default.model("Bid");
    const Rating = mongoose_1.default.model("Rating");
    const Complaint = mongoose_1.default.model("Complaint");
    const Dispute = mongoose_1.default.model("Dispute");
    const Language = mongoose_1.default.model("Language");
    const Notification = mongoose_1.default.model("Notification");
    const AdminAction = mongoose_1.default.model("AdminAction");
    const AuditLog = mongoose_1.default.model("AuditLog");
    const MessageThread = mongoose_1.default.model("MessageThread");
    const Recommendation = mongoose_1.default.model("Recommendation");
    const SavedSearch = mongoose_1.default.model("SavedSearch");
    // Insert dummy docs (with minimal required fields) and immediately delete them
    const dummyDocs = [
        User.create({ name: "dummy", email: "dummy@dummy.com", phone: "0000000000", password: "dummy" }).then(doc => User.deleteOne({ _id: doc._id })),
        Product.create({ sellerId: new mongoose_1.default.Types.ObjectId(), title: "dummy", description: "dummy", category: "Other", images: ["dummy.jpg"], isAuction: false, condition: "Good", listingType: "fixed", status: "active", quantity: 1 }).then(doc => Product.deleteOne({ _id: doc._id })),
        Order.create({ buyerId: new mongoose_1.default.Types.ObjectId(), sellerId: new mongoose_1.default.Types.ObjectId(), items: [{ productId: new mongoose_1.default.Types.ObjectId(), quantity: 1, purchasePrice: 1, titleSnapshot: "dummy" }], totalAmount: 1, status: "pending", paymentDetails: { paymentStatus: "pending" } }).then(doc => Order.deleteOne({ _id: doc._id })),
        Cart.create({ userId: new mongoose_1.default.Types.ObjectId(), items: [] }).then(doc => Cart.deleteOne({ _id: doc._id })),
        Bid.create({ productId: new mongoose_1.default.Types.ObjectId(), bidderId: new mongoose_1.default.Types.ObjectId(), amount: 1, isWinningBid: false }).then(doc => Bid.deleteOne({ _id: doc._id })),
        Rating.create({ orderId: new mongoose_1.default.Types.ObjectId(), reviewerId: new mongoose_1.default.Types.ObjectId(), revieweeId: new mongoose_1.default.Types.ObjectId(), revieweeType: "user", rating: 5 }).then(doc => Rating.deleteOne({ _id: doc._id })),
        Complaint.create({ complainantId: new mongoose_1.default.Types.ObjectId(), targetType: "user", targetId: new mongoose_1.default.Types.ObjectId(), reason: "dummy", status: "pending_review" }).then(doc => Complaint.deleteOne({ _id: doc._id })),
        Dispute.create({ raisedBy: new mongoose_1.default.Types.ObjectId(), subject: "dummy", description: "dummy", status: "open" }).then(doc => Dispute.deleteOne({ _id: doc._id })),
        Language.create({ code: "en", name: "English" }).then(doc => Language.deleteOne({ _id: doc._id })),
        Notification.create({ userId: new mongoose_1.default.Types.ObjectId(), type: "info", title: "dummy", text: "dummy" }).then(doc => Notification.deleteOne({ _id: doc._id })),
        AdminAction.create({ adminId: new mongoose_1.default.Types.ObjectId(), actionType: "dummy", target: { type: "user", id: new mongoose_1.default.Types.ObjectId() } }).then(doc => AdminAction.deleteOne({ _id: doc._id })),
        AuditLog.create({ entityType: "user", action: "dummy" }).then(doc => AuditLog.deleteOne({ _id: doc._id })),
        MessageThread.create({ participants: [new mongoose_1.default.Types.ObjectId()], latestMessage: { text: "dummy" } }).then(doc => MessageThread.deleteOne({ _id: doc._id })),
        Recommendation.create({ userId: new mongoose_1.default.Types.ObjectId(), productIds: [] }).then(doc => Recommendation.deleteOne({ _id: doc._id })),
        SavedSearch.create({ userId: new mongoose_1.default.Types.ObjectId(), query: "dummy" }).then(doc => SavedSearch.deleteOne({ _id: doc._id })),
    ];
    await Promise.all(dummyDocs);
    console.log("All collections initialized.");
    process.exit(0);
}
initAllCollections().catch((err) => {
    console.error("Error initializing collections:", err);
    process.exit(1);
});
