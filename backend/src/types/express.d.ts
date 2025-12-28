import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      // אנחנו מוסיפים את המשתמש כאופציונלי כי לא כל נתיב דורש אימות
      user?: IUser;
    }
  }
}