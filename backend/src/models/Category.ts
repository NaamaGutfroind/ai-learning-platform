import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document<string> {
  _id: string;
  name: string;
}

const CategorySchema: Schema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, unique: true }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  _id: false 
});

export default mongoose.model<ICategory>('Category', CategorySchema);