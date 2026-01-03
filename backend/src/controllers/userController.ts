import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import User from '../models/User';
import ErrorResponse from '../utils/errorResponse';
import * as jwt from 'jsonwebtoken';

/**
 * @route   POST /api/users/register
 * @desc    רישום משתמש חדש והנפקת טוקן (JWT)
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, name, phone, role } = req.body;

    //  בדיקה שכל השדות קיימים
    if (!id || !name || !phone) {
      return next(new ErrorResponse('נא לספק תעודת זהות, שם ומספר טלפון', 400));
    }

  

    // בדיקת תקינות תעודת זהות
    if (!/^\d{9}$/.test(id)) {
      return next(new ErrorResponse('תעודת זהות לא תקינה (חייבת להכיל 9 ספרות)', 400));
    }

    // בדיקת תקינות לטלפון שהמשתמש יכניס
    if (!/^\d{9,10}$/.test(phone)) {
      return next(new ErrorResponse('מספר טלפון לא תקין (חייב להכיל 9 או 10 ספרות)', 400));
    }

   

    // בדיקה אם המשתמש כבר קיים לפי ID 
    const existingUser = await User.findById(id);
    if (existingUser) {
      return next(new ErrorResponse('משתמש עם תעודת זהות זו כבר קיים במערכת', 400));
    }

    // בדיקה אם מספר הטלפון כבר תפוס
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return next(new ErrorResponse('מספר הטלפון הזה כבר רשום במערכת למשתמש אחר', 400));
    }

    // יצירת המשתמש
    const user = await userService.createUser({ _id: id, name, phone, role: role || 'user' });

    // יצירת הטוקן
    const secret = process.env.JWT_SECRET || 'fallbackSecretKey';
    const expire = process.env.JWT_EXPIRE || '1d';

    const token = jwt.sign(
      { id: user._id },
      secret as jwt.Secret, 
      { expiresIn: expire as any }
    );

    res.status(201).json({
      success: true,
      message: 'המשתמש נרשם בהצלחה',
      token, 
      data: user
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @route   POST /api/users/login
 * @desc    התחברות משתמש קיים לפי ID וטלפון
 */
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, phone, name } = req.body;

    if (!id || !phone || !name) {
      return next(new ErrorResponse('נא לספק שם, תעודת זהות ומספר טלפון', 400));
    }
    
    // חיפוש המשתמש
    const user = await User.findOne({ _id: id, phone, name });

    if (!user) {
      return next(new ErrorResponse('פרטי התחברות שגויים', 401));
    }

    const secret = process.env.JWT_SECRET || 'fallbackSecretKey';
    const expire = process.env.JWT_EXPIRE || '1d';

    const token = jwt.sign(
      { id: user._id },
      secret as jwt.Secret,
      { expiresIn: expire as any }
    );

    res.status(200).json({
      success: true,
      token,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users
 * @desc    שליפת כל המשתמשים (רק למנהלים)
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.status(200).json({ 
      success: true, 
      count: users.length, 
      data: users 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/:id
 * @desc    שליפת פרטי משתמש ספציפי לפי ID
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await userService.findUserById(id);
    
    if (!user) {
      return next(new ErrorResponse('משתמש לא נמצא', 404));
    }

    res.status(200).json({ 
      success: true, 
      data: user 
    });
  } catch (error: any) {
    next(error);
  }
};