import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import ErrorResponse from '../utils/errorResponse';

/**
 * @desc    רישום משתמש חדש
 * @route   POST /api/users/register
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, name, phone } = req.body;

    // 1. ולידציה בסיסית - בדיקה שכל השדות הגיעו מהפרונט/פוסטמן
    if (!id || !name || !phone) {
      return next(new ErrorResponse('נא לספק תעודת זהות, שם ומספר טלפון', 400));
    }

    // 2. בדיקה אם המשתמש כבר קיים במערכת (שימוש בסרוויס)
    const existingUser = await userService.findUserById(id);
    if (existingUser) {
      return next(new ErrorResponse('משתמש עם תעודת זהות זו כבר קיים במערכת', 400));
    }

    // 3. יצירת המשתמש החדש (שימוש בסרוויס)
    const user = await userService.createUser({ _id: id, name, phone });

    // 4. החזרת תשובה מוצלחת
    res.status(201).json({
      success: true,
      message: 'המשתמש נרשם בהצלחה',
      data: user
    });
  } catch (error: any) {
    // העברת השגיאה ל-ErrorHandler המרכזי
    next(error);
  }
};

/**
 * @desc    קבלת פרטי משתמש לפי ID
 * @route   GET /api/users/:id
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // חיפוש המשתמש בסרוויס
    const user = await userService.findUserById(id);

    // אם המשתמש לא נמצא
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