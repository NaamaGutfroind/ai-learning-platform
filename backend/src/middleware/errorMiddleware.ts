import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  console.error(`Error detected: ${err.message}`);

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'שגיאת שרת פנימית'
  });
};