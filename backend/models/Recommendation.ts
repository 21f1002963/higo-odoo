import mongoose, { Schema, type Document, Types } from "mongoose";

export interface IRecommendation extends Document {
  userId: Types.ObjectId;
  recommendedProductIds: Types.ObjectId[];
  context: string;
  createdAt: Date;
  updatedAt: Date;
}

const RecommendationSchema = new Schema<IRecommendation>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  recommendedProductIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  context: { type: String },
}, {
  timestamps: true,
});

export default mongoose.models.Recommendation || mongoose.model<IRecommendation>("Recommendation", RecommendationSchema);
