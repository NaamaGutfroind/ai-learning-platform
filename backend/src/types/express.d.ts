import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      // אני מוסיפה פה את המשתמש כאופציונלי כי לא כל נתיב דורש אימות
      user?: IUser;
    }
  }
}
