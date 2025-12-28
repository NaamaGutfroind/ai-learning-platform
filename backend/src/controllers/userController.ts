import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import User from '../models/User';
import ErrorResponse from '../utils/errorResponse';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, name, phone, role } = req.body; 

    
    if (!id || !name || !phone) {
      return next(new ErrorResponse('נא לספק תעודת זהות, שם ומספר טלפון', 400));
    }

   
    const existingUser = await User.findById(id);
    if (existingUser) {
      return next(new ErrorResponse('משתמש עם תעודת זהות זו כבר קיים במערכת', 400));
    }

    
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return next(new ErrorResponse('מספר הטלפון הזה כבר רשום במערכת למשתמש אחר', 400));
    }

   
    const user = await userService.createUser({ _id: id, name, phone, role: role || 'user' });

    res.status(201).json({
      success: true,
      message: 'המשתמש נרשם בהצלחה',
      data: user
    });
  } catch (error: any) {
    
    next(error);
  }
};
//שליפת כל המשתמשים -כמובן שרק מי שיוגדר כמנהל יוכל לעשות את זה
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// שליפת משתמש ספציפי
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await userService.findUserById(id);
    if (!user) return next(new ErrorResponse('משתמש לא נמצא', 404));
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    next(error);
  }
};