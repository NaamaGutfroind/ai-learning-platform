import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';


import { errorHandler } from './middleware/errorMiddleware'; 

import promptRouters from './routers/promptRouters';
import categoryRouters from './routers/categoryRouters';
import subCategoryRouters from './routers/subCategoryRouters';
import userRouters from './routers/userRouters'; 

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_learning';
mongoose.connect(mongoURI).then(() => console.log('Connected to MongoDB'));


app.use('/api/ai', promptRouters);
app.use('/api/categories', categoryRouters);
app.use('/api/sub-categories', subCategoryRouters);
app.use('/api/users', userRouters); 


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(cors());
