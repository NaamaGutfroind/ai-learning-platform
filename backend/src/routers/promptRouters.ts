import express from 'express';
import { getAIContent, getHistory, getAllPrompts } from '../controllers/promptController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();


router.post('/generate', protect, getAIContent);


router.get('/history/:user_id', protect, getHistory);


router.get('/all', protect, authorize('admin'), getAllPrompts);

export default router;