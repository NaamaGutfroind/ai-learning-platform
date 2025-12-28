import mongoose, { Schema, Document } from 'mongoose';


export interface IUser extends Document<string> {
  _id: string; 
  name: string;
  phone: string;
}

const UserSchema: Schema = new Schema({
  _id: { type: String, required: true }, 
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  _id: false 
});

export default mongoose.model<IUser>('User', UserSchema);