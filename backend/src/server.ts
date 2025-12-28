import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();

const app = express();
app.use(express.json());

// חיבור הראוטים
app.use('/api/users', userRoutes);

// Middleware לטיפול בשגיאות (חייב להיות בסוף)
app.use(errorHandler);

// חיבור ל-MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_platform';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));