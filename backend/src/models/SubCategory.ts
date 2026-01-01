import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubCategory extends Document {
  category_id: string;
  name: string;
  
}

const SubCategorySchema: Schema<ISubCategory> = new Schema({
  category_id: { type: String, ref: 'Category', required: true },
  name: { type: String, required: true }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  
});

const SubCategory: Model<ISubCategory> = mongoose.model<ISubCategory>('SubCategory', SubCategorySchema);

export default SubCategory;
