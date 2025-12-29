import SubCategory from '../models/SubCategory';

// לא מקבלים יותר id כי Mongoose יוצר אוטומטית
export const createNewSubCategory = async (category_id: string, name: string) => {
  const newSubCategory = new SubCategory({
    category_id,
    name
  });
  return await newSubCategory.save(); 
};

export const getSubCategoriesByCategory = async (category_id: string) => {
  return await SubCategory.find({ category_id });
};
