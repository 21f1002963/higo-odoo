import mongoose, { Schema, type Document, Types } from "mongoose";

export interface ISavedSearch extends Document {
  userId: Types.ObjectId;
  query: string;
  filters: Record<string, any>;
  priceAlertProductIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const SavedSearchSchema = new Schema<ISavedSearch>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  query: { type: String, required: true },
  filters: { type: Schema.Types.Mixed, default: {} },
  priceAlertProductIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
}, {
  timestamps: true,
});

export default mongoose.models.SavedSearch || mongoose.model<ISavedSearch>("SavedSearch", SavedSearchSchema);
