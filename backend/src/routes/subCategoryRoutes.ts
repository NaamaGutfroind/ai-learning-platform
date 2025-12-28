import express from 'express';
import { createSubCategory, getSubCategories } from '../controllers/subCategoryController';

const router = express.Router();

router.post('/', createSubCategory);
router.get('/:categoryId', getSubCategories); 

export default router;