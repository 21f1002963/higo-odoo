import mongoose, { Schema, type Document } from "mongoose";

export interface ILanguage extends Document {
  code: string; // e.g. 'en', 'hi', 'gu'
  name: string; // e.g. 'English', 'Hindi', 'Gujarati'
  translations: Record<string, string>; // key-value pairs for UI translations
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LanguageSchema = new Schema<ILanguage>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  translations: { type: Schema.Types.Mixed, default: {} },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export default mongoose.models.Language || mongoose.model<ILanguage>("Language", LanguageSchema);
