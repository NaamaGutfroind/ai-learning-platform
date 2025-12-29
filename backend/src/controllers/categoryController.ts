import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';

/**
 * @desc    יצירת קטגוריה חדשה
 * @route   POST /api/categories
 */
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const category = await categoryService.createNewCategory(name);

    res.status(201).json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error('Create Category Error:', error);
    res.status(500).json({
      message: 'Error creating category'
    });
  }
};

/**
 * @desc    שליפת כל הקטגוריות
 * @route   GET /api/categories
 */
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (error) {
    console.error('Get Categories Error:', error);
    res.status(500).json({
      message: 'Error fetching categories'
    });
  }
};
