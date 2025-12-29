import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';


import { errorHandler } from './middleware/errorMiddleware'; 

import promptRoutes from './routes/promptRoutes';
import categoryRoutes from './routes/categoryRoutes';
import subCategoryRoutes from './routes/subCategoryRoutes';
import userRoutes from './routes/userRoutes'; 

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_learning';
mongoose.connect(mongoURI).then(() => console.log('Connected to MongoDB'));


app.use('/api/ai', promptRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sub-categories', subCategoryRoutes);
app.use('/api/users', userRoutes); 


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(cors());
