import { Request, Response } from 'express';
import * as subCategoryService from '../services/subCategoryService';

export const createSubCategory = async (req: Request, res: Response) => {
  try {
    const { _id, category_id, name } = req.body;
    
    if (!_id || !category_id || !name) {
      return res.status(400).json({ message: "All fields (_id, category_id, name) are required" });
    }

    const subCategory = await subCategoryService.createNewSubCategory(_id, category_id, name);
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating sub-category. Check if ID exists." });
  }
};

export const getSubCategories = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const subCategories = await subCategoryService.getSubCategoriesByCategory(categoryId);
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sub-categories" });
  }
};