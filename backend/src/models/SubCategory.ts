import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubCategory extends Document {
  category_id: string;
  name: string;
  // _id כבר קיים ב-Document, אין צורך להגדיר שוב
}

const SubCategorySchema: Schema<ISubCategory> = new Schema({
  category_id: { type: String, ref: 'Category', required: true },
  name: { type: String, required: true }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  // הסרת _id: false – עכשיו Mongoose יוצר _id אוטומטית
});

const SubCategory: Model<ISubCategory> = mongoose.model<ISubCategory>('SubCategory', SubCategorySchema);

export default SubCategory;
