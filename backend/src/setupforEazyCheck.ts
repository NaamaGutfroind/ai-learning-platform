import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category';
import SubCategory from './models/SubCategory';
import User from './models/User';
import Prompt from './models/Prompt'; 

dotenv.config();


const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_learning';
    await mongoose.connect(mongoURI);
    console.log(' MongoDB Connected for Setup...');
  } catch (error) {
    console.error('Connection Error:', error);
    process.exit(1);
  }
};

const setupData = async () => {
  await connectDB();

  try {
   
    console.log(' Cleaning database...');
    await Prompt.deleteMany({});     
    await Category.deleteMany({});   
    await SubCategory.deleteMany({}); 
    await User.deleteMany({});        
    console.log(' Database cleared successfully.');

    //  יצירת משתמש אדמין (לבדיקת דף המנהל)
    await User.create({
      _id: '333333333', 
      name: 'Admin User',
      phone: '0500000000',
      role: 'admin'
    });
    console.log(' Admin user created: ID 333333333 (Pass: none)');

    //  יצירת משתמש רגיל (לבדיקת דף המשתמש וההיסטוריה האישית)
    await User.create({
      _id: '123456789', 
      name: 'Israel Israeli',
      phone: '0521234567',
      role: 'user'
    });
    console.log('Regular user created: ID 123456789 (Pass: none)');

    //  יצירת קטגוריות ותתי-קטגוריות
    const categoriesData = [
      {
        name: 'Programming',
        subs: ['Python', 'Java', 'React', 'C++']
      },
      {
        name: 'Science',
        subs: ['Black hole', 'Biology',]
      },
      {
        name: 'History',
        subs: ['World War II']
      },
      {
        name: 'Languages',
        subs: ['English', 'Spanish', 'Hebrew', 'French']
      }
    ];

    for (const catData of categoriesData) {
      // יצירת הקטגוריה
      const category = await Category.create({ name: catData.name });
      
      // הכנת תתי-הקטגוריות עם ה-ID של הקטגוריה החדשה
      const subs = catData.subs.map(subName => ({
        category_id: category._id,
        name: subName
      }));
      
      // שמירת תתי-הקטגוריות
      await SubCategory.insertMany(subs);
      console.log(`Created Category: ${catData.name} with ${subs.length} topics.`);
    }

    console.log('\nSetup Completed Successfully! System is ready for Easy Check.');
    process.exit();
  } catch (error) {
    console.error(' Error with setup:', error);
    process.exit(1);
  }
};

setupData();