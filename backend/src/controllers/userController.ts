import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import ErrorResponse from '../utils/errorResponse';

/**
 * @desc
 * @route  
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, name, phone } = req.body;

     
    if (!id || !name || !phone) {
      return next(new ErrorResponse('נא לספק תעודת זהות, שם ומספר טלפון', 400));
    }

     
    const existingUser = await userService.findUserById(id);
    if (existingUser) {
      return next(new ErrorResponse('משתמש עם תעודת זהות זו כבר קיים במערכת', 400));
    }

    // 3. יצירת המשתמש החדש (שימוש בסרוויס)
    const user = await userService.createUser({ _id: id, name, phone });

    // 4. החזרת תשובה טובה במקרה והמשתמש הצליח להרשם
    res.status(201).json({
      success: true,
      message: 'המשתמש נרשם בהצלחה',
      data: user
    });
  } catch (error: any) {
  
    next(error);
  }
};

/**
 * @desc    
 * @route   
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
