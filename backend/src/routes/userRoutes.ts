import express from 'express'; 
import { registerUser, getUserById, getAllUsers } from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router(); 

/**
 * @route   
 * @desc    
 */
router.post('/register', registerUser);

/**
 * @route   
 * @desc    
 */
router.get('/', protect, authorize('admin'), getAllUsers);

/**
 * @route  
 * @desc    
 */
router.get('/:id', protect, getUserById);

export default router;