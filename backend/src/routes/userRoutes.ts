import express from 'express';
import { registerUser, getUserById } from '../controllers/userController';

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    רישום משתמש חדש במערכת
 */
router.post('/register', registerUser);

/**
 * @route   GET /api/users/:id
 * @desc    קבלת פרטי משתמש לפי תעודת זהות
 */
router.get('/:id', getUserById);

export default router;