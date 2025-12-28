import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { _id, name } = req.body; 
    
    if (!_id || !name) {
      return res.status(400).json({ message: "ID and Name are required" });
    }

    const category = await categoryService.createNewCategory(_id, name);
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating category. Maybe ID already exists?" });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};