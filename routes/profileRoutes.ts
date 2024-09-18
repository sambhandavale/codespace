import express, { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
