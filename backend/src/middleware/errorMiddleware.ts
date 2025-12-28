import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
 
  let error = { ...err };
  error.message = err.message;

 
  console.error(`Error detected: ${err.message}`);


  if (err.code === 11000) {
    const message = 'הנתונים שהזנת  כבר קיימים במערכת';
    return res.status(400).json({
      success: false,
      message: message
    });
  }

 
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    return res.status(400).json({
      success: false,
      message: message
    });
  }


  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message || 'שגיאת שרת פנימית'
  });
};