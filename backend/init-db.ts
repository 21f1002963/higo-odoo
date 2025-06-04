import mongoose from "mongoose";

// Import all models to ensure their schemas are registered
import "./models/User";
import "./models/Product";
import "./models/Order";
import "./models/Cart";
import "./models/Bid";
import "./models/Rating";
import "./models/Complaint";
import "./models/Dispute";
import "./models/Language";
import "./models/Notification";
import "./models/AdminAction";
import "./models/AuditLog";
import "./models/MessageThread";
import "./models/Recommendation";
import "./models/SavedSearch";

import { connectDB } from "./lib/db";

async function initAllCollections() {
  await connectDB();
  // Create a dummy document for each model to trigger collection creation
  const User = mongoose.model("User");
  const Product = mongoose.model("Product");
  const Order = mongoose.model("Order");
  const Cart = mongoose.model("Cart");
  const Bid = mongoose.model("Bid");
  const Rating = mongoose.model("Rating");
  const Complaint = mongoose.model("Complaint");
  const Dispute = mongoose.model("Dispute");
  const Language = mongoose.model("Language");
  const Notification = mongoose.model("Notification");
  const AdminAction = mongoose.model("AdminAction");
  const AuditLog = mongoose.model("AuditLog");
  const MessageThread = mongoose.model("MessageThread");
  const Recommendation = mongoose.model("Recommendation");
  const SavedSearch = mongoose.model("SavedSearch");

  // Insert dummy docs (with minimal required fields) and immediately delete them
  const dummyDocs = [
    User.create({ name: "dummy", email: "dummy@dummy.com", phone: "0000000000", password: "dummy" }).then(doc => User.deleteOne({ _id: doc._id })),
    Product.create({ sellerId: new mongoose.Types.ObjectId(), title: "dummy", description: "dummy", category: "Other", images: ["dummy.jpg"], isAuction: false, condition: "Good", listingType: "fixed", status: "active", quantity: 1 }).then(doc => Product.deleteOne({ _id: doc._id })),
    Order.create({ buyerId: new mongoose.Types.ObjectId(), sellerId: new mongoose.Types.ObjectId(), items: [{ productId: new mongoose.Types.ObjectId(), quantity: 1, purchasePrice: 1, titleSnapshot: "dummy" }], totalAmount: 1, status: "pending", paymentDetails: { paymentStatus: "pending" } }).then(doc => Order.deleteOne({ _id: doc._id })),
    Cart.create({ userId: new mongoose.Types.ObjectId(), items: [] }).then(doc => Cart.deleteOne({ _id: doc._id })),
    Bid.create({ productId: new mongoose.Types.ObjectId(), bidderId: new mongoose.Types.ObjectId(), amount: 1, isWinningBid: false }).then(doc => Bid.deleteOne({ _id: doc._id })),
    Rating.create({ orderId: new mongoose.Types.ObjectId(), reviewerId: new mongoose.Types.ObjectId(), revieweeId: new mongoose.Types.ObjectId(), revieweeType: "user", rating: 5 }).then(doc => Rating.deleteOne({ _id: doc._id })),
    Complaint.create({ complainantId: new mongoose.Types.ObjectId(), targetType: "user", targetId: new mongoose.Types.ObjectId(), reason: "dummy", status: "pending_review" }).then(doc => Complaint.deleteOne({ _id: doc._id })),
    Dispute.create({ raisedBy: new mongoose.Types.ObjectId(), subject: "dummy", description: "dummy", status: "open" }).then(doc => Dispute.deleteOne({ _id: doc._id })),
    Language.create({ code: "en", name: "English" }).then(doc => Language.deleteOne({ _id: doc._id })),
    Notification.create({ userId: new mongoose.Types.ObjectId(), type: "info", title: "dummy", text: "dummy" }).then(doc => Notification.deleteOne({ _id: doc._id })),
    AdminAction.create({ adminId: new mongoose.Types.ObjectId(), actionType: "dummy", target: { type: "user", id: new mongoose.Types.ObjectId() } }).then(doc => AdminAction.deleteOne({ _id: doc._id })),
    AuditLog.create({ entityType: "user", action: "dummy" }).then(doc => AuditLog.deleteOne({ _id: doc._id })),
    MessageThread.create({ participants: [new mongoose.Types.ObjectId()], latestMessage: { text: "dummy" } }).then(doc => MessageThread.deleteOne({ _id: doc._id })),
    Recommendation.create({ userId: new mongoose.Types.ObjectId(), productIds: [] }).then(doc => Recommendation.deleteOne({ _id: doc._id })),
    SavedSearch.create({ userId: new mongoose.Types.ObjectId(), query: "dummy" }).then(doc => SavedSearch.deleteOne({ _id: doc._id })),
  ];

  await Promise.all(dummyDocs);
  console.log("All collections initialized.");
  process.exit(0);
}

initAllCollections().catch((err) => {
  console.error("Error initializing collections:", err);
  process.exit(1);
});
