import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import ErrorResponse from '../utils/errorResponse';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['user-id'] as string;

  if (!userId) {
    return next(new ErrorResponse('גישה נחסמה: נא לספק מזהה משתמש ב-Headers', 401));
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorResponse('משתמש לא קיים במערכת', 401));
    }

    (req as any).user = user;
    next();
  } catch (error) {
    next(error);
  }
};