import mongoose, { Schema, Document } from 'mongoose';

export interface ISubCategory extends Document<string> {
  _id: string;
  category_id: string;
  name: string;
}

const SubCategorySchema: Schema = new Schema({
  _id: { type: String, required: true },
  category_id: { type: String, ref: 'Category', required: true },
  name: { type: String, required: true }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  _id: false 
});

export default mongoose.model<ISubCategory>('SubCategory', SubCategorySchema);