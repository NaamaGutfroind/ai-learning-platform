import express from 'express';
import { registerUser, getUserById } from '../controllers/userController';

const router = express.Router();

/**
 * @route   
 * @desc    
 */
router.post('/register', registerUser);

/**
 * @route   
 * @desc    קבלת פרטי משתמש לפי תעודת זהות
 */
router.get('/:id', getUserById);

export default router;
