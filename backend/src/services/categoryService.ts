import Category from '../models/Category';


export const createNewCategory = async (id: string, name: string) => {
  const newCategory = new Category({
    _id: id,
    name: name
  });
  return await newCategory.save(); 
};


export const getAllCategories = async () => {
  return await Category.find();
};