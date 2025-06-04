import mongoose, { Schema, type Document } from "mongoose";

interface ITranslation {
    key: string; // e.g., "homepage.welcome_message"
    text: string; // The translated text
}
export interface ILanguageString extends Document {
  locale: "en" | "hi" | "gu"; // Or other supported locales
  namespace: string; // e.g., "common", "product", "profile"
  translations: ITranslation[];
  createdAt: Date;
  updatedAt: Date;
}

const TranslationSchema = new Schema<ITranslation>({
    key: { type: String, required: true },
    text: { type: String, required: true }
}, {_id: false});

const LanguageStringSchema = new Schema<ILanguageString>(
  {
    locale: { type: String, required: true, enum: ["en", "hi", "gu"], index: true },
    namespace: { type: String, required: true, default: "common", index: true },
    translations: [TranslationSchema],
  },
  {
    timestamps: true,
  },
);

LanguageStringSchema.index({ locale: 1, namespace: 1, "translations.key": 1}, { unique: true });


export default mongoose.models.LanguageString || mongoose.model<ILanguageString>("LanguageString", LanguageStringSchema);