import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document<string> {
  _id: string; 
  name: string;
  phone: string;
  role: 'user' | 'admin';//השדה הזה  לא היה כתוב במפורש בדרישת המפורטות של הפרוייקט אבל לדעתי זה נצרך
}

const UserSchema: Schema = new Schema({
  _id: { type: String, required: true }, 
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  _id: false 
});

export default mongoose.model<IUser>('User', UserSchema);