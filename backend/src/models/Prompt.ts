import mongoose, { Schema, Document } from 'mongoose';

export interface IPrompt extends Document {
  user_id: string;
  category_id: string;
  sub_category_id: string;
  prompt: string;
  response: string;
}

const PromptSchema: Schema = new Schema(
  {
    user_id: { type: String, ref: 'User', required: true },
    category_id: { type: String, ref: 'Category', required: true },
    sub_category_id: { type: String, ref: 'SubCategory', required: true },
    prompt: { type: String, required: true },
    response: { type: String, required: true }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false }
  }
);

export default mongoose.model<IPrompt>('Prompt', PromptSchema);
