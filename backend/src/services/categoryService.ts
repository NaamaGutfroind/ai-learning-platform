import Category from '../models/Category';


export const createNewCategory = async ( name: string) => {
  const newCategory = new Category({
    
    name: name
  });
  return await newCategory.save(); 
};


export const getAllCategories = async () => {
  return await Category.find();
};